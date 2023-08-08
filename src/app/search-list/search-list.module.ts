import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchListComponent } from './search-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [SearchListComponent],
  declarations: [SearchListComponent],
})
export class SearchListModule {}
