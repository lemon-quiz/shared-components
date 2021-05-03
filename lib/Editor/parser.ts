import { v4 as uuidv4 } from 'uuid';

import {
  ComplexInterface,
  NodeType,
  PageInterface,
} from '../Interfaces/template.interface';
import AbstractValidator from './validator/AbstractValidator';

export default class Parser {
  private initPage: PageInterface = [];

  private valueList = {};

  private errorsList = {};

  private validator: AbstractValidator;

  public constructor(validator: AbstractValidator) {
    this.validator = validator;
  }

  /**
   *
   * @param template
   * @param page
   */
  public loadTemplate(template: PageInterface, page: PageInterface) {
    this.initPage = this.parse(template, page);
    this.valueList = {};
  }

  /**
   *
   */
  public getPage(): PageInterface {
    return JSON.parse(JSON.stringify(this.initPage));
  }

  /**
   *
   * @param template
   * @param page
   * @param initPage
   * @private
   */
  private parse(template: PageInterface, page: PageInterface = [], initPage: any[] = []) {
    // eslint-disable-next-line consistent-return
    template.forEach((templateNode) => {
      if (templateNode.type === 'complex') {
        const nodes = Parser.findAllNodes(templateNode as ComplexInterface, page);

        nodes.forEach(({ children, ...rest }) => {
          const newChildren = this.parse(templateNode.children, children ?? []);

          initPage.push({ ...rest, children: newChildren });
        });
        initPage.push({ ...templateNode, tuuid: uuidv4() });
        return initPage;
      }

      const nodes = Parser.findAllNodes(templateNode, page);

      nodes.forEach((dataNode) => {
        initPage.push(dataNode);
      });

      initPage.push({ ...templateNode, tuuid: uuidv4() });
    });

    return initPage;
  }

  /**
   *
   * @param node
   * @param data
   * @private
   */
  private static findAllNodes(node: NodeType, data: PageInterface): NodeType[] {
    const { name, type } = node;

    const nodes = data.filter((dataNode: NodeType) => (
      dataNode.name === name && dataNode.type === type && dataNode.uuid
    )).map((dataNode) => ({
      ...node,
      ...{
        value: dataNode.value,
        uuid: dataNode.uuid,
        children: dataNode.children,
      },
    }));

    if (nodes.length > 0) {
      if (!node.multiple) {
        return [nodes.shift()];
      }

      return nodes;
    }

    if (node.mandatory) {
      return [{ ...node, uuid: uuidv4() }];
    }

    return [];
  }

  /**
   * Move a node 1 position up
   *
   * @param path
   * @param index
   */
  public moveUp(path: number[], index?: number): PageInterface {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { parent, siblings } = this.getFromPath(clonePath, this.initPage);
    const { name, type } = siblings[nodeIndex];
    const canMove = Parser.canMoveUpInternal(siblings, nodeIndex, type, name);

    if (canMove) {
      const newIndex = (typeof index !== 'undefined' ? index : nodeIndex - 1);
      siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
      this.resetIndex(parent, siblings);
    }

    this.resetIndex(parent, siblings);

    return this.getPage();
  }

  /**
   * Move node one position up
   * @param path
   * @param index
   */
  public moveDown(path: number[], index?: number): PageInterface {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { parent, siblings } = this.getFromPath(clonePath, this.initPage);

    const { name, type } = siblings[nodeIndex];
    const canMove = Parser.canMoveDownInternal(siblings, nodeIndex, type, name);

    if (canMove) {
      const newIndex = (typeof index !== 'undefined' ? index : nodeIndex + 1);
      siblings.splice(newIndex, 0, siblings.splice(nodeIndex, 1)[0]);
      this.resetIndex(parent, siblings);
    }

    return this.getPage();
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
    const { siblings } = this.getFromPath(clonePath, this.initPage);
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
    const { siblings } = this.getFromPath(clonePath, this.initPage);

    const {
      name, type, multiple, uuid, tuuid,
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
   */
  public addNode(path: number[], index?: number): PageInterface {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.initPage);
    const { name, type } = siblings[nodeIndex];
    const templateNode = siblings.find((node) => (node.name === name && node.type === type && !node.uuid && node.tuuid));

    if (!templateNode) {
      // eslint-disable-next-line no-console
      console.error(`Template node type: ${type}, name: ${name} was not found.`);

      return this.getPage();
    }

    const newNode = this.initNode(templateNode);
    const insertIndex = typeof index !== 'undefined' ? index + 1 : nodeIndex;

    siblings.splice(insertIndex, 0, newNode);

    return this.getPage();
  }

  /**
   *
   * @param path
   */
  public deleteNode(path: number[]): PageInterface {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.initPage);

    if (!this.canDelete(path)) {
      return this.getPage();
    }

    siblings.splice(nodeIndex, 1);
    return this.getPage();
  }

  /**
   *
   * @param path
   */
  public canDelete(path: number[]) {
    const clonePath = [...path];
    const nodeIndex = clonePath.pop();
    const { siblings } = this.getFromPath(clonePath, this.initPage);
    const { type, name } = siblings[nodeIndex];
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
      tuuid, uuid, value, ...rest
    } = node;

    const newNode = {
      ...rest,
      uuid: uuidv4(),
      value: uuidv4(),
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
    const { siblings } = this.getFromPath(clonePath, this.initPage);
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
   * @private
   */
  private getFromPath(path: number[], data): { parent: null | NodeType, siblings: NodeType[] } {
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
      this.initPage = siblings.filter(() => true);

      return;
    }

    // eslint-disable-next-line no-param-reassign
    (parent as NodeType).children = siblings.filter(() => true);
  }

  /**
   *
   *
   * @param id
   * @param value
   * @param errors
   */
  public setValue(id, value: any, errors?: any): void {
    this.valueList[id] = {
      id,
      value,
      errors,
    };
    this.initPage = this.updateNode(this.initPage, id, { value, errors });
  }

  /**
   * Return the value for a given node
   *
   * @param id
   * @param defaultValue
   * @param defaultErrors
   */
  public getValue(id, defaultValue, defaultErrors): { value: any, errors: any } {
    return this.valueList?.[id] ?? { value: defaultValue, errors: defaultErrors };
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
      const { uuid, children } = node;

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
   * Validate the whole page and return the errors
   */
  public getPageErrors() {
    this.errorsList = {};
    this.initPage = this.validateNodes(this.initPage);

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
      if (!node.uuid) {
        return node;
      }

      const errors = this.validator.checkInput(node, node.value);
      if (errors) {
        this.errorsList[node.uuid] = { uuid: node.uuid, errors };
      }

      if (node.children) {
        const children = this.validateNodes(node.children);
        return ({ ...node, errors, children });
      }

      return ({ ...node, errors });
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
      this.errorsList[node.uuid] = { uuid: node.uuid, errors };

      return errors;
    }

    delete this.errorsList[node.uuid];
    return null;
  }
}
