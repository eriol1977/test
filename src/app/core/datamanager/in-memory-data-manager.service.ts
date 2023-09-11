import { Injectable } from '@angular/core';
import { DataManager } from './data-manager';
import { Observable } from 'rxjs';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  ComponentProblem,
  Problem,
  Personnel,
  WorkRequest,
} from 'src/app/common/models';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataManager implements DataManager {
  assetLocations: AssetLocation[] = [];
  classifications: Classification[] = [];
  components: ComponentAsset[] = [];
  componentsProblems: ComponentProblem[] = [];
  problems: Problem[] = [];
  personnel: Personnel[] = [];
  workRequests: WorkRequest[] = [];

  constructor() {}

  getAssetLocationList(): Observable<AssetLocation[]> {
    const observable = new Observable<AssetLocation[]>((observer) => {
      observer.next(this.assetLocations);
      observer.complete();
    });
    return observable;
  }

  getAssetLocation(ASLOCODE: string): Observable<AssetLocation> {
    const observable = new Observable<AssetLocation>((observer) => {
      let loc = this.assetLocations.find((l) => l.ASLOCODE === ASLOCODE);
      observer.next(loc);
      observer.complete();
    });
    return observable;
  }

  setAssetLocationList(list: AssetLocation[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.assetLocations = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getClassificationsList(): Observable<Classification[]> {
    const observable = new Observable<Classification[]>((observer) => {
      observer.next(this.classifications);
      observer.complete();
    });
    return observable;
  }

  getClassification(CLASCODE: string): Observable<Classification> {
    const observable = new Observable<Classification>((observer) => {
      let clas = this.classifications.find((c) => c.CLASCODE === CLASCODE);
      observer.next(clas);
      observer.complete();
    });
    return observable;
  }

  setClassificationsList(list: Classification[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.classifications = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getComponentsList(): Observable<ComponentAsset[]> {
    const observable = new Observable<ComponentAsset[]>((observer) => {
      observer.next(this.components);
      observer.complete();
    });
    return observable;
  }

  getComponent(
    COGRCDCOMP: string,
    COGRCDCLASS: string
  ): Observable<ComponentAsset> {
    const observable = new Observable<ComponentAsset>((observer) => {
      let comp = this.components.find(
        (c) => c.COGRCDCOMP === COGRCDCOMP && c.COGRCDCLASS === COGRCDCLASS
      );
      observer.next(comp);
      observer.complete();
    });
    return observable;
  }

  setComponentsList(list: ComponentAsset[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.components = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getComponentProblemsList(): Observable<ComponentProblem[]> {
    const observable = new Observable<ComponentProblem[]>((observer) => {
      observer.next(this.componentsProblems);
      observer.complete();
    });
    return observable;
  }

  getComponentProblem(
    PRCOCDCOMP: string,
    PRCOCDCLASS: string,
    PRCOCDPROBLEM: string
  ): Observable<ComponentProblem> {
    const observable = new Observable<ComponentProblem>((observer) => {
      let comp = this.componentsProblems.find(
        (c) =>
          c.PRCOCDCOMP === PRCOCDCOMP &&
          c.PRCOCDCLASS === PRCOCDCLASS &&
          c.PRCOCDPROBLEM === PRCOCDPROBLEM
      );
      observer.next(comp);
      observer.complete();
    });
    return observable;
  }

  setComponentProblemsList(list: ComponentProblem[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.componentsProblems = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getProblemsList(): Observable<Problem[]> {
    const observable = new Observable<Problem[]>((observer) => {
      observer.next(this.problems);
      observer.complete();
    });
    return observable;
  }

  getProblem(PROBCODE: string): Observable<Problem> {
    const observable = new Observable<Problem>((observer) => {
      let prob = this.problems.find((p) => p.PROBCODE === PROBCODE);
      observer.next(prob);
      observer.complete();
    });
    return observable;
  }

  setProblemsList(list: Problem[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.problems = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getPersonnelList(): Observable<Personnel[]> {
    const observable = new Observable<Personnel[]>((observer) => {
      observer.next(this.personnel);
      observer.complete();
    });
    return observable;
  }

  getPersonnel(PERSONID: string): Observable<Personnel> {
    const observable = new Observable<Personnel>((observer) => {
      let pers = this.personnel.find((p) => p.PERSONID === PERSONID);
      observer.next(pers);
      observer.complete();
    });
    return observable;
  }

  setPersonnelList(list: Personnel[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.personnel = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      this.workRequests.push(workRequest);
      observer.next(workRequest);
      observer.complete();
    });
    return observable;
  }

  updateWorkRequest(workRequest: WorkRequest): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      // removes the original WR and re-adds it, with its updated fields
      this.workRequests = this.workRequests.filter(
        (wr) => wr.IDLIST !== workRequest.IDLIST
      );
      this.workRequests.push(workRequest);
      observer.next(workRequest);
      observer.complete();
    });
    return observable;
  }

  getWorkRequests(): Observable<WorkRequest[]> {
    const observable = new Observable<WorkRequest[]>((observer) => {
      observer.next(this.workRequests);
      observer.complete();
    });
    return observable;
  }

  getWorkRequest(IDLIST: string): Observable<WorkRequest> {
    const observable = new Observable<WorkRequest>((observer) => {
      let wr = this.workRequests.find((wr) => wr.IDLIST === IDLIST);
      observer.next(wr);
      observer.complete();
    });
    return observable;
  }

  deleteWorkRequest(IDLIST: string): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.workRequests = this.workRequests.filter(
        (wr) => wr.IDLIST !== IDLIST
      );
      observer.next();
      observer.complete();
    });
    return observable;
  }

  hasMasterData(): Observable<boolean> {
    const observable = new Observable<boolean>((observer) => {
      let result =
        this.assetLocations.length > 0 ||
        this.classifications.length > 0 ||
        this.components.length > 0 ||
        this.componentsProblems.length > 0 ||
        this.problems.length > 0 ||
        this.personnel.length > 0;
      observer.next(result);
      observer.complete();
    });
    return observable;
  }
}
