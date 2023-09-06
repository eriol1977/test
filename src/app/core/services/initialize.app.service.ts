import { Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { personnelVersionUpgrades } from '../../upgrades/upgrade-statements';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { DbnameVersionService } from './dbname-version.service';
import { Platform } from '@ionic/angular';

@Injectable()
export class InitializeAppService {
  isAppInit: boolean = false;
  public databaseName: string = 'my_db';
  private versionUpgrades = personnelVersionUpgrades;
  private loadToVersion =
    personnelVersionUpgrades[personnelVersionUpgrades.length - 1].toVersion;
  mDb!: SQLiteDBConnection;

  constructor(
    private platform: Platform,
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService
  ) {
    this.platform.ready().then(() => {});
  }

  async initializeApp() {
    await this.sqliteService.initializePlugin().then(async (ret) => {
      try {
        if (this.sqliteService.platform === 'web') {
          await this.sqliteService.initWebStore();
        }
        await this.initializeDatabase();
        this.isAppInit = true;
        console.log('DB initialized');
      } catch (error) {
        console.log(`initializeAppError: ${error}`);
      }
    });
  }

  async initializeDatabase() {
    // create upgrade statements
    await this.sqliteService.addUpgradeStatement({
      database: this.databaseName,
      upgrade: this.versionUpgrades,
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
  }

  // save the databases from memory to store
  async saveWebMemoryToStore(): Promise<void> {
    if (this.sqliteService.platform === 'web') {
      await this.sqliteService.sqliteConnection.saveToStore(this.databaseName);
    }
  }
}
