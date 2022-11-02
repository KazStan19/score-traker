import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { mergeMap, of } from 'rxjs';
import { Game } from '../models/game.model';
import { Player } from '../models/player.modle';

export class GameInterceptorsService implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    //-----GET method for getting all games-----

    if (req.method === 'GET' && req.url === 'games') {
      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          if (!item) games = [];
          else {
            games = JSON.parse(item);
          }
          return of(new HttpResponse({ body: games }));
        
    }
    //-----POST method for adding a new game-----
    if (req.method === 'POST' && req.url === 'games') {
      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          if (!item) games = [];
          else {
            games = JSON.parse(item);
          }
          let newGame: Game = { name: req.body.name, players: [] };
          localStorage.setItem('Games', JSON.stringify([...games, newGame]));

          return of(new HttpResponse({ body: newGame }));
        
    }
    //-----GET method for getting all specific games columns-----
    if (req.method === 'GET' && req.url === 'columns') {
      let id = req.params.get('id');
      
          let item = localStorage.getItem('Columns');
          let gameColumns: { id: number; columns: string[] }[] = [];
          let firstItem: { id: number; columns: string[] } = {
            id: +id!,
            columns: ['name'],
          };
          if (item) {
            gameColumns = JSON.parse(item);
          } else {
            localStorage.setItem('Columns', JSON.stringify([firstItem]));
            return of(new HttpResponse({ body: [firstItem] }));
          }
          let columns = gameColumns.find(
            (item: { id: number; columns: string[] }) => +item.id === +id!
          );
          if (!columns) {
            gameColumns.push(firstItem);
            localStorage.setItem('Columns', JSON.stringify(gameColumns));
            return of(new HttpResponse({ body: gameColumns }));
          }
          return of(new HttpResponse({ body: gameColumns }));
        
    }
    //-----PATCH method for getting adding a new column to games table-----
    if (req.method === 'PATCH' && req.url === 'columns') {
      let { id, name } = req.body;

      
          let item = localStorage.getItem('Columns');
          let gameColumns: { id: number; columns: string[] }[] = [];
          if (item) {
            gameColumns = JSON.parse(item);
          }
          let gameIndex = gameColumns.findIndex((item) => +item.id === +id!);
          gameColumns[gameIndex]?.columns.push(name!);
          localStorage.setItem('Columns', JSON.stringify(gameColumns));
          return of(new HttpResponse({ body: gameColumns[gameIndex] }));
        
    }
    //-----PATCH method for getting adding a new player to a game-----
    if (req.method === 'PATCH' && req.url === 'player') {
      let { id, name } = req.body;

      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          let newPlayer: Player = {
            id: Math.floor(1000 * Math.random()),
            name: name,
            score: [],
          };
          if (item) {
            games = JSON.parse(item);
          }
          games[id].players = [...games[id].players, newPlayer];
          console.log(games[id].players);
          localStorage.setItem('Games', JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        
    }
    //-----PATCH method for getting adding a new score to a player-----
    if (req.method === 'PATCH' && req.url === 'score') {
      let { id, userId, columnId, score } = req.body;
      console.log(req.body);
      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          if (item) {
            games = JSON.parse(item);
          }
          let index = games[id].players.findIndex((item) => item.id === userId);

          //console.log(games[id].players[index].score[columnId+1] === undefined || games[id].players[index].score[columnId] !== '')
          if (
            games[id].players[index].score[columnId + 1] === undefined ||
            games[id].players[index].score[columnId] !== ''
          )
            games[id].players[index].score.push(score);
          else games[id].players[index].score[columnId] = score;

          localStorage.setItem('Games', JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        
    }
    //-----DELETE method for deleting a column from a games table-----
    if (req.method === 'DELETE' && req.url === 'column') {
      let { id, columnId } = req.body;
      console.log(req.body);
      
          let item = localStorage.getItem('Columns');
          let game = localStorage.getItem('Games');
          let gameColumns: { id: number; columns: string[] }[] = [];
          let games: Game[] = [];
          if (item) {
            gameColumns = JSON.parse(item);
          }
          if (game) {
            games = JSON.parse(game);
          }
          let gameIndex = gameColumns.findIndex((item) => +item.id === +id!);
          gameColumns[gameIndex]?.columns.splice(columnId, 1);
          localStorage.setItem('Columns', JSON.stringify(gameColumns));

          games[id].players.forEach((item) => {
            item.score.splice(columnId - 1, 1);
          });

          localStorage.setItem('Games', JSON.stringify(games));

          return of(new HttpResponse({ body: gameColumns[gameIndex] }));
        
    }
    //-----DELETE method for deleting a player from a game-----
    if (req.method === 'DELETE' && req.url === 'player') {
      let { id, userId } = req.body;
      console.log(req.body);
      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          if (item) {
            games = JSON.parse(item);
          }
          let index = games[id].players.findIndex(item => item.id === userId)
          games[id].players.splice(index, 1);
          console.log(games[id].players);
          localStorage.setItem('Games', JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        
    }
    //-----DELETE method for deleting a score from a player-----
    if (req.method === 'DELETE' && req.url === 'score') {
      let { id, userId, columnId } = req.body;
      console.log(req.body);
      
          let item = localStorage.getItem('Games');
          let games: Game[] = [];
          if (item) {
            games = JSON.parse(item);
          }
          //console.log(games[id].players[userId].score.length - columnId)
          if (games[id].players[userId].score[columnId + 1] === undefined || games[id].players[userId].score[columnId + 1] === '')
            games[id].players[userId].score.splice(columnId, games[id].players[userId].score.length - columnId);
          else games[id].players[userId].score.splice(columnId, 1, '');
          localStorage.setItem('Games', JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        
    }

    //-----PATCH method for editing a column from a games table-----
    if (req.method === 'PATCH' && req.url === 'column/edit') {
      let { id, columnId, name } = req.body;
      console.log(req.body);
      
          let unParsed = localStorage.getItem('Columns');
          let columns: { id: number; columns: string[] }[] = [];
          if (unParsed) columns = JSON.parse(unParsed);
          let index = columns.findIndex((item) => item.id === id);
          columns[index].columns[columnId] = name;
          localStorage.setItem('Columns',JSON.stringify(columns));
          return of(new HttpResponse({ body: columns[index] }));
        
    }

    //-----PATCH method for editing a player from a game-----
    if (req.method === 'PATCH' && req.url === 'player/edit') {
      let { id, userId, name } = req.body;
      //console.log(req.body);
      // return of(req).pipe(
      //   mergeMap(() => {
          let unParsed = localStorage.getItem('Games');
          let games: Game[] = [];
          if (unParsed) games = JSON.parse(unParsed);
          let index = games[id].players.findIndex((item) => item.id === userId);
          //console.log(games[id].players[index])
          games[id].players[index].name = name;
          localStorage.setItem('Games',JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        //})
      //);
    }

    //-----PATCH method for editing a score from a player-----
    if (req.method === 'PATCH' && req.url === 'score/edit') {
      let { id, userId, columnId, score } = req.body;

      
          let unParsed = localStorage.getItem('Games');
          let games: Game[] = [];
          if (unParsed) games = JSON.parse(unParsed);
          games[id].players[userId].score[columnId] = score;
          localStorage.setItem('Games',JSON.stringify(games));
          return of(new HttpResponse({ body: games[id] }));
        
    }

    //-----DELETE method for deleting a game-----
    if (req.method === 'DELETE' && req.url === 'games') {
      let { id } = req.body;
          let unParsed = localStorage.getItem('Games');
          let games: Game[] = [];
          if (unParsed) games = JSON.parse(unParsed);
          games.splice(id,1)
          localStorage.setItem('Games',JSON.stringify(games));
          return of(new HttpResponse({ body: games }));
        
    }

    //-----PATCH method for editing a games name-----
    if (req.method === 'PATCH' && req.url === 'games') {
      let { id, name } = req.body;
      
          let unParsed = localStorage.getItem('Games');
          let games: Game[] = [];
          if (unParsed) games = JSON.parse(unParsed);
          games[id].name = name;
          localStorage.setItem('Games',JSON.stringify(games));
          return of(new HttpResponse({ body: games }));
        
    }

    //-----DELETE method for deleting a games column set-----
    if (req.method === 'DELETE' && req.url === 'column/set') {
      let { id } = req.body;
      
          let unParsed = localStorage.getItem('Columns');
          let columns: { id: number; columns: string[] }[] = [];
          if (unParsed) columns = JSON.parse(unParsed);
          let index = columns.findIndex(item  => item.id === id)
          columns.splice(index,1)
          localStorage.setItem('Columns',JSON.stringify(columns));
          return of(new HttpResponse({ body: index }));
        
    }

    return next.handle(req);
  }
}
