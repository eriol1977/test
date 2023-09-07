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
import { InitializeAppService } from '../services/initialize.app.service';

@Injectable({
  providedIn: 'root',
})
export class SQLiteDataManager implements DataManager {
  constructor(
    private sqliteService: SQLiteService,
    private initAppService: InitializeAppService
  ) {}

  getAssetLocationList(): Observable<AssetLocation[]> {
    return this.getList('assetLocation');
  }

  setAssetLocationList(list: AssetLocation[]): Observable<void> {
    return this.setList(list, 'assetLocation');
  }

  getClassificationsList(): Observable<Classification[]> {
    return this.getList('classification');
  }

  setClassificationsList(list: Classification[]): Observable<void> {
    return this.setList(list, 'classification');
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    return this.getList('component');
  }

  setComponentsList(list: ComponentAsset[]): Observable<void> {
    return this.setList(list, 'component');
  }

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    return this.getList('componentProblem');
  }

  setComponentProblemsList(list: ComponentProblem[]): Observable<void> {
    return this.setList(list, 'componentProblem');
  }

  getProblemsList(): Observable<Problem[]> {
    return this.getList('problem');
  }

  setProblemsList(list: Problem[]): Observable<void> {
    return this.setList(list, 'problem');
  }

  getPersonnelList(): Observable<Personnel[]> {
    return this.getList('personnel');
  }

  setPersonnelList(list: Personnel[]): Observable<void> {
    return this.setList(list, 'personnel');
  }

  addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    return this.setItem(workRequest, 'workRequest');
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
        this.initAppService.databaseName
      );
    }
  }

  private getList(table: string): Observable<any[]> {
    const observable = new Observable<any[]>((observer) => {
      let list: any[] = [];
      this.initAppService.mDb.query('select * from ' + table).then((result) => {
        list = result.values || [];
        observer.next(list);
        observer.complete();
      });
    });
    return observable;
  }

  private setList(list: any[], table: string): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.doSetList(list, table).then(() => {
        this.saveWebMemoryToStore().then(() => {
          observer.next();
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doSetList(list: any[], table: string): Promise<void> {
    for (const item of list) {
      await this.doSetItem(item, table);
    }
  }

  private setItem(item: any, table: string): Observable<any> {
    const observable = new Observable<any>((observer) => {
      this.doSetItem(item, table).then(() => {
        this.saveWebMemoryToStore().then(() => {
          observer.next(item);
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doSetItem(item: any, table: string): Promise<void> {
    return this.sqliteService.save(this.initAppService.mDb, table, item);
  }
}
