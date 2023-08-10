import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {
  LoaderService,
  SearchListService,
  ToastService,
  WorkRequestRestService,
} from './core';
import { DataManager } from './core/datamanager/data-manager';
import { InMemoryDataManager } from './core/datamanager/in-memory-data-manager.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    WorkRequestRestService,
    ToastService,
    LoaderService,
    SearchListService,
    { provide: DataManager, useClass: InMemoryDataManager }, // dependency injection: can switch DataSource implementation here
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
