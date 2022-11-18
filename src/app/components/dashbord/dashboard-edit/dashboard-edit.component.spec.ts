import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { Player } from 'src/app/models/player.modle';
import { DashBoardService } from '../dashboard.service';

import { DashboardEditComponent } from './dashboard-edit.component';

describe('DashboardEditComponent', () => {
  let component: DashboardEditComponent;
  let fixture: ComponentFixture<DashboardEditComponent>;
  let location: Location;
  let router: Router;
  let route: ActivatedRoute;
  let mockService: DashBoardService;
  class dashbordComponentMock {
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
        players: [{ id: 59, name: 'sad', score: [10, 20] }],
      },
    ];

    addPlayer() {
      let game = { id: 60, name: 'Tom', score: [0] };
      this.games[0].players = [...this.games[0].players, game];
      return of(this.games);
    }

    addColumn(name: string) {
      this.columns[0].columns.push(name);
      return of(this.columns[0].columns);
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'game/269/playerAdd', pathMatch: 'full' },
          {
            path: 'game/:id',
            children: [{ path: ':type', component: DashboardEditComponent }],
          },
        ]),
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: DashBoardService, useClass: dashbordComponentMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ type: 'playerAdd' }),
            parent: { params: of({ id: 269 }) },
          },
        },
      ],
      declarations: [DashboardEditComponent],
    }).compileComponents();
    router = TestBed.inject(Router);
    mockService = TestBed.inject(DashBoardService);
    location = TestBed.inject(Location);
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(DashboardEditComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should render', () => {
    let btn = fixture.debugElement.query(By.css('form'));
    expect(btn).toBeTruthy();
  });

  it(
    'mat label should change with the url',
    <any>fakeAsync(async () => {
      fixture.detectChanges();
      tick();
      component.ngOnInit();
      fixture.detectChanges();
      tick();
      let labelPlayer = fixture.debugElement.query(By.css('#playerLabel'));
      expect(labelPlayer.nativeElement.innerText).toEqual('Enter player name');
      component.playerMode = false;
      tick();
      fixture.detectChanges();
      let labelColumn = fixture.debugElement.query(By.css('#columnLabel'));
      expect(labelColumn.nativeElement.innerText).toEqual('Enter column name');
    })
  );

  it(
    'onNavgateBack should exacute after button press',
    <any>fakeAsync(async () => {
      let btn = fixture.debugElement.query(By.css('#back')).nativeElement;
      btn.click();
      tick();
      expect(location.path()).toEqual('/game/269');
    })
  );

  it(
    'when on submit ran it should run addPlayer and navigate back',
    <any>fakeAsync(async () => {
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#add')).nativeElement;
      let input = fixture.debugElement.query(By.css('input'));
      let spy = spyOn(mockService, 'addPlayer');
      input.nativeElement.value = 'newPlayer';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
      btn.click();
      tick();
      expect(spy).toHaveBeenCalled();
      spy.and.callThrough();
      tick();
      expect(location.path()).toEqual('/game/269');
    })
  );

  it(
    'when on submit ran it should run add column and navigate back',
    <any>fakeAsync(async () => {
      component.playerMode = false;
      fixture.detectChanges();
      let btn = fixture.debugElement.query(By.css('#add')).nativeElement;
      let spy = spyOn(mockService, 'addColumn');
      let input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.value = 'newPlayer';
      input.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick();
      btn.click();
      tick();
      expect(spy).toHaveBeenCalled();
      spy.and.callThrough();
      tick();
      expect(location.path()).toEqual('/game/269');
    })
  );
});
