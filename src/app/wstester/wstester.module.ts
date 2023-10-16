import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WSTesterPageRoutingModule } from './wstester-routing.module';

import { WSTesterPage } from './wstester.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WSTesterPageRoutingModule
  ],
  declarations: [WSTesterPage]
})
export class WSTesterPageModule {}
