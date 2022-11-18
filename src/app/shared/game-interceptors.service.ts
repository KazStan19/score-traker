/* istanbul ignore file */

import {
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
      let newGame: Game = {
        id: Math.floor(1000 * Math.random()),
        name: req.body.name,
        players: [],
      };
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
      let index = games.findIndex((item) => item.id === id);
      games[index].players = [...games[index].players, newPlayer];

      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
    }
    //-----PATCH method for getting adding a new score to a player-----
    if (req.method === 'PATCH' && req.url === 'score') {
      let { id, userId, columnId, score } = req.body;

      let item = localStorage.getItem('Games');
      let games: Game[] = [];
      if (item) {
        games = JSON.parse(item);
      }
      let index = games.findIndex((item) => item.id === id);
      let indexPlayer = games[index].players.findIndex(
        (item) => item.id === userId
      );

      if (
        games[index].players[indexPlayer].score[columnId + 1] === undefined ||
        games[index].players[indexPlayer].score[columnId] !== ''
      )
        games[index].players[indexPlayer].score.push(score);
      else games[index].players[indexPlayer].score[columnId] = score;

      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
    }
    //-----DELETE method for deleting a column from a games table-----
    if (req.method === 'DELETE' && req.url === 'column') {
      let { id, columnId } = req.body;

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

      let index = games.findIndex((item) => item.id === id);
      games[index].players.forEach((item) => {
        console.log(item)
        item.score.splice(columnId - 1, 1);
      });

      localStorage.setItem('Games', JSON.stringify(games));

      return of(new HttpResponse({ body: gameColumns[gameIndex] }));
    }
    //-----DELETE method for deleting a player from a game-----
    if (req.method === 'DELETE' && req.url === 'player') {
      let { id, userId } = req.body;

      let item = localStorage.getItem('Games');
      let games: Game[] = [];
      if (item) {
        games = JSON.parse(item);
      }
      let index = games.findIndex((item) => item.id === id);
      let indexPlayer = games[index].players.findIndex(
        (item) => item.id === userId
      );
      games[index].players.splice(indexPlayer, 1);

      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
    }
    //-----DELETE method for deleting a score from a player-----
    if (req.method === 'DELETE' && req.url === 'score') {
      let { id, userId, columnId } = req.body;

      let item = localStorage.getItem('Games');
      let games: Game[] = [];
      if (item) {
        games = JSON.parse(item);
      }
      let index = games.findIndex((item) => item.id === id);
      let indexPlayer = games[index].players.findIndex(
        (item) => item.id === userId
      );
      if (
        games[index].players[indexPlayer].score[columnId + 1] === undefined ||
        games[index].players[indexPlayer].score[columnId + 1] === ''
      )
        games[index].players[indexPlayer].score.splice(
          columnId,
          games[index].players[indexPlayer].score.length - columnId
        );
      else games[index].players[indexPlayer].score.splice(columnId, 1, '');
      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
    }

    //-----PATCH method for editing a column from a games table-----
    if (req.method === 'PATCH' && req.url === 'column/edit') {
      let { id, columnId, name } = req.body;

      let unParsed = localStorage.getItem('Columns');
      let columns: { id: number; columns: string[] }[] = [];
      if (unParsed) columns = JSON.parse(unParsed);
      let index = columns.findIndex((item) => item.id === id);
      columns[index].columns[columnId] = name;
      localStorage.setItem('Columns', JSON.stringify(columns));
      return of(new HttpResponse({ body: columns[index] }));
    }

    //-----PATCH method for editing a player from a game-----
    if (req.method === 'PATCH' && req.url === 'player/edit') {
      let { id, userId, name } = req.body;
      //
      // return of(req).pipe(
      //   mergeMap(() => {
      let unParsed = localStorage.getItem('Games');
      let games: Game[] = [];
      if (unParsed) games = JSON.parse(unParsed);
      let index = games.findIndex((item) => item.id === id);
      let indexPlayer = games[index].players.findIndex(
        (item) => item.id === userId
      );
      //players[index])
      games[index].players[indexPlayer].name = name;
      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
      //})
      //);
    }

    //-----PATCH method for editing a score from a player-----
    if (req.method === 'PATCH' && req.url === 'score/edit') {
      let { id, userId, columnId, score } = req.body;

      let unParsed = localStorage.getItem('Games');
      let games: Game[] = [];
      if (unParsed) games = JSON.parse(unParsed);
      let index = games.findIndex((item) => item.id === id);
      let indexPlayer = games[id].players.findIndex(
        (item) => item.id === userId
      );
      games[index].players[indexPlayer].score[columnId] = score;
      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games[index] }));
    }

    //-----DELETE method for deleting a game-----
    if (req.method === 'DELETE' && req.url === 'games') {
      let { id } = req.body;
      let unParsed = localStorage.getItem('Games');
      let games: Game[] = [];
      if (unParsed) games = JSON.parse(unParsed);
      let index = games.findIndex((item) => item.id === id);
      games.splice(index, 1);
      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games }));
    }

    //-----PATCH method for editing a games name-----
    if (req.method === 'PATCH' && req.url === 'games') {
      let { id, name } = req.body;

      let unParsed = localStorage.getItem('Games');
      let games: Game[] = [];
      if (unParsed) games = JSON.parse(unParsed);
      let index = games.findIndex((item) => item.id === id);
      games[index].name = name;
      localStorage.setItem('Games', JSON.stringify(games));
      return of(new HttpResponse({ body: games }));
    }

    //-----DELETE method for deleting a games column set-----
    if (req.method === 'DELETE' && req.url === 'column/set') {
      let { id } = req.body;

      let unParsed = localStorage.getItem('Columns');
      let columns: { id: number; columns: string[] }[] = [];
      if (unParsed) columns = JSON.parse(unParsed);
      let index = columns.findIndex((item) => item.id === id);
      columns.splice(index, 1);
      localStorage.setItem('Columns', JSON.stringify(columns));
      return of(new HttpResponse({ body: index }));
    }

    return next.handle(req);
  }
}
