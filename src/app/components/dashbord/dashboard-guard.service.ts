
import {
  ActivatedRouteSnapshot,
  CanActivate,
} from '@angular/router';
import { LandingService } from '../landing/landing.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class DashBoardGuardService implements CanActivate {
  constructor(private landingService: LandingService) {}

  checkGame(id: number) {
    return this.landingService.getGames().pipe(
      map((games) => {
        let game = games.find((item) => item.id === id);
        return !!game
      })
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> {
    let enteredId = route.url[1].path;
    return this.checkGame(+enteredId);
  }
}
