import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable()
export class DbnameVersionService {
  databaseName!: string;
  mDb!: SQLiteDBConnection;

  private _dbNameVersionDict: Map<string, number> = new Map();

  constructor() {}
  set(dbName: string, version: number) {
    this._dbNameVersionDict.set(dbName, version);
  }
  getVersion(dbName: string) {
    if (this._dbNameVersionDict.has(dbName)) {
      return this._dbNameVersionDict.get(dbName);
    } else {
      return -1;
    }
  }
}
