import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { versionUpgrades } from '../../upgrades/upgrade-statements';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbnameVersionService } from './dbname-version.service';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SyncServiceMaintenance, SyncServicePurchase } from 'src/app/core';
import { LoaderService } from '../../core/services/loader.service';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  private databaseName: string = environment.databaseName;
  private loadToVersion = environment.databaseVersion;
  private mDb!: SQLiteDBConnection;

  constructor(
    private platform: Platform,
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
    private syncServiceMaintenance: SyncServiceMaintenance,
    private syncServicePurchase: SyncServicePurchase,
    private loadingService: LoaderService
  ) {
    this.platform.ready().then(() => {});
  }

  async initializeApp() {
    // waits for the loading message component to be ready, before proceeding
    await this.loadingService.show({
      message: 'Initializing app...',
    });

    // database initialization, if needed
    if (environment.useSQLite) {
      await this.sqliteService.initializePlugin().then(async (ret) => {
        try {
          if (this.sqliteService.platform === 'web') {
            await this.sqliteService.initWebStore();
          }
          await this.initializeDatabase();
        } catch (error) {
          this.loadingService.addMessage(`Unexpected error: ${error}`);
          console.log(`Unexpected error: ${error}`);
        }
      });
    }

    // synchronizes all data to/from MCM
    if (environment.maintenanceModuleActive) {
      this.syncServiceMaintenance.synchronize().subscribe(() => {
        if (!environment.purchaseModuleActive) {
          this.isAppInit = true;
          this.loadingService.hide();
        }
      });
    }

    if (environment.purchaseModuleActive) {
      this.syncServicePurchase.synchronize().subscribe(() => {
        this.isAppInit = true;
        this.loadingService.hide();
      });
    }

    if (
      !environment.maintenanceModuleActive &&
      !environment.purchaseModuleActive
    ) {
      this.isAppInit = true;
      this.loadingService.hide();
    }
  }

  async initializeDatabase() {
    // create upgrade statements
    await this.sqliteService.addUpgradeStatement({
      database: this.databaseName,
      upgrade: versionUpgrades,
    });
    // create and/or open the database
    await this.openDatabase();
    this.dbVerService.set(this.databaseName, this.loadToVersion);
  }

  async openDatabase() {
    if (
      (this.sqliteService.native ||
        this.sqliteService.platform === 'electron') &&
      (await this.sqliteService.isInConfigEncryption()).result &&
      (await this.sqliteService.isDatabaseEncrypted(this.databaseName)).result
    ) {
      this.mDb = await this.sqliteService.openDatabase(
        this.databaseName,
        true,
        'secret',
        this.loadToVersion,
        false
      );
    } else {
      this.mDb = await this.sqliteService.openDatabase(
        this.databaseName,
        false,
        'no-encryption',
        this.loadToVersion,
        false
      );
    }
    this.dbVerService.databaseName = this.databaseName;
    this.dbVerService.mDb = this.mDb;
  }
}
