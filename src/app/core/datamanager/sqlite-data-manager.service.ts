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
  REQHeader,
  REQRow,
  FinancialStruct,
} from 'src/app/common/models';
import { DbnameVersionService } from '../services/dbname-version.service';
import { DataCache } from './data-cache.service';

@Injectable({
  providedIn: 'root',
})
export class SQLiteDataManager implements DataManager {
  private cache_asset_location_valid: boolean = false;
  private cache_classification_valid: boolean = false;
  private cache_component_valid: boolean = false;
  private cache_component_problem_valid: boolean = false;
  private cache_problem_valid: boolean = false;
  private cache_personnel_valid: boolean = false;
  private cache_work_requests_valid: boolean = false;
  private cache_req_headers_valid: boolean = false;
  private cache_req_rows_valid: boolean = false;

  constructor(
    private sqliteService: SQLiteService,
    private dbVerService: DbnameVersionService,
    private cache: DataCache
  ) {}

  /////////////// ASSET LOCATIONS ///////////////////

  getAssetLocationList(): Observable<AssetLocation[]> {
    const observable = new Observable<AssetLocation[]>((observer) => {
      this.refreshAssetLocationsCache().subscribe(() => {
        observer.next(this.cache.getAssetLocationList());
        observer.complete();
      });
    });
    return observable;
  }

