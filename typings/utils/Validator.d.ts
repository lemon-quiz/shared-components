export default class Validators {
    static required: (errors: any, name: string, values: any) => void;
    static boolean: (errors: any, name: string, values: any) => void;
    static password: (errors: any, name: string, values: any) => void;
    static email: (errors: any, name: string, values: any) => void;
    static test: (values: any, requirements: any) => any;
}
