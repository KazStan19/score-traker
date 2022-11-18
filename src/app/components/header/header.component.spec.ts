import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedService } from 'src/app/shared/shared.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatToolbarHarness } from '@angular/material/toolbar/testing';

import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

class LandingComponentMock {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<HeaderComponent>;
  let loader: HarnessLoader;
  class mockService {
    theme: boolean = false;
    themeChanged = new Subject<boolean>();

    switchTheme() {
      this.theme = !this.theme;
      this.themeChanged.next(this.theme);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: '/home', pathMatch: 'full' },
          { path: 'home', component: LandingComponentMock },
          { path: '**', redirectTo: '/home' },
        ]),
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        MatSlideToggleModule,
        BrowserAnimationsModule,
      ],
      providers: [{ provide: SharedService, useClass: mockService }],
      declarations: [HeaderComponent],
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.autoDetectChanges(true);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navbar', () => {
    let navbar = loader.getHarness(MatToolbarHarness);
    expect(navbar).toBeTruthy();
  });
  it('should render the settings button', () => {
    let btn = fixture.debugElement.query(By.css('#setting'));
    expect(btn).toBeTruthy();
  });

  it('should render the home button', () => {
    let btn = fixture.debugElement.query(By.css('#home'));
    expect(btn).toBeTruthy();
  });

  it('settings button should open the menu', () => {
    let btnSetting = fixture.debugElement.query(
      By.css('#setting')
    ).nativeElement;
    expect(btnSetting).toBeTruthy();
    btnSetting.click();
    fixture.detectChanges();
    let menu = fixture.debugElement.query(By.css('#switch')).nativeElement;
    expect(menu).toBeTruthy();
  });

  it('should change theme state on mit switch click', () => {
    let btnSetting =
      fixture.debugElement.nativeElement.querySelector('#setting');
    btnSetting.click();
    fixture.detectChanges();
    let switchBtn = fixture.debugElement.query(
      By.css('mat-slide-toggle')
    ).nativeElement;
    switchBtn.click();
    fixture.detectChanges();
    expect(component.theme).toBeTrue();
  });

  it('navigate to "" redirects you to /home', fakeAsync(async () => {
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/home');
  }));

  it('should call function onNavigate when home button pressed and navigated to /home', fakeAsync(async () => {
    let spy = spyOn(component, 'onNavigate').and.callThrough();
    let btn = fixture.debugElement.nativeElement.querySelector('#home');
    btn.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    tick();
    expect(location.path()).toBe('/home');
  }));
});
