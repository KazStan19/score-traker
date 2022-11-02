import {
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { mergeMap, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DashboardInterceptorsService implements HttpInterceptor {
  constructor(private params: HttpParams) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    console.log(this.params);
    if (req.method === 'GET' && req.url === 'columns') {
      return next.handle(req).pipe(
        mergeMap(() => {
          let item = localStorage.getItem('Columns');
          let gameColumns: { id: number; columns: string[] }[] = [];
          if (item) gameColumns = JSON.parse(item);
          else {
            return of(new HttpResponse({ body: '{id:}' }));
          }
          return of(new HttpResponse({ body: 'games' }));
        })
      );
    }
    return next.handle(req);
  }
}
