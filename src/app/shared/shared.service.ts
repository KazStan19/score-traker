import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';


@Injectable()
export class SharedService {
  
  theme: boolean = false;
  themeChanged = new Subject<boolean>();
  

  switchTheme() {
    this.theme = !this.theme;
    this.themeChanged.next(this.theme);
  }
}
