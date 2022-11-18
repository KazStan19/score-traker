import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {ComponentFixture} from '@angular/core/testing'
import { AppComponent } from './app.component';
import { SharedService } from './shared/shared.service';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  class mockService{
    themeChanged = new Subject<boolean>();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers:[{provide:SharedService,useClass:mockService}],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`Should render the header component'`, () => {
    let headerComponent = fixture.debugElement.query(By.css('app-header'))
    expect(headerComponent).toBeTruthy();
  });

  it(`When class changes div.main should get class dark`, () => {
    fixture.detectChanges()
    let div = fixture.debugElement.query(By.css('div')).nativeElement
    expect(div.getAttribute('class')).toContain('light');
    app.theme = true
    fixture.detectChanges()
    expect(div.getAttribute('class')).toContain('dark');
  });
  
});
