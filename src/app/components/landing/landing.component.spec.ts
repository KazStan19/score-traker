import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

import { LandingComponent } from './landing.component';
import { LandingService } from './landing.service';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let randomNum = Math.floor(1000 * Math.random());
  class DashbordComponentMock {}
  let location: Location;
  let router: Router;

  class mockLandingService {
    gamesChanged = new Subject<any[]>();
    games = [
      {
        id: 269,
        name: 'sa',
        players: [{ id: 57, name: 'sad', score: [10, 20] }],
      },
      {
        id: 125,
        name: 'sa2',
        players: [{ id: 57, name: 'sad', score: [10, 20] }],
      },
    ];
    getGames() {
      this.gamesChanged.next(this.games);
      return of(this.games);
    }
    deleteGame(id: number) {
      this.games.splice(0, 1);
      this.gamesChanged.next(this.games);
    }
    editGame(id: number) {
      this.games[0].name = component.gameName.value!;
      this.gamesChanged.next(this.games);
    }
    addGame() {
      this.games.push({
        id: randomNum,
        name: component.gameName.value!,
        players: [],
      });
      this.gamesChanged.next(this.games);
    }
  }

  class sharedServiceMock {
    theme: boolean = false;
    themeChanged = new Subject<boolean>();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: LandingComponent },
          {
            path: 'game/:id',
            component: DashbordComponentMock,
          },
        ]),
        MatSelectModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDividerModule,
        MatInputModule,
      ],
      providers: [
        { provide: LandingService, useClass: mockLandingService },
        { provide: SharedService, useClass: sharedServiceMock },
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDeleteGames should delete game', () => {
    component.selectedName.setValue(269);
    component.onDeleteGames();
    fixture.detectChanges();
    expect(component.games.length).toEqual(1);
    component.selectedName.setValue(0);
    fixture.detectChanges();
    expect(component.selectedName.value).toEqual(0);
  });

  it('onEditGames should edit games name', () => {
    component.selectedName.setValue(269);
    component.onEditToggle();
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    component.gameName.setValue('hellogames');
    let btn = fixture.debugElement.query(By.css('#editAddBtn'));
    expect(btn).toBeTruthy();
    expect(btn.nativeElement.innerText).toEqual('Edit');
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(component.games[0].name).toEqual('hellogames');
    component.selectedName.setValue(0);
    expect(component.selectedName.value).toEqual(0);
  });

  it('edit and delete buttons should apear when game is selected and they must exicute there functions ', () => {
    let select = fixture.debugElement.query(By.css('#select'));
    select.nativeElement.click();
    fixture.detectChanges();
    let option = fixture.debugElement.query(By.css('#option269'));
    option.nativeElement.click();
    fixture.detectChanges();
    let btnDelete = fixture.debugElement.query(By.css('#deleteGame'));
    let btnEdit = fixture.debugElement.query(By.css('#editGame'));
    let spyDelete = spyOn(component, 'onDeleteGames');
    let spyEdit = spyOn(component, 'onEditToggle');
    btnDelete.nativeElement.click();
    btnEdit.nativeElement.click();
    fixture.detectChanges();
    expect(spyDelete).toHaveBeenCalled();
    expect(spyEdit).toHaveBeenCalled();
  })

  it('addGame should add game', fakeAsync(async () => {
    let route = '/game/' + randomNum;
    let btnNew = fixture.debugElement.query(By.css('#newBackBtn'));
    btnNew.nativeElement.click();
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'newGame';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    let btnAdd = fixture.debugElement.query(By.css('#editAddBtn'));
    expect(btnAdd.nativeElement.innerText).toEqual('Add');
    expect(component.addMode).toBeTrue();
    expect(component.editMode).toBeFalse();
    btnAdd.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(component.games[2].name).toEqual('newGame');
    expect(location.path()).toEqual(route);
  }));

  it('back button should cancel adding new game',  () => {
    let btnNew = fixture.debugElement.query(By.css('#newBackBtn'));
    btnNew.nativeElement.click();
    fixture.detectChanges();
    expect(btnNew.nativeElement.innerText).toEqual('Back');
    btnNew.nativeElement.click();
    fixture.detectChanges();
    expect(btnNew.nativeElement.innerText).toEqual('New');
  })
});
