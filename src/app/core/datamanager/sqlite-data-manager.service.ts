import { Injectable } from '@angular/core';
import { DataManager } from './data-manager';
import { Observable, forkJoin } from 'rxjs';
import { SQLiteService } from '../services/sqlite.service';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  ComponentProblem,
  Problem,
  Personnel,
  WorkRequest,
} from 'src/app/common/models';
import { DbnameVersionService } from '../services/dbname-version.service';

@Injectable({
  providedIn: 'root',
})
export class SQLiteDataManager implements DataManager {
  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService
  ) {}

  getAssetLocationList(): Observable<AssetLocation[]> {
    return this.getList('assetLocation');
  }

  setAssetLocationList(list: AssetLocation[]): Observable<void> {
    return this.insertList(list, 'assetLocation');
  }

  getClassificationsList(): Observable<Classification[]> {
    return this.getList('classification');
  }

  setClassificationsList(list: Classification[]): Observable<void> {
    return this.insertList(list, 'classification');
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    return this.getList('component');
  }

  setComponentsList(list: ComponentAsset[]): Observable<void> {
    return this.insertList(list, 'component');
  }

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    return this.getList('componentProblem');
  }

  setComponentProblemsList(list: ComponentProblem[]): Observable<void> {
    return this.insertList(list, 'componentProblem');
  }

  getProblemsList(): Observable<Problem[]> {
    return this.getList('problem');
  }

  setProblemsList(list: Problem[]): Observable<void> {
    return this.insertList(list, 'problem');
  }

  getPersonnelList(): Observable<Personnel[]> {
    return this.getList('personnel');
  }

  setPersonnelList(list: Personnel[]): Observable<void> {
    return this.insertList(list, 'personnel');
  }

  addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    return this.insertItem(workRequest, 'workRequest');
  }

  updateWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    let idOption = { IDLIST: "'" + workRequest.IDLIST + "'" };
    return this.updateItem(workRequest, 'workRequest', idOption);
  }

  getWorkRequests(): Observable<WorkRequest[]> {
    return this.getList('workRequest');
  }

  hasMasterData(): Observable<boolean> {
    const observable = new Observable<boolean>((observer) => {
      const reads: Observable<any>[] = [];
      reads.push(this.getAssetLocationList());
      reads.push(this.getClassificationsList());
      reads.push(this.getComponentsList());
      reads.push(this.getComponentProblemsList());
      reads.push(this.getProblemsList());
      reads.push(this.getPersonnelList());
      forkJoin(reads).subscribe(
        ([
          assetLocations,
          classifications,
          components,
          componentsProblems,
          problems,
          personnel,
        ]) => {
          let result =
            assetLocations.length > 0 ||
            classifications.length > 0 ||
            components.length > 0 ||
            componentsProblems.length > 0 ||
            problems.length > 0 ||
            personnel.length > 0;
          observer.next(result);
          observer.complete();
        }
      );
    });
    return observable;
  }

  // save the databases from memory to store
  private async saveWebMemoryToStore(): Promise<void> {
    if (this.sqliteService.platform === 'web') {
      await this.sqliteService.sqliteConnection.saveToStore(
        this.dbVerService.databaseName
      );
    }
  }

  private getList(table: string): Observable<any[]> {
    const observable = new Observable<any[]>((observer) => {
      let list: any[] = [];
      this.dbVerService.mDb.query('select * from ' + table).then((result) => {
        list = result.values || [];
        observer.next(list);
        observer.complete();
      });
    });
    return observable;
  }

  private insertList(list: any[], table: string): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.doInsertList(list, table).then(() => {
        this.saveWebMemoryToStore().then(() => {
          observer.next();
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doInsertList(list: any[], table: string): Promise<void> {
    for (const item of list) {
      await this.doInsertItem(item, table);
    }
  }

  private insertItem(item: any, table: string): Observable<any> {
    const observable = new Observable<any>((observer) => {
      this.doInsertItem(item, table).then(() => {
        this.saveWebMemoryToStore().then(() => {
          observer.next(item);
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doInsertItem(item: any, table: string): Promise<void> {
    return this.sqliteService.save(this.dbVerService.mDb, table, item);
  }

  private updateItem(
    item: any,
    table: string,
    idOption: object
  ): Observable<any> {
    const observable = new Observable<any>((observer) => {
      this.doUpdateItem(item, table, idOption).then(() => {
        this.saveWebMemoryToStore().then(() => {
          observer.next(item);
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doUpdateItem(
    item: any,
    table: string,
    idOption: object
  ): Promise<void> {
    return this.sqliteService.save(
      this.dbVerService.mDb,
      table,
      item,
      idOption
    );
  }
}
