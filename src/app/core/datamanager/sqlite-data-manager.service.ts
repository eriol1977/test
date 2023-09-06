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
    const observable = new Observable<AssetLocation[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
  }

  setAssetLocationList(list: AssetLocation[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getClassificationsList(): Observable<Classification[]> {
    const observable = new Observable<Classification[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
  }

  setClassificationsList(list: Classification[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    const observable = new Observable<ComponentAsset[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
  }

  setComponentsList(list: ComponentAsset[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    const observable = new Observable<ComponentProblem[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
  }

  setComponentProblemsList(list: ComponentProblem[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getProblemsList(): Observable<Problem[]> {
    const observable = new Observable<Problem[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
  }

  setProblemsList(list: Problem[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getPersonnelList(): Observable<Personnel[]> {
    const observable = new Observable<Personnel[]>((observer) => {
      let list: Personnel[] = [];
      this.initAppService.mDb
        .query('select * from personnel')
        .then((result) => {
          list = result.values || [];
          observer.next(list);
          observer.complete();
        });
    });
    return observable;
  }

  setPersonnelList(list: Personnel[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.doSetPersonnelList(list).then(() => {
        this.initAppService.saveWebMemoryToStore().then(() => {
          observer.next();
          observer.complete();
        });
      });
    });
    return observable;
  }

  private async doSetPersonnelList(list: Personnel[]): Promise<void> {
    for (const personnel of list) {
      await this.sqliteService.save(
        this.initAppService.mDb,
        'personnel',
        personnel
      );
    }
  }

  addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      observer.next(workRequest);
      observer.complete();
    });
    return observable;
  }

  getWorkRequests(): Observable<WorkRequest[]> {
    const observable = new Observable<WorkRequest[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return observable;
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
}
