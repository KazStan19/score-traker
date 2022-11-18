import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { Component } from '@angular/core';
import { DashbordComponent } from './dashbord.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { DashBoardService } from './dashboard.service';
import { LandingService } from '../landing/landing.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, of, Subject } from 'rxjs';
import { Location } from '@angular/common';
import { Game } from 'src/app/models/game.model';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DashbordComponent', () => {
  let component: DashbordComponent;
  let fixture: ComponentFixture<DashbordComponent>;
  let serice: DashBoardService;
  class mockService {
    contentChanged = new Subject<Game>();
    displayedColumnsChanged = new Subject<string[]>();

    columns: { id: number; columns: string[] }[] = [
      { id: 269, columns: ['name', 'round2', 'round3', 'round4'] },
      { id: 125, columns: ['name', 'round1'] },
    ];
    games: Game[] = [
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

    getColumns(id: number): Observable<{ id: number; columns: string[] }[]> {
      let column = this.columns.find((item) => item.id === id);
      if (column) this.displayedColumnsChanged.next(column.columns);
      else this.displayedColumnsChanged.next(['name']);
      return of(this.columns);
    }
    getGame(id: number): Observable<Game[]> {
      let game = this.games.find((item) => item.id === id);
      this.contentChanged.next(game!);
      return of(this.games);
    }
    deleteItem(id: number, userId: number | undefined) {
      if (id && userId) this.games[0].players.splice(0, 1);

      this.contentChanged.next(this.games[0]);
      this.displayedColumnsChanged.next(this.columns[0].columns);
    }

    editItem(id: number, userId: number | undefined) {
      if (id && userId)
        this.games[0].players[0].name = component.editInput.value!.toString();
      this.contentChanged.next(this.games[0]);
    }

    addScores(id: number, userId: number) {
      if (id && userId)
        this.games[0].players[0].score.push(component.scoreInput.value);
      this.contentChanged.next(this.games[0]);
    }
  }
  @Component({
    selector: 'app-dashboard-edit',
  })
  class DashboardEditComponentMock {}
  let location: Location;
  let router: Router;
  let route: ActivatedRoute;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashbordComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 269 }),
          },
        },
        { provide: DashBoardService, useClass: mockService },
        LandingService,
      ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: `/game/269`, pathMatch: 'full' },
          {
            path: 'game/:id',
            component: DashbordComponent,
            children: [
              { path: 'playerAdd', component: DashboardEditComponentMock },
              { path: 'columnAdd', component: DashboardEditComponentMock },
            ],
          },
        ]),
        MatMenuModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    serice = TestBed.inject(DashBoardService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(DashbordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  it('should render table', () => {
    let table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });
  it('when click on add score it should show the input element', fakeAsync(async () => {
    let btn = fixture.debugElement.query(By.css('td a#add57'));
    expect(btn).toBeTruthy();
    btn.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(component.id).toEqual(269);
    expect(component.idUser).toEqual(57);
    if (component.columnId) expect(component.columnId).toEqual(269);
    expect(component.inputToggle).toBeFalse();
    expect(component.editMode).toBeFalse();
    expect(component.editToggle).toBeFalse();
    expect(location.path()).toBe('/game/269');
    let input = fixture.debugElement.query(By.css('th input'));
    expect(input).toBeTruthy();
  }));

  it('when click on add column it should render dashboard edit component ', fakeAsync(async () => {
    let btn = fixture.debugElement.query(By.css('#addColumn'));
    expect(btn).toBeTruthy();
    btn.nativeElement.click();
    tick();
    expect(location.path()).toBe('/game/269/columnAdd');
  }));

  it('when click menu button menu should open up with delete and edit buttons ', () => {
    let btn = fixture.debugElement.query(By.css('#menuTable'));
    expect(btn).toBeTruthy();
    btn.nativeElement.click();
    fixture.detectChanges();
    let deleteBtn = fixture.debugElement.query(By.css('button#delete'));
    let editBtn = fixture.debugElement.query(By.css('button#edit'));
    expect(deleteBtn).toBeTruthy();
    expect(editBtn).toBeTruthy();
  });

  it('when clicked delete and edit buttons it should run onEditControl function', () => {
    let btn = fixture.debugElement.query(By.css('#menuTable'));
    btn.nativeElement.click();
    fixture.detectChanges();
    let spy = spyOn(component, 'onEditControl');
    let editBtn = fixture.debugElement.query(
      By.css('button#edit')
    ).nativeElement;
    let deleteBtn = fixture.debugElement.query(
      By.css('button#delete')
    ).nativeElement;
    deleteBtn.click();
    editBtn.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('when onEditControl is ran editMode, editToggle, type and route shoul have changed', fakeAsync(async () => {
    component.onEditControl('delete');
    fixture.detectChanges();
    tick();
    expect(component.editMode).toBeTrue();
    expect(component.editToggle).toBeFalse();
    expect(component.type).toEqual('delete');
    expect(location.path()).toEqual('/game/269');
  }));

  it('when clicking a players name in a delete mode it should run onClick', () => {
    component.onEditControl('delete');
    fixture.detectChanges();
    let player = fixture.debugElement.query(By.css('#name57'));
    let spy = spyOn(component, 'onClick');
    player.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('when onClick is ran after a click, on a players name, then the players row should be deleted', () => {
    component.onEditControl('delete');
    fixture.detectChanges();
    component.onClick(undefined, 57);
    fixture.detectChanges();
    expect(component.dataSource.players.length).toEqual(0);
  });

  it('when onClick is ran after a click on a players name (in a edit mode), it should render a input field with the players name as value', () => {
    component.onEditControl('edit');
    fixture.detectChanges();
    component.onClick(undefined, 57);
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
    expect(input.nativeElement.value).toEqual(
      component.dataSource.players[0].name
    );
  });

  it('when editing players name, score or columns name clicking the add button should run a handleSubmit', () => {
    component.onEditControl('edit');
    fixture.detectChanges();
    component.onClick(undefined, 57);
    fixture.detectChanges();
    let btnSubmit = fixture.debugElement.query(By.css('th button'));
    let spy = spyOn(component, 'handleSubmit');
    expect(btnSubmit).toBeTruthy();
    btnSubmit.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it('When running hadleSubmit after click a players name and inputing the edited name it should update', () => {
    component.onEditControl('edit');
    fixture.detectChanges();
    component.onClick(undefined, 57);
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = 'newPlayerName';
    input.nativeElement.dispatchEvent(new Event('input'));
    component.handleSubmit();
    fixture.detectChanges();
    expect(component.dataSource.players[0].name).toEqual('newPlayerName');
    let newPlayerName = fixture.debugElement.query(By.css('td#name57'))
    expect(newPlayerName.nativeElement.innerText).toEqual('newPlayerName');
  });
  
  it('when clicking add button in a score section it sould run onToggle',()=>{

    let btn = fixture.debugElement.query(By.css('#add57'));
    let spy = spyOn(component,'onToggle')
    btn.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled()

  })

  it('when onToggle is ran a empty input field sould render',()=>{

    let btn = fixture.debugElement.query(By.css('#add57'));
    btn.nativeElement.click();
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'))
    expect(input).toBeTruthy()
  })

  it('when onToggle is ran a empty input field sould render',()=>{

    let btn = fixture.debugElement.query(By.css('#add57'));
    btn.nativeElement.click();
    fixture.detectChanges();
    let input = fixture.debugElement.query(By.css('input'))
    let btnSubmit = fixture.debugElement.query(By.css('th button'));
    input.nativeElement.value = 2;
    input.nativeElement.dispatchEvent(new Event('input'));
    btnSubmit.nativeElement.click();
    fixture.detectChanges();
    expect(component.dataSource.players[0].score[2]).toEqual(2);

  })
});
