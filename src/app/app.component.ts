import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  subsciption?: Subscription;
  theme: boolean = false;

  constructor(private shareService: SharedService) {}

  ngOnInit() {
    this.subsciption = this.shareService.themeChanged.subscribe(
      (item: boolean) => {
        this.theme = item;
      }
    );
  }

  ngOnDestroy() {
    this.subsciption?.unsubscribe();
  }
}
