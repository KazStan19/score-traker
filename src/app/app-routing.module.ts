import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DashbordComponent } from './components/dashbord/dashbord.component';
import { DashboardEditComponent } from './components/dashbord/dashboard-edit/dashboard-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingComponent },
  {
    path: 'game/:id',
    component: DashbordComponent,
    children: [
      { path: 'playerAdd', component: DashboardEditComponent },
      { path: 'columnAdd', component: DashboardEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
