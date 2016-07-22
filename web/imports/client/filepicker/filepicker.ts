import 'reflect-metadata';
import { Component, ElementRef} from '@angular/core';

import template from './filepicker.html';
 
@Component({
    selector: 'file-picker',
    template,
    directives: [ ],
})
export class FilePicker {

    public file: Any = undefined;

    constructor(private el: ElementRef){}

    onChange(event){
        let files = event.target.files;
        if(files.length > 0){
            this.file = files[0];
        }else{
            this.file = undefined;
        }
    }

    clear(){
        this.el.nativeElement.querySelector('input').value = '';
    }

}
