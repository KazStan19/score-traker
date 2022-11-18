import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingComponent } from './components/landing/landing.component';
import { LandingModule } from './components/landing/landing.module';
import { HeaderComponent } from './components/header/header.component';
import { HeaderModule } from './components/header/header.module';
import { SharedService } from './shared/shared.service';
import { DashBoardService } from './components/dashbord/dashboard.service';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { DashboardEditComponent } from './components/dashbord/dashboard-edit/dashboard-edit.component';
import { DashboardModule } from './components/dashbord/dashboard.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GameInterceptorsService } from './shared/game-interceptors.service';
import { DashBoardGuardService } from './components/dashbord/dashboard-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HeaderComponent,
    DashbordComponent,
    DashboardEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LandingModule,
    HeaderModule,
    DashboardModule,
    HttpClientModule,
  ],
  providers: [
    SharedService,
    DashBoardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GameInterceptorsService,
      multi: true,
    },
    DashBoardGuardService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
