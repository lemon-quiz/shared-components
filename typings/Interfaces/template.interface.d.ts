export interface ValidatorOptions {
    rule: string;
    params: any[];
}
export interface InputConfig {
    [key: string]: any;
}
export interface NodeInterface {
    type: string;
    name: string;
    label: string;
    mandatory?: boolean;
    allowEmpty?: boolean;
    multiple?: boolean;
    uuid?: string;
    tuuid?: string;
    errors?: any;
    validator?: string | ValidatorOptions | Array<string | ValidatorOptions>;
    [key: string]: any;
    config?: InputConfig;
    slider?: boolean;
    show?: string;
    hide?: string;
    display?: boolean;
}
export interface CustomNodeInterface extends NodeInterface {
}
export interface CustomNodesInterface {
    [key: string]: CustomNodeInterface;
}
export interface LineInterface extends NodeInterface {
}
export interface TextareaInterface extends NodeInterface {
}
export interface NodeOption {
    value: string;
    desc: string;
}
export interface NodeOptions extends Array<NodeOption> {
}
export interface RadioInterface extends NodeInterface {
    options: NodeOptions;
}
export interface CheckboxInterface extends NodeInterface {
    options?: NodeOptions;
}
export interface SelectBoxInterface extends NodeInterface {
    options: NodeOptions;
}
export interface ChildrenInterface extends Array<NodeType> {
}
export interface ComplexInterface extends NodeInterface {
    type: 'complex';
    children: ChildrenInterface;
}
export interface PageInterface extends Array<ComplexInterface | LineInterface | RadioInterface> {
}
export declare type NodeType = LineInterface | RadioInterface | ComplexInterface | SelectBoxInterface | CheckboxInterface | TextareaInterface | CustomNodeInterface;
