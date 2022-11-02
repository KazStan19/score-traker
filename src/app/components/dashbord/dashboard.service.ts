import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Game } from 'src/app/models/game.model';

@Injectable()
export class DashBoardService {
  contentChanged = new Subject<Game>();
  displayedColumns: string[] = ['name'];
  displayedColumnsChanged = new Subject<string[]>();
  content!: Game;

  constructor(private http: HttpClient) {}

  getColumns(id: number) {
    this.http
      .get<{ id: string; columns: string[] }[]>('columns', {
        params: { id: id },
      })
      .subscribe((res) => {
        let foundGameColumns = res.find((item) => +item.id === id);

        if (foundGameColumns) {
          this.displayedColumns = foundGameColumns.columns;
        }

        this.displayedColumnsChanged.next(this.displayedColumns);
      });

    return this.displayedColumns;
  }

  addPlayer(id: number, name: string) {
    this.http
      .patch<Game>('player', {
        id: id,
        name: name,
      })
      .subscribe((item) => {
        this.content = item;
      });
    this.contentChanged.next(this.content);
  }

  addScores(
    id: number,
    userId: number,
    columnId: number | undefined,
    score: number
  ) {
    console.log(userId);
    this.http
      .patch<Game>('score', {
        id: id,
        userId: userId,
        columnId: columnId,
        score: score,
      })
      .subscribe((item) => {
        this.content = item;
      });

    this.contentChanged.next(this.content);
  }

  addColumn(id: number, name: string) {
    this.http
      .patch<{ id: string; columns: string[] }>('columns', {
        id: id,
        name: name,
      })
      .subscribe((item) => {
        this.displayedColumns = item.columns;
      });
    this.displayedColumnsChanged.next(this.displayedColumns);
  }

  getGame(id: number) {
    this.http
      .get<Game[]>('games')
      .subscribe((item) => (this.content = item[id]));
    return this.content;
  }

  deleteItem(
    id: number,
    userId: number | undefined,
    columnId: number | undefined
  ) {
    if (id !== undefined && userId !== undefined) {
      if (columnId !== undefined) {
        this.http
          .delete<Game>('score', {
            body: { id: id, userId: userId, columnId: columnId },
          })
          .subscribe((item) => {
            this.content = item;
          });
      }
      if (columnId === undefined) {
        this.http
          .delete<Game>('player', { body: { id: id, userId: userId } })
          .subscribe((item) => {
            this.content = item;
          });
      }
    }
    if (id !== undefined && columnId !== undefined && userId === undefined) {
      if (this.displayedColumns[columnId] !== 'name') {
        this.http
          .delete<{ id: string; columns: string[] }>('column', {
            body: { id: id, columnId: columnId },
          })
          .subscribe((item) => {
            this.displayedColumns = item.columns;
          });
        this.http
          .get<Game[]>('games')
          .subscribe((item) => (this.content = item[id]));
      }
    }

    this.contentChanged.next(this.content);
    this.displayedColumnsChanged.next(this.displayedColumns);
  }

  editItem(
    id: number,
    userId: number | undefined,
    columnId: number | undefined,
    name: number | string
  ) {
    if (id !== undefined && userId !== undefined) {
      //console.log(typeof name)
      if (columnId !== undefined) {
        if (!isNaN(+name))
          this.http
            .patch<Game>('score/edit', {
              id: id,
              userId: userId,
              columnId: columnId,
              score: +name,
            })
            .subscribe((item) => (this.content = item));
        else alert('please enter a number');
      }
      if (columnId === undefined) {
        this.http
          .patch<Game>('player/edit', {
            id: id,
            userId: userId,
            name: name,
          })
          .subscribe((item) => (this.content = item));
      }
    } else if (
      id !== undefined &&
      columnId !== undefined &&
      userId === undefined
    ) {
      if (this.displayedColumns[columnId] !== 'name') {
        this.http
          .patch<{ id: string; columns: string[] }>('columns/edit', {
            id: id,
            columnId: columnId,
            name: name,
          })
          .subscribe((item) => (this.displayedColumns = item.columns))
          ;
      }
    }
    this.contentChanged.next(this.content);
    this.displayedColumnsChanged.next(this.displayedColumns);
  }
}