  getAssetLocation(ASLOCODE: string): Observable<AssetLocation> {
    const observable = new Observable<AssetLocation>((observer) => {
      this.refreshAssetLocationsCache().subscribe(() => {
        observer.next(this.cache.getAssetLocation(ASLOCODE));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<AssetLocation>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'assetLocation', {
    //       ASLOCODE: "'" + ASLOCODE + "'",
    //     })
    //     .then((loc) => {
    //       observer.next(loc);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  getChildrenAssetLocations(ASLOIDPARENT: string): Observable<AssetLocation[]> {
    const observable = new Observable<AssetLocation[]>((observer) => {
      this.refreshAssetLocationsCache().subscribe(() => {
        observer.next(this.cache.getChildrenAssetLocations(ASLOIDPARENT));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<any[]>((observer) => {
    //   this.getAssetLocationList().subscribe((list) => {
    //     observer.next(list.filter((loc) => loc.ASLOIDPARENT === ASLOIDPARENT));
    //     observer.complete();
    //   });
    // });
    // return observable;
  }

  setAssetLocationList(list: AssetLocation[]): Observable<void> {
    // invalidates cache
    this.cache_asset_location_valid = false;
    return this.insertList(list, 'assetLocation');
  }

  getAssetLocationDescriptivePath(ASLOCODE: string): Observable<string> {
    const observable = new Observable<string>((observer) => {
      this.refreshAssetLocationsCache().subscribe(() => {
        let loc = this.cache.getAssetLocation(ASLOCODE);
        let path = '';
        if (loc) {
          path = loc.ASLOIDPATH || '';
          let ids = path.replace('//', '').split('/');
          ids.pop(); // removes empty id at the end
          ids.forEach((id) => {
            let descr = this.cache.getAssetLocation(id)?.ASLODESCR || '';
            path = path.replace(id, descr);
          });
        }
        observer.next(path);
        observer.complete();
      });
    });
    return observable;
  }

  private refreshAssetLocationsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_asset_location_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('assetLocation').subscribe((list) => {
          this.cache.setAssetLocationList(list);
          this.cache_asset_location_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// CLASSIFICATIONS ///////////////////

  getClassificationsList(): Observable<Classification[]> {
    const observable = new Observable<Classification[]>((observer) => {
      this.refreshClassificationsCache().subscribe(() => {
        observer.next(this.cache.getClassificationsList());
        observer.complete();
      });
    });
    return observable;
  }

  getClassification(CLASCODE: string): Observable<Classification> {
    const observable = new Observable<Classification>((observer) => {
      this.refreshClassificationsCache().subscribe(() => {
        observer.next(this.cache.getClassification(CLASCODE));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<Classification>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'classification', {
    //       CLASCODE: "'" + CLASCODE + "'",
    //     })
    //     .then((clas) => {
    //       observer.next(clas);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  setClassificationsList(list: Classification[]): Observable<void> {
    // invalidates cache
    this.cache_classification_valid = false;
    return this.insertList(list, 'classification');
  }

  private refreshClassificationsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_classification_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('classification').subscribe((list) => {
          this.cache.setClassificationsList(list);
          this.cache_classification_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// COMPONENTS ///////////////////

  getComponentsList(): Observable<ComponentAsset[]> {
    const observable = new Observable<ComponentAsset[]>((observer) => {
      this.refreshComponentsCache().subscribe(() => {
        observer.next(this.cache.getComponentsList());
        observer.complete();
      });
    });
    return observable;
  }

  getComponent(
    COGRCDCOMP: string,
    COGRCDCLASS: string
  ): Observable<ComponentAsset> {
    const observable = new Observable<ComponentAsset>((observer) => {
      this.refreshComponentsCache().subscribe(() => {
        observer.next(this.cache.getComponent(COGRCDCOMP, COGRCDCLASS));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<ComponentAsset>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'component', {
    //       COGRCDCOMP: "'" + COGRCDCOMP + "'",
    //       COGRCDCLASS: "'" + COGRCDCLASS + "'",
    //     })
    //     .then((comp) => {
    //       observer.next(comp);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  setComponentsList(list: ComponentAsset[]): Observable<void> {
    // invalidates cache
    this.cache_component_valid = false;
    return this.insertList(list, 'component');
  }

  private refreshComponentsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_component_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('component').subscribe((list) => {
          this.cache.setComponentsList(list);
          this.cache_component_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// COMPONENT PROBLEMS ///////////////////

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    const observable = new Observable<ComponentProblem[]>((observer) => {
      this.refreshComponentProblemsCache().subscribe(() => {
        observer.next(this.cache.getComponentProblemsList());
        observer.complete();
      });
    });
    return observable;
  }

  getComponentProblem(
    PRCOCDCOMP: string,
    PRCOCDCLASS: string,
    PRCOCDPROBLEM: string
  ): Observable<ComponentProblem> {
    const observable = new Observable<ComponentProblem>((observer) => {
      this.refreshComponentProblemsCache().subscribe(() => {
        observer.next(
          this.cache.getComponentProblem(PRCOCDCOMP, PRCOCDCLASS, PRCOCDPROBLEM)
        );
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<ComponentProblem>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'componentProblem', {
    //       PRCOCDCOMP: "'" + PRCOCDCOMP + "'",
    //       PRCOCDCLASS: "'" + PRCOCDCLASS + "'",
    //       PRCOCDPROBLEM: "'" + PRCOCDPROBLEM + "'",
    //     })
    //     .then((comp) => {
    //       observer.next(comp);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  setComponentProblemsList(list: ComponentProblem[]): Observable<void> {
    // invalidates cache
    this.cache_component_problem_valid = false;
    return this.insertList(list, 'componentProblem');
  }

  private refreshComponentProblemsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_component_problem_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('componentProblem').subscribe((list) => {
          this.cache.setComponentProblemsList(list);
          this.cache_component_problem_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// PROBLEMS ///////////////////

  getProblemsList(): Observable<Problem[]> {
    const observable = new Observable<Problem[]>((observer) => {
      this.refreshProblemsCache().subscribe(() => {
        observer.next(this.cache.getProblemsList());
        observer.complete();
      });
    });
    return observable;
  }

  getProblem(PROBCODE: string): Observable<Problem> {
    const observable = new Observable<Problem>((observer) => {
      this.refreshProblemsCache().subscribe(() => {
        observer.next(this.cache.getProblem(PROBCODE));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<Problem>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'problem', {
    //       PROBCODE: "'" + PROBCODE + "'",
    //     })
    //     .then((prob) => {
    //       observer.next(prob);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  setProblemsList(list: Problem[]): Observable<void> {
    // invalidates cache
    this.cache_problem_valid = false;
    return this.insertList(list, 'problem');
  }

  private refreshProblemsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_problem_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('problem').subscribe((list) => {
          this.cache.setProblemsList(list);
          this.cache_problem_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// PERSONNEL ///////////////////

  getPersonnelList(): Observable<Personnel[]> {
    const observable = new Observable<Personnel[]>((observer) => {
      this.refreshPersonnelCache().subscribe(() => {
        observer.next(this.cache.getPersonnelList());
        observer.complete();
      });
    });
    return observable;
  }

  getPersonnel(PERSONID: string): Observable<Personnel> {
    const observable = new Observable<Personnel>((observer) => {
      this.refreshPersonnelCache().subscribe(() => {
        observer.next(this.cache.getPersonnel(PERSONID));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<Personnel>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'personnel', {
    //       PERSONID: "'" + PERSONID + "'",
    //     })
    //     .then((prob) => {
    //       observer.next(prob);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  setPersonnelList(list: Personnel[]): Observable<void> {
    // invalidates cache
    this.cache_personnel_valid = false;
    return this.insertList(list, 'personnel');
  }

  private refreshPersonnelCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_personnel_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('personnel').subscribe((list) => {
          this.cache.setPersonnelList(list);
          this.cache_personnel_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  /////////////// WORK REQUESTS ///////////////////

  addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      this.insertItem(workRequest, 'workRequest').subscribe((wr) => {
        this.cache.addWorkRequest(wr);
        observer.next(wr);
        observer.complete();
      });
    });
    return observable;
  }

  updateWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      let idOption = { IDLIST: "'" + workRequest.IDLIST + "'" };
      this.updateItem(workRequest, 'workRequest', idOption).subscribe((wr) => {
        this.cache.updateWorkRequest(wr);
        observer.next(wr);
        observer.complete();
      });
    });
    return observable;
  }

  getWorkRequests(): Observable<WorkRequest[]> {
    const observable = new Observable<WorkRequest[]>((observer) => {
      this.refreshWorkRequestCache().subscribe(() => {
        observer.next(this.cache.getWorkRequests());
        observer.complete();
      });
    });
    return observable;
  }

  getWorkRequest(IDLIST: string): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      this.refreshWorkRequestCache().subscribe(() => {
        observer.next(this.cache.getWorkRequest(IDLIST));
        observer.complete();
      });
    });
    return observable;

    // const observable = new Observable<WorkRequest>((observer) => {
    //   this.sqliteService
    //     .findOneBy(this.dbVerService.mDb, 'workRequest', {
    //       IDLIST: "'" + IDLIST + "'",
    //     })
    //     .then((wr) => {
    //       observer.next(wr);
    //       observer.complete();
    //     });
    // });
    // return observable;
  }

  deleteWorkRequest(IDLIST: string): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.sqliteService
        .remove(this.dbVerService.mDb, 'workRequest', {
          IDLIST: "'" + IDLIST + "'",
        })
        .then(() => {
          this.saveWebMemoryToStore().then(() => {
            this.cache.deleteWorkRequest(IDLIST);
            observer.next();
            observer.complete();
          });
        });
    });
    return observable;
  }

  private refreshWorkRequestCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_work_requests_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('workRequest').subscribe((list) => {
          this.cache.setWorkRequests(list);
          this.cache_work_requests_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  ///////////////// REQs ///////////////////////

  getREQHeadersList(): Observable<REQHeader[]> {
    const observable = new Observable<REQHeader[]>((observer) => {
      this.refreshREQHeadersCache().subscribe(() => {
        observer.next(this.cache.getREQHeadersList());
        observer.complete();
      });
    });
    return observable;
  }

  getREQHeader(IDDOC: string): Observable<REQHeader> {
    const observable = new Observable<REQHeader>((observer) => {
      this.refreshREQHeadersCache().subscribe(() => {
        observer.next(this.cache.getREQHeader(IDDOC));
        observer.complete();
      });
    });
    return observable;
  }

  private refreshREQHeadersCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_req_headers_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('reqHeaders').subscribe((list) => {
          this.cache.setREQHeadersList(list);
          this.cache_req_headers_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  setREQHeadersList(list: REQHeader[]): Observable<void> {
    // invalidates cache
    this.cache_req_headers_valid = false;
    return this.insertList(list, 'reqHeaders');
  }

  getREQRowsList(): Observable<REQRow[]> {
    const observable = new Observable<REQRow[]>((observer) => {
      this.refreshREQRowsCache().subscribe(() => {
        observer.next(this.cache.getREQRowsList());
        observer.complete();
      });
    });
    return observable;
  }

  private refreshREQRowsCache(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // does nothing if the cache is still valid
      if (this.cache_req_rows_valid) {
        observer.next();
        observer.complete();
      } else {
        // updates cache using local DB data and validates it
        this.getList('reqRows').subscribe((list) => {
          this.cache.setREQRowsList(list);
          this.cache_req_rows_valid = true;
          observer.next();
          observer.complete();
        });
      }
    });
    return observable;
  }

  setREQRowsList(list: REQRow[]): Observable<void> {
    // invalidates cache
    this.cache_req_rows_valid = false;
    return this.insertList(list, 'reqRows');
  }

  deleteREQ(IDDOC: string): Observable<void> {
    // TODO
    const observable = new Observable<void>((observer) => {
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getCostCenters(PARENTCODE: string): Observable<FinancialStruct[]> {
    // TODO
    const observable = new Observable<FinancialStruct[]>((observer) => {
      observer.next(undefined);
      observer.complete();
    });
    return observable;
  }

  getAccounts(PARENTCODE: string): Observable<FinancialStruct[]> {
    // TODO
    const observable = new Observable<FinancialStruct[]>((observer) => {
      observer.next(undefined);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructRecord(IDFINSTRUCT: string): Observable<FinancialStruct> {
    // TODO
    const observable = new Observable<FinancialStruct>((observer) => {
      observer.next(undefined);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructRecordDescriptivePath(
    IDFINSTRUCT: string
  ): Observable<string> {
    // TODO
    const observable = new Observable<string>((observer) => {
      observer.next(undefined);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructList(): Observable<FinancialStruct[]> {
    // TODO
    const observable = new Observable<FinancialStruct[]>((observer) => {
      observer.next(undefined);
      observer.complete();
    });
    return observable;
  }

  setFinancialStruct(list: FinancialStruct[]): Observable<void> {
    // TODO
    return this.insertList(list, 'financialStruct');
  }

  /////////////// GENERIC ///////////////////

  hasMasterData(): Observable<boolean> {
    const observable = new Observable<boolean>((observer) => {
      const reads: Observable<any>[] = [];
      reads.push(this.getAssetLocationList());
      reads.push(this.getClassificationsList());
      reads.push(this.getComponentsList());
      reads.push(this.getComponentProblemsList());
      reads.push(this.getProblemsList());
      reads.push(this.getPersonnelList());
      reads.push(this.getREQHeadersList());
      reads.push(this.getREQRowsList());
      forkJoin(reads).subscribe(
        ([
          assetLocations,
          classifications,
          components,
          componentsProblems,
          problems,
          personnel,
          reqHeaders,
          reqRows,
        ]) => {
          let result =
            assetLocations.length > 0 ||
            classifications.length > 0 ||
            components.length > 0 ||
            componentsProblems.length > 0 ||
            problems.length > 0 ||
            personnel.length > 0 ||
            reqHeaders.length > 0 ||
            reqRows.length > 0;
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
    await this.sqliteService.insertMany(this.dbVerService.mDb, table, list);
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
