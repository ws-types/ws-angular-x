import { Pipe, PipeTransform } from "@angular";


@Pipe({ name: "fmt", i18n: true })
export class FormatPipe implements PipeTransform {

    transform(value: string, length?: number) {
        if (typeof (value) !== "string") {
            return "";
        }
        const max = length || 20;
        if (value.length > max) {
            return value.substring(0, max) + "...";
        } else {
            return value;
        }
    }

}
