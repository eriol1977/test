import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
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
  SyncServiceMaintenance,
  SyncServicePurchase,
} from './core';
import { DataManager } from './core/datamanager/data-manager';
import { InMemoryDataManager } from './core/datamanager/in-memory-data-manager.service';

import { DbnameVersionService } from './core/services/dbname-version.service';
import { SQLiteService } from './core/services/sqlite.service';
import { InitializeAppService } from './core/services/initialize.app.service';
import { SQLiteDataManager } from './core/datamanager/sqlite-data-manager.service';
import { environment } from 'src/environments/environment';
import { AESService } from './core/services/aes.service';

export function initializeFactory(init: InitializeAppService) {
  return () => init.initializeApp();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SyncServiceMaintenance,
    SyncServicePurchase,
    ToastService,
    LoaderService,
    SearchListService,
    {
      provide: DataManager,
      useClass: environment.useSQLite ? SQLiteDataManager : InMemoryDataManager,
    }, // dependency injection: can switch DataSource implementation here
    DbnameVersionService,
    SQLiteService,
    InitializeAppService,
    AESService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFactory,
      deps: [InitializeAppService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
