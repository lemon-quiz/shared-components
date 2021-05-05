export interface ValidatiorOptions {
    rule: string;
    params: any[];
}
export interface NodeInterface {
    type: string;
    name: string;
    mandatory?: boolean;
    allowEmpty?: boolean;
    multiple?: boolean;
    uuid?: string;
    tuuid?: string;
    errors?: any;
    validator?: string | ValidatiorOptions | Array<string | ValidatiorOptions>;
    [key: string]: any;
}
export interface LineInterface extends NodeInterface {
}
export interface RadioNodeOption {
    value: string;
    desc: string;
}
export interface RadioNodeOptions extends Array<RadioNodeOption> {
}
export interface RadioInterface extends NodeInterface {
    options?: RadioNodeOptions;
}
export interface ChildrenInterface extends Array<LineInterface | RadioInterface | ComplexInterface> {
}
export interface ComplexInterface extends NodeInterface {
    type: 'complex';
    children: ChildrenInterface;
}
export interface PageInterface extends Array<ComplexInterface | LineInterface | RadioInterface> {
}
export declare type NodeType = LineInterface | RadioInterface | ComplexInterface;
