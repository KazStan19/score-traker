import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { DashboardEditComponent } from './components/dashbord/dashboard-edit/dashboard-edit.component';
import { DashBoardGuardService } from './components/dashbord/dashboard-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingComponent },
  {
    path: 'game/:id',
    component: DashbordComponent,
    canActivate:[DashBoardGuardService],
    children: [
      { path: ':type', component: DashboardEditComponent },
 
    ],
  },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
