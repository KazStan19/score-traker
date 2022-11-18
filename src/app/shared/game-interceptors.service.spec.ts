// import { APP_BASE_HREF, Location } from '@angular/common';
// import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
// import { Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { GameInterceptorsService } from './game-interceptors.service';

// describe('InterceptorService', () => {
//   let backend: HttpTestingController;
//   let client: HttpClient;
//   let router: Router;
//   let store = { Games: {}, Columns: {} };

//   function getItem(type: string): string | null {
//     if (type === 'Games') return JSON.stringify(store.Games);
//     else return JSON.stringify(store.Games);
//   }

//   function setItem(type: string, obj: string) {
//     if (type === 'Games') store.Games = obj;
//     else store.Columns = obj;
//   }

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule,RouterTestingModule],
//       declarations: [],
//       providers: [
//         GameInterceptorsService,
//         {
//           provide: APP_BASE_HREF,
//           useValue: '/',
//         },
//         {
//           provide: HTTP_INTERCEPTORS,
//           useClass: GameInterceptorsService,
//           multi: true,
//         },
//       ],
//     }).compileComponents();
//     spyOn(localStorage, 'getItem').and.callFake(getItem);
//     spyOn(localStorage, 'setItem').and.callFake(setItem);
//     client = TestBed.inject(HttpClient);
//     backend = TestBed.inject(HttpTestingController);
//     router = TestBed.get(Router);
//   });

//   afterEach(() => {
//     backend.verify();
//   });

//   it('should redirect to /main/home if login successful', fakeAsync(
//     inject(
//       [Location, GameInterceptorsService],
//       (location: Location, service: GameInterceptorsService) => {

//         const successSpy = spyOn(service, 'intercept');
//         router.initialNavigation();
//         tick(50);
//         expect(successSpy).toHaveBeenCalled()

//       }
//     )
//   ));
// });
