
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {  MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LandingService } from './landing.service';




@NgModule({
    exports: [
      CommonModule,
      MatSelectModule,
      MatButtonModule,
      MatCardModule,
      ReactiveFormsModule,
      FormsModule,
      MatDividerModule,
      MatInputModule
    ],
    providers:[LandingService]
})
export class  LandingModule {}