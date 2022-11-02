import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subsciption?: Subscription;
  theme: boolean = false;
  url: string = '';

  constructor(private shareService: SharedService, private router: Router) {}

  onClick() {
    this.shareService.switchTheme();
  }

  ngOnInit() {
    this.subsciption = this.shareService.themeChanged.subscribe(
      (item: boolean) => {
        this.theme = item;
      }
    );

  }

  onNavigate() {

    this.router.navigate(['/'])

  }

  ngOnDestroy() {
    this.subsciption?.unsubscribe();
  }
}
