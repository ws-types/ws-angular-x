

export class TemplateParser {

    private config: any;

    constructor(private template: string, config?: any) {
        this.config = config;
    }

    public Parse(): string {
        return this.template;
    }

}
