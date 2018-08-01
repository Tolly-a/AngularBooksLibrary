//str = str.replace(/[&\/\\#,+()$~%.'":*?<>{}!]/g, '');
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cleanText'
})

export class CleanTextPipe implements PipeTransform {

    transform(value: string): string {
        if (value) {
            let str = value;
            str = str.replace(/[^a-zA-Z]/g," ")
            return str;
          }
       }
}
    


