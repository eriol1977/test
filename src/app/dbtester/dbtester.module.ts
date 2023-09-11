import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DBTesterPageRoutingModule } from './dbtester-routing.module';

import { DBTesterPage } from './dbtester.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DBTesterPageRoutingModule
  ],
  declarations: [DBTesterPage]
})
export class DBTesterPageModule {}
