export interface CannedForm {
    nsp: string;
    formName: string,
    formHeader: string;
    formFooter: string;
    form: Array<Form>;
    formHTML: string;
    lastmodified: { date: string, by: string }
}

export interface Form {
    id: string;
    type: string;
    label: string;
    // value: Array<any>;
    // options :Array<any>;
    placeholder:string;

}