import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from 'src/app/models/game.model';

@Injectable()
export class LandingService {
  gamesChanged = new Subject<any[]>();
  games!: any[];

  constructor(private http: HttpClient) {}

  addGame(addedGame: string) {
    this.http.post<Game>('games', { name: addedGame }).subscribe((item) => {
      this.games.push(item);
      this.gamesChanged.next(this.games);
    });
  }

  getGames() {
    this.http.get<Game[]>('games').subscribe((item) => {
      this.games = item;
      this.gamesChanged.next(this.games);
    });

    return this.games;
  }

  deleteGame(id:number) {
    this.http.delete<Game[]>('games',{body:{id:id}}).subscribe((item) => {
      this.games = item;
      this.gamesChanged.next(this.games);
    });
    this.http.delete<Game[]>('column/set',{body:{id:id}}).subscribe()
  }

  editGame(id:number,name:string) {
    this.http.patch<Game[]>('games',{id:id,name:name}).subscribe((item) => {
      this.games = item;
      this.gamesChanged.next(this.games);
    });
  }
}
