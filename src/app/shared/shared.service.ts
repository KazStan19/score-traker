import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SharedService {
  themeChanged = new Subject<boolean>();
  theme: boolean = false;

  switchTheme() {
    this.theme = !this.theme;
    this.themeChanged.next(this.theme);
  }
}
