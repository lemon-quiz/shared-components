import {
  BehaviorSubject, Observable, Subject, Subscription,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { ComplexInterface, NodeType, PageInterface } from '../Interfaces/template.interface';
import AbstractValidator from './validator/AbstractValidator';

export default class Parser {
  static EQ_STRICT_EQUAL = '===';

  static EQ_STRICT_NOT_EQUAL = '!==';

  static EQ_GTE = '>';

  static EQ_LTE = '<';

  static EQ_GTE_OR_EQUAL = '>==';

  static EQ_LTE_OR_EQUAL = '<==';

  private internalPage = new BehaviorSubject<PageInterface>([]);

  private get staticPage(): PageInterface {
    return Parser.clone(this.internalPage.getValue());
  }

  private set staticPage(value: PageInterface) {
    this.internalPage.next(Parser.clone(value));
  }

  public get page(): Observable<PageInterface> {
    return this.internalPage.asObservable();
  }

  private destroy = new Subject();

  private validator: AbstractValidator;

  private nodesById: {
    [key: string]: BehaviorSubject<any>
  } = {};

  private subscriptions: {
    [key: string]: {
      [key: string]: Subscription;
    }
  };

  private runShowHide = false;

  private errorsList = {};

  public constructor(validator: AbstractValidator) {
    this.validator = validator;
  }

  public loadTemplate(template: PageInterface, page: PageInterface): void {
    this.destroy.next(true);
    this.nodesById = {};
    this.subscriptions = {};
    this.runShowHide = false;

    const parsed = this.parse(template, page);
    this.staticPage = parsed;

    this.searchShowHide(parsed);
  }

  private static clone(page: PageInterface) {
    return JSON.parse(JSON.stringify(page));
  }

  public getPage(): PageInterface {
    return this.staticPage;
  }

  /**
   *
   * @param template
   * @param page
   * @param path
   * @private
   */
  private parse(template: PageInterface, page: PageInterface = [], path: number[] = []): PageInterface {
    const staticPage: any[] = [];
    // eslint-disable-next-line consistent-return
    template.forEach((templateNode, index) => {
      if (templateNode.type === 'complex') {
        const nodes = this.findAllNodes(templateNode as ComplexInterface, page);

        nodes.forEach(({
          children,
          ...rest
        }) => {
          const newChildren = this.parse(templateNode.children, children ?? [], [...path, index]);

          staticPage.push({
            ...rest,
            children: newChildren,
          });
        });
        staticPage.push({
          ...templateNode,
          tuuid: uuidv4(),
        });
        return staticPage;
      }

      const nodes = this.findAllNodes(templateNode, page);

      nodes.forEach((dataNode) => {
        staticPage.push(dataNode);
      });

      staticPage.push({
        ...templateNode,
        tuuid: uuidv4(),
      });
    });

    return staticPage;
  }

  /**
   *
   * @param node
   * @param data
   * @private
   */
  private findAllNodes(node: NodeType, data: PageInterface): NodeType[] {
    const {
      name,
      type,
    } = node;

    const nodes = data.filter((dataNode: NodeType) => (
      dataNode.name === name && dataNode.type === type && dataNode.uuid
    ))
      .map((dataNode) => ({
        ...node,
        ...{
          value: dataNode.value,
          uuid: dataNode.uuid,
          children: dataNode.children,
          display: (!(node.show || node.hide)),
        },
      }));

    if (nodes.length > 0) {
      if (!node.multiple) {
        const firstChild = nodes.shift();
        this.nodesById[firstChild.uuid] = null;

        return [firstChild];
      }

      nodes.forEach((thisNode) => {
        this.nodesById[thisNode.uuid] = null;
      });

      return nodes;
    }

    if (node.mandatory) {
      const uuid = uuidv4();
      const newNode: NodeType = {
        ...node,
        display: (!(node.show || node.hide)),
        uuid,
      };
      this.nodesById[newNode.uuid] = null;
      return [newNode];
    }

    return [];
  }

  /**
   * Update the value for given node
   *
   * @param data
   * @param updateUuid
   * @param values
   * @private
   */
  private updateNode(data: NodeType[], updateUuid: string, values: { [key: string]: any }): NodeType[] {
    return data.map((node) => {
      const {
        uuid,
        children,
      } = node;

      if (uuid === updateUuid) {
        return ({ ...node, ...values });
      }

      if (Array.isArray(children)) {
        return {
          ...node,
          children: this.updateNode(children, updateUuid, values),
        };
      }

      return node;
    });
  }

  /**
   * Setting the value fo a node, this does not trigger a re-render.
   *
   * @param id
   * @param value
   * @param errors
   */
  public setValue(id, value: any, errors?: any): void {
    this.staticPage = this.updateNode(this.staticPage, id, {
      value,
      errors,
    });

    if (!this.nodesById[id]) {
      this.nodesById[id] = new BehaviorSubject({
        value,
        errors,
      });

      return;
    }

    const merged = { ...this.nodesById[id].getValue(), value, errors };
    this.nodesById[id].next(merged);
  }

  /**
   * Setting custom params, triggers a re-render.
   *
   * @param id
   * @param params
   */
  public setParams(id, params: any): void {
    this.staticPage = this.updateNode(this.staticPage, id, params);

    if (!this.nodesById[id]) {
      this.nodesById[id] = new BehaviorSubject(params);

      return;
    }

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      uuid, tuuid, name, type, ...rest
    } = params;

    const merged = { ...this.nodesById[id].getValue(), ...rest };

    this.nodesById[id].next(merged);
  }

  /**
   * Return the value for a given node
   *
   * @param id
   * @param defaultValue
   * @param defaultErrors
   */
  public getValue(id, defaultValue, defaultErrors): { value: any, errors: any } {
    return this.nodesById?.[id]?.getValue() ?? {
      value: defaultValue,
      errors: defaultErrors,
    };
  }

  /**
   * Move a node 1 position up
   *
   * @param path
   * @param index
   */
  public moveUp(path: number[], index?: number) {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const page = this.staticPage;
    const {
      siblings,
    } = this.getFromPath(clonePath, page);
    const {
      name,
      type,
    } = siblings[nodeIndex];
    const canMove = Parser.canMoveUpInternal(siblings, nodeIndex, type, name);

    if (canMove) {
      const newIndex = (typeof index !== 'undefined' ? index : nodeIndex - 1);
      siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
    }

    this.staticPage = page;
  }

  /**
   * Move node one position up
   * @param path
   * @param index
   */
  public moveDown(path: number[], index?: number) {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const page = this.staticPage;
    const {
      parent,
      siblings,
    } = this.getFromPath(clonePath, page);

    const {
      name,
      type,
    } = siblings[nodeIndex];
    const canMove = Parser.canMoveDownInternal(siblings, nodeIndex, type, name);

    if (canMove) {
      const newIndex = (typeof index !== 'undefined' ? index : nodeIndex + 1);
      siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
      this.resetIndex(parent, siblings);
    }
    this.staticPage = page;
  }

  /**
   * Check if node can be moved down.
   *
   * @param path
   * @param index
   * @param type
   * @param name
   */
  public canMoveUp(path: number[], index: number, type: string, name: string): boolean {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.staticPage);
    return Parser.canMoveUpInternal(siblings, nodeIndex, type, name);
  }

  /**
   * Check if a node can be added
   *
   * @param path
   */
  public canAdd(path: number[]): boolean {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.staticPage);

    const {
      name,
      type,
      multiple,
      uuid,
      tuuid,
    } = siblings[nodeIndex];

    if (uuid && !multiple) {
      return false;
    }

    if (tuuid && !multiple) {
      if (nodeIndex === 0) {
        return true;
      }

      const precedingSibling = siblings[nodeIndex - 1];

      if (precedingSibling.name !== name || precedingSibling.type !== type || !precedingSibling.uuid) {
        return true;
      }
    }

    return !!multiple;
  }

  /**
   * Add new node add given position
   *
   * @param path
   * @param index
   * @param amount
   */
  public addNode(path: number[], index?: number, amount?: number) {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const page = this.staticPage;
    const { siblings } = this.getFromPath([...clonePath], page);
    const {
      name,
      type,
    } = siblings[nodeIndex];
    const templateNode = siblings.find((node) => (node.name === name && node.type === type && !node.uuid && node.tuuid));

    if (!templateNode) {
      // eslint-disable-next-line no-console
      console.error(`Template node type: ${type}, name: ${name} was not found.`);

      this.staticPage = page;

      return;
    }

    if (!amount) {
      const newNode = this.initNode(templateNode);
      const insertIndex = typeof index !== 'undefined' ? index + 1 : nodeIndex;
      siblings.splice(insertIndex, 0, newNode);

      this.staticPage = page;
      this.searchShowHide(page);

      return;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= amount; i++) {
      const newNode = this.initNode(templateNode);
      const insertIndex = typeof index !== 'undefined' ? index : nodeIndex;

      siblings.splice(insertIndex, 0, newNode);
    }

    this.staticPage = page;
    this.searchShowHide(page);
  }

  /**
   *
   * @param path
   * @param amount
   */
  public deleteNode(path: number[], amount?: number) {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const page = this.staticPage;
    const { siblings } = this.getFromPath([...clonePath], page);

    if (!amount) {
      if (!this.canDelete(path)) {
        this.staticPage = page;
        return;
      }

      siblings.splice(nodeIndex, 1);
      this.staticPage = page;
      return;
    }

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= amount; i++) {
      if (!this.canDelete([...clonePath, nodeIndex - i])) {
        this.staticPage = page;
        return;
      }

      siblings.splice(nodeIndex - i, 1);
    }

    this.staticPage = page;
  }

  /**
   *
   * @param path
   */
  public canDelete(path: number[]): boolean {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.staticPage);
    const {
      type,
      name,
    } = siblings[nodeIndex];

    return Parser.canDeleteNodeInternal(siblings, type, name);
  }

  /**
   *
   * @param siblings
   * @param type
   * @param name
   * @private
   */
  private static canDeleteNodeInternal(siblings, type, name): boolean {
    const filtered = siblings.filter((node) => node.name === name && node.type === type && typeof node.uuid !== 'undefined');
    const templateNode = siblings.find((node) => node.name === name && node.type === type && typeof node.tuuid !== 'undefined');

    if (!templateNode.mandatory) {
      return true;
    }

    return templateNode.mandatory && filtered.length > 1;
  }

  /**
   * Initiate a given node
   *
   * @param node
   * @private
   */
  private initNode(node: NodeType) {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tuuid,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      uuid,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value,
      ...rest
    } = node;

    const newNode = {
      ...rest,
      uuid: uuidv4(),
    };

    return this.parse([rest], [newNode])[0];
  }

  /**
   * Check if node can me moved up
   *
   * @param path
   * @param index
   * @param type
   * @param name
   */
  public canMoveDown(path: number[], index: number, type: string, name: string): boolean {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.staticPage);
    return Parser.canMoveDownInternal(siblings, nodeIndex, type, name);
  }

  /**
   *  Check if a node can be moved up.
   *  For this to be true there should be an preceding initiated node
   *  with the same type and name
   *
   * @param siblings
   * @param index
   * @param type
   * @param name
   * @private
   */
  private static canMoveUpInternal(siblings, index, type, name): boolean {
    if (index === 0) {
      return false;
    }

    const precedingSibling = siblings[index - 1];
    return typeof precedingSibling.uuid !== 'undefined' && precedingSibling.name === name && precedingSibling.type === type;
  }

  /**
   *
   * @param siblings
   * @param index
   * @param type
   * @param name
   * @private
   */
  private static canMoveDownInternal(siblings, index, type, name): boolean {
    if (!siblings[index + 1]) {
      return false;
    }

    const nextSibling = siblings[index + 1];
    return typeof nextSibling.uuid !== 'undefined' && nextSibling.name === name && nextSibling.type === type;
  }

  /**
   *
   * Get reference to deep data, this can be used to alter the tree
   *
   * @param path
   * @param data
   * @public
   */
  public getFromPath(path: number[], data): { parent: null | NodeType, siblings: NodeType[] } {
    if (path.length === 0) {
      return {
        parent: null,
        siblings: data,
      };
    }

    const index = path.shift();

    if (path.length > 0) {
      return this.getFromPath(path, data[index].children);
    }

    return {
      parent: data[index],
      siblings: data[index].children,
    };
  }

  /**
   * Probably not needed
   *
   * @param parent
   * @param siblings
   * @private
   */
  private resetIndex(parent: null | NodeType, siblings: NodeType[]): void {
    if (parent === null) {
      this.staticPage = siblings.filter(() => true);

      return;
    }

    // eslint-disable-next-line no-param-reassign
    (parent as NodeType).children = siblings.filter(() => true);
  }

  /**
   * Validate the whole page and return the errors
   */
  public getPageErrors() {
    this.errorsList = {};
    this.staticPage = this.validateNodes(this.staticPage);

    return Object.keys(this.errorsList).length > 0 ? this.errorsList : null;
  }

  /**
   * Loop through the page data and validate the nodes.
   *
   * @param data
   * @private
   */
  private validateNodes(data: NodeType[]): NodeType[] {
    return data.map((node: NodeType) => {
      if (!node.uuid || !node.display) {
        return node;
      }

      const errors = this.validator.checkInput(node, node.value);

      if (errors) {
        this.errorsList[node.uuid] = {
          uuid: node.uuid,
          errors,
        };
      }

      if (node.children) {
        const children = this.validateNodes(node.children);
        return ({
          ...node,
          errors,
          children,
        });
      }

      return ({
        ...node,
        errors,
      });
    });
  }

  /**
   * Validate single node
   *
   * @param node
   * @param value
   */
  public validateNode(node: NodeType, value?: any): any {
    const errors = this.validator.checkInput(node, value ?? node.value);
    if (errors) {
      this.errorsList[node.uuid] = {
        uuid: node.uuid,
        errors,
      };

      return errors;
    }

    delete this.errorsList[node.uuid];
    return null;
  }

  /**
   *
   * @param path
   */
  public getAllSiblings(path: number[]): NodeType[] | [] {
    const clonePath = [...path];
    const { siblings } = this.getFromPath(clonePath, this.staticPage);

    if (!siblings) {
      return [];
    }

    return siblings;
  }

  /**
   *
   * @param path
   */
  public getSiblings(path: number[]): NodeType[] | [] {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.staticPage);
    if (!siblings[nodeIndex]) {
      return [];
    }

    const {
      name,
      type,
    } = siblings[nodeIndex];
    return siblings.filter((node) => (node.name === name && node.type === type && node.uuid && !node.tuuid));
  }

  private static parseEquation(equation: string) {
    if (equation.includes('===')) {
      let [field, value] = equation.split('===');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_STRICT_EQUAL];
    }

    if (equation.includes('!==')) {
      let [field, value] = equation.split('!==');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_STRICT_NOT_EQUAL];
    }

    if (equation.includes('>=')) {
      let [field, value] = equation.split('>=');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_GTE_OR_EQUAL];
    }

    if (equation.includes('>')) {
      let [field, value] = equation.split('>');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_GTE];
    }

    if (equation.includes('<=')) {
      let [field, value] = equation.split('<=');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_LTE_OR_EQUAL];
    }

    if (equation.includes('<')) {
      let [field, value] = equation.split('<');

      field = field.trim();
      value = value.trim();

      return [field, value, Parser.EQ_LTE];
    }

    return [null, null, null];
  }

  public getEquationNodeIds(field: string, path: number[]) {
    const clonePath = [...path];

    return this.getAllSiblings(clonePath)
      .filter((sibling: NodeType) => sibling.name === field && sibling.uuid)
      .map((node: NodeType) => {
        const { uuid, value, errors } = node;
        if (this.nodesById[uuid]) {
          return node;
        }

        this.nodesById[uuid] = new BehaviorSubject({
          value,
          errors,
        });

        return node;
      })
      .map(({ uuid }) => (uuid));
  }

  private searchShowHide(page: PageInterface, path: number[] = []) {
    page.forEach((node: NodeType, index: number) => {
      if (node.children) {
        this.searchShowHide(node.children, [...path, index]);
      }

      if (node.show) {
        const [field, value, type] = Parser.parseEquation(node.show);
        const ids = this.getEquationNodeIds(field, path);

        ids.forEach((id: string) => {
          this.setValue(node.uuid, node.value, node.errors);
          this.subscribe(node.uuid, id, value, type);
        });
      }
    });
  }

  private subscribe(nodeId: string, fieldId: string, value, type) {
    if (!this.subscriptions[nodeId]) {
      this.subscriptions[nodeId] = {};
    }

    if (!this.subscriptions[nodeId][fieldId] && this.nodesById[fieldId]) {
      this.subscriptions[nodeId][fieldId] = this.nodesById[fieldId]
        .pipe(takeUntil(this.destroy))
        .subscribe(() => {
          const { display: currentDisplay } = this.nodesById[nodeId].getValue();

          const hasMatch = [...Object.keys(this.subscriptions[nodeId]), fieldId].filter((id: string) => {
            if (type === Parser.EQ_STRICT_EQUAL) {
              return this.nodesById?.[id]?.getValue()?.value === Parser.convertValue(value);
            }

            if (type === Parser.EQ_STRICT_NOT_EQUAL) {
              return this.nodesById?.[id]?.getValue()?.value !== Parser.convertValue(value);
            }

            if (type === Parser.EQ_GTE_OR_EQUAL) {
              return Number(this.nodesById?.[id]?.getValue()?.value) >= Number(value);
            }

            if (type === Parser.EQ_GTE) {
              return Number(this.nodesById?.[id]?.getValue()?.value) > Number(value);
            }

            if (type === Parser.EQ_LTE_OR_EQUAL) {
              return Number(this.nodesById?.[id]?.getValue()?.value) <= Number(value);
            }

            if (type === Parser.EQ_LTE) {
              return Number(this.nodesById?.[id]?.getValue()?.value) < Number(value);
            }

            return false;
          });

          if (hasMatch.length > 0) {
            if (currentDisplay === true) {
              return;
            }

            this.setParams(nodeId, { display: true });
            return;
          }

          if (currentDisplay === false) {
            return;
          }

          this.setParams(nodeId, { display: false });
        });
    }
  }

  private static convertValue(value: string) {
    if (value.toLowerCase() === 'true') {
      return true;
    }

    if (value.toLowerCase() === 'false') {
      return false;
    }

    return value;
  }
}
