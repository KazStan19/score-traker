import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Game } from 'src/app/models/game.model';
import { DashBoardGuardService } from './dashboard-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LandingService } from '../landing/landing.service';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('Router guard', () => {
  let guard: DashBoardGuardService;
  let route: ActivatedRouteSnapshot;
  class mockLandingService {
    games: Game[] = [
      {
        id: 269,
        name: 'sa',
        players: [
          { id: 57, name: 'sad', score: [10, 20] },
          { id: 58, name: 'sad', score: [10, 20] },
          { id: 59, name: 'sad', score: [10, 20] },
        ],
      },
      {
        id: 125,
        name: 'sa2',
        players: [{ id: 57, name: 'sad', score: [10, 20] }],
      },
    ];

    getGames(): Observable<Game[]> {
      return of(this.games);
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        DashBoardGuardService,
        { provide: LandingService, useClass: mockLandingService },
        {
          provide: ActivatedRouteSnapshot,
          useValue: {
            url: [{ path: 'game' }, { path: '269' }],
          },
        },
      ],
    });
    guard = TestBed.inject(DashBoardGuardService);
    route = TestBed.inject(ActivatedRouteSnapshot);
  });

  it('should be createable', () => expect(guard).toBeTruthy());

  it('check game should return true after checkGame runs', () => {
    guard.checkGame(+route.url[1].path).subscribe((item) => {
      expect(item).toBeTrue();
    });
  });

  it('check game should return true after canActivate runs',()=>{
    guard.canActivate(route).subscribe((item) => {
      expect(item).toBeTrue();
    });
  })
});
