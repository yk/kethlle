import {Pipe, PipeTransform} from '@angular/core';
import * as marked from 'marked';


@Pipe({name: 'markdown'})
export class MarkdownPipe implements PipeTransform{
    constructor(){
        marked.setOptions({
            breaks: true,
            sanitize: true,
        });
    }
    transform(markdown: string){
        if(!markdown)
            return '';
        return marked(markdown);
    }
}
