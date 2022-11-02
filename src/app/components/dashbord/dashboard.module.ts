
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

@NgModule({
    
    exports: [
      CommonModule,
      MatTableModule,
      MatPaginatorModule,
      MatMenuModule
    ]
})
export class  DashboardModule {}