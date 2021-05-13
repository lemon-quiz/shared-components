import { Observable } from 'rxjs';
import { NodeType, PageInterface } from '../Interfaces/template.interface';
import AbstractValidator from './validator/AbstractValidator';
export default class Parser {
    static EQ_STRICT_EQUAL: string;
    static EQ_STRICT_NOT_EQUAL: string;
    static EQ_GTE: string;
    static EQ_LTE: string;
    static EQ_GTE_OR_EQUAL: string;
    static EQ_LTE_OR_EQUAL: string;
    private internalPage;
    private get staticPage();
    private set staticPage(value);
    get page(): Observable<PageInterface>;
    private destroy;
    private validator;
    private nodesById;
    private subscriptions;
    private runShowHide;
    private errorsList;
    constructor(validator: AbstractValidator);
    loadTemplate(template: PageInterface, page: PageInterface): void;
    private static clone;
    getPage(): PageInterface;
    /**
     *
     * @param template
     * @param page
     * @param path
     * @private
     */
    private parse;
    /**
     *
     * @param node
     * @param data
     * @private
     */
    private findAllNodes;
    /**
     * Update the value for given node
     *
     * @param data
     * @param updateUuid
     * @param values
     * @private
     */
    private updateNode;
    /**
     * Setting the value fo a node, this does not trigger a re-render.
     *
     * @param id
     * @param value
     * @param errors
     */
    setValue(id: any, value: any, errors?: any): void;
    /**
     * Setting custom params, triggers a re-render.
     *
     * @param id
     * @param params
     */
    setParams(id: any, params: any): void;
    /**
     * Return the value for a given node
     *
     * @param id
     * @param defaultValue
     * @param defaultErrors
     */
    getValue(id: any, defaultValue: any, defaultErrors: any): {
        value: any;
        errors: any;
    };
    /**
     * Move a node 1 position up
     *
     * @param path
     * @param index
     */
    moveUp(path: number[], index?: number): void;
    /**
     * Move node one position up
     * @param path
     * @param index
     */
    moveDown(path: number[], index?: number): void;
    /**
     * Check if node can be moved down.
     *
     * @param path
     * @param index
     * @param type
     * @param name
     */
    canMoveUp(path: number[], index: number, type: string, name: string): boolean;
    /**
     * Check if a node can be added
     *
     * @param path
     */
    canAdd(path: number[]): boolean;
    /**
     * Add new node add given position
     *
     * @param path
     * @param index
     * @param amount
     */
    addNode(path: number[], index?: number, amount?: number): void;
    /**
     *
     * @param path
     * @param amount
     */
    deleteNode(path: number[], amount?: number): void;
    /**
     *
     * @param path
     */
    canDelete(path: number[]): boolean;
    /**
     *
     * @param siblings
     * @param type
     * @param name
     * @private
     */
    private static canDeleteNodeInternal;
    /**
     * Initiate a given node
     *
     * @param node
     * @private
     */
    private initNode;
    /**
     * Check if node can me moved up
     *
     * @param path
     * @param index
     * @param type
     * @param name
     */
    canMoveDown(path: number[], index: number, type: string, name: string): boolean;
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
    private static canMoveUpInternal;
    /**
     *
     * @param siblings
     * @param index
     * @param type
     * @param name
     * @private
     */
    private static canMoveDownInternal;
    /**
     *
     * Get reference to deep data, this can be used to alter the tree
     *
     * @param path
     * @param data
     * @public
     */
    getFromPath(path: number[], data: any): {
        parent: null | NodeType;
        siblings: NodeType[];
    };
    /**
     * Probably not needed
     *
     * @param parent
     * @param siblings
     * @private
     */
    private resetIndex;
    /**
     * Validate the whole page and return the errors
     */
    getPageErrors(): {};
    /**
     * Loop through the page data and validate the nodes.
     *
     * @param data
     * @private
     */
    private validateNodes;
    /**
     * Validate single node
     *
     * @param node
     * @param value
     */
    validateNode(node: NodeType, value?: any): any;
    /**
     *
     * @param path
     */
    getAllSiblings(path: number[]): NodeType[] | [];
    /**
     *
     * @param path
     */
    getSiblings(path: number[]): NodeType[] | [];
    private static parseEquation;
    getEquationNodeIds(field: string, path: number[]): string[];
    private searchShowHide;
    private subscribe;
    private static convertValue;
}
