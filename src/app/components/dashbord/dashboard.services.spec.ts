import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashBoardService } from './dashboard.service';
import { Game } from 'src/app/models/game.model';
// import { GameInterceptorsService } from 'src/app/shared/game-interceptors.service';

describe('DataService', () => {
  let httpTestingController: HttpTestingController;
  let service: DashBoardService;
  let columns: { id: string; columns: string[] }[] = [
    { id: '269', columns: ['name', 'round2', 'round3', 'round4'] },
    { id: '125', columns: ['name', 'round1'] },
  ];
  let games: Game[] = [
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
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashBoardService],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DashBoardService);
    localStorage.setItem('Games', JSON.stringify(games));
    localStorage.setItem('Columns', JSON.stringify(columns));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('#getColumns should return expected data', () => {
    service.getColumns(269).subscribe((item) => {
      expect(item).toEqual(columns);
    });
    const testRequest = httpTestingController.expectOne({
      url: 'columns?id=269',
    });
    expect(testRequest.request.url).toEqual('columns');
    testRequest.flush(columns);
  });

  it('displayedColumnsChanged should change after running  #getColumns', () => {
    service.getColumns(269).subscribe();
    let req = httpTestingController.expectOne({ url: 'columns?id=269' });
    service.displayedColumnsChanged.subscribe((item) => {
      expect(item).toEqual(columns[0].columns);
    });
    req.flush(columns);
  });

  it('#getGame should return expected data', () => {
    service.getGame(269).subscribe((item) => {
      expect(item).toEqual(games);
    });
    const testRequest = httpTestingController.expectOne({ url: 'games' });
    expect(testRequest.request.url).toEqual('games');
    testRequest.flush(games);
  });

  it('contentChanged should change after running  #getGames', () => {
    service.getGame(269).subscribe();
    let req = httpTestingController.expectOne({ url: 'games' });
    service.contentChanged.subscribe((item) => {
      expect(item).toEqual(games[0]);
    });
    req.flush(games);
  });

  it('after running #addPlayer contentChanged should have changed', () => {
    service.addPlayer(269, 'Tom');
    let req = httpTestingController.expectOne({
      url: 'player',
      method: 'PATCH',
    });
    service.contentChanged.subscribe((item) => {
      expect(item.players[item.players.length - 1].name).toEqual('Tom');
    });
    //expect(req.request.url).toEqual('player');
    req.flush(games);
  });

  it('after running #addScores contentChanged should have changed', () => {
    service.addScores(269, 57, undefined, 0);
    let req = httpTestingController.expectOne({
      url: 'score',
      method: 'PATCH',
    });
    service.contentChanged.subscribe((item) => {
      expect(item.players[0].score[item.players[0].score.length - 1]).toEqual(
        1
      );
    });
    //expect(req.request.url).toEqual('score');
    req.flush(games);
    });
    
    it('after running #addColumn displayedColumnsChanged should have changed', () => {
    service.addColumn(269, 'Round 10');
    let req = httpTestingController.expectOne({
      url: 'columns',
      method: 'PATCH',
    });
    service.displayedColumnsChanged.subscribe((item) => {
      expect(item[item.length - 1]).toEqual('Round 10');
    });
    //expect(req.request.url).toEqual('columns');
    req.flush(columns);
    });
    
    it('after running #deleteItem with only id and userId passed changedContent should change', () => {
    service.deleteItem(269, 57, 0);
    let req = httpTestingController.expectOne({
      url: 'score',
      method: 'DELETE',
    });
    service.contentChanged.subscribe((item) => {
      expect(item.players.length).toEqual(2);
    });
    //expect(req.request.url).toEqual('player');
    req.flush(games);
  });

  it('after running #deleteItem with only id, userId and columnId passed changedContent should change', () => {
    service.deleteItem(269, 57, undefined);
    let req = httpTestingController.expectOne({
      url: 'player',
      method: 'DELETE',
    });
    service.contentChanged.subscribe((item) => {
      expect(item.players[0].score.length).toEqual(0);
    });
    req.flush(games);
  });

  it('after running #deleteItem with only id and columnId passed displayedColumnsChanged should change', () => {
    service.deleteItem(269, 57, undefined);
    let req = httpTestingController.expectOne({
      url: 'player',
      method: 'DELETE',
    });
    service.displayedColumnsChanged.subscribe((item) => {
      expect(item.length).toEqual(3);
    });

    req.flush(games);
  });
});
