import { NodeType, PageInterface } from '../Interfaces/template.interface';
import AbstractValidator from './validator/AbstractValidator';
export default class Parser {
    private initPage;
    private valueList;
    private errorsList;
    private validator;
    constructor(validator: AbstractValidator);
    /**
     *
     * @param template
     * @param page
     */
    loadTemplate(template: PageInterface, page: PageInterface): void;
    /**
     *
     */
    getPage(): PageInterface;
    /**
     *
     * @param template
     * @param page
     * @param initPage
     * @private
     */
    private parse;
    /**
     *
     * @param node
     * @param data
     * @private
     */
    private static findAllNodes;
    /**
     * Move a node 1 position up
     *
     * @param path
     * @param index
     */
    moveUp(path: number[], index?: number): PageInterface;
    /**
     * Move node one position up
     * @param path
     * @param index
     */
    moveDown(path: number[], index?: number): PageInterface;
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
     */
    addNode(path: number[], index?: number): PageInterface;
    /**
     *
     * @param path
     */
    deleteNode(path: number[]): PageInterface;
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
     * @private
     */
    private getFromPath;
    /**
     * Probably not needed
     *
     * @param parent
     * @param siblings
     * @private
     */
    private resetIndex;
    /**
     *
     *
     * @param id
     * @param value
     * @param errors
     */
    setValue(id: any, value: any, errors?: any): void;
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
     * Update the value for given node
     *
     * @param data
     * @param updateUuid
     * @param values
     * @private
     */
    private updateNode;
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
}
