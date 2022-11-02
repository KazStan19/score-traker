
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    exports: [
      MatToolbarModule,
      MatIconModule,
      MatMenuModule,
      MatSlideToggleModule,
    ]
})
export class  HeaderModule {}