
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
    exports: [
      CommonModule,
      MatMenuModule,
      MatIconModule
    ]
})
export class  DashboardModule {}