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
  REQHeader,
  REQRow,
  FinancialStruct,
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
  REQHeaders: REQHeader[] = [];
  REQRows: REQRow[] = [];
  financialStruct: FinancialStruct[] = [];
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

  getChildrenAssetLocations(ASLOIDPARENT: string): Observable<AssetLocation[]> {
    const observable = new Observable<AssetLocation[]>((observer) => {
      observer.next(
        this.assetLocations.filter((loc) => loc.ASLOIDPARENT === ASLOIDPARENT)
      );
      observer.complete();
    });
    return observable;
  }

  getAssetLocationDescriptivePath(ASLOCODE: string): Observable<string> {
    const observable = new Observable<string>((observer) => {
      let loc = this.assetLocations.find((l) => l.ASLOCODE === ASLOCODE);
      let path = '';
      if (loc) {
        path = loc.ASLOIDPATH || '';
        let ids = path.replace('//', '').split('/');
        ids.pop(); // removes empty id at the end
        ids.forEach((id) => {
          let otherLoc = this.assetLocations.find((l) => l.ASLOCODE === id);
          let descr = otherLoc?.ASLODESCR || '';
          path = path.replace(id, descr);
        });
      }
      observer.next(path);
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

  getREQHeadersList(): Observable<REQHeader[]> {
    const observable = new Observable<REQHeader[]>((observer) => {
      observer.next(this.REQHeaders);
      observer.complete();
    });
    return observable;
  }

  getREQHeader(IDDOC: string): Observable<REQHeader> {
    const observable = new Observable<REQHeader>((observer) => {
      let reqH = this.REQHeaders.find((h) => h.IDDOC === IDDOC);
      observer.next(reqH);
      observer.complete();
    });
    return observable;
  }

  setREQHeadersList(list: REQHeader[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.REQHeaders = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getREQRowsList(): Observable<REQRow[]> {
    const observable = new Observable<REQRow[]>((observer) => {
      observer.next(this.REQRows);
      observer.complete();
    });
    return observable;
  }

  setREQRowsList(list: REQRow[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.REQRows = list;
      observer.next();
      observer.complete();
    });
    return observable;
  }

  deleteREQ(IDDOC: string): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.REQHeaders = this.REQHeaders.filter(
        (reqHeader) => reqHeader.IDDOC !== IDDOC
      );
      this.REQRows = this.REQRows.filter((reqRow) => reqRow.IDDOC !== IDDOC);
      observer.next();
      observer.complete();
    });
    return observable;
  }

  getCostCenters(PARENTCODE: string): Observable<FinancialStruct[]> {
    const observable = new Observable<FinancialStruct[]>((observer) => {
      let costCenters = this.financialStruct.filter(
        (fs) =>
          fs.FLTYPE === 'C' && fs.FLCANC !== 'Y' && fs.PARENTCODE === PARENTCODE
      );
      observer.next(costCenters);
      observer.complete();
    });
    return observable;
  }

  getAccounts(PARENTCODE: string): Observable<FinancialStruct[]> {
    const observable = new Observable<FinancialStruct[]>((observer) => {
      let accounts = this.financialStruct.filter(
        (fs) =>
          fs.FLTYPE === 'A' && fs.FLCANC !== 'Y' && fs.PARENTCODE === PARENTCODE
      );
      observer.next(accounts);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructRecord(IDFINSTRUCT: string): Observable<FinancialStruct> {
    const observable = new Observable<FinancialStruct>((observer) => {
      let record = this.financialStruct.find(
        (r) => r.IDFINSTRUCT === IDFINSTRUCT
      );
      observer.next(record);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructRecordDescriptivePath(
    IDFINSTRUCT: string
  ): Observable<string> {
    const observable = new Observable<string>((observer) => {
      let rec = this.financialStruct.find(
        (fs) => fs.IDFINSTRUCT === IDFINSTRUCT
      );
      let path = '';
      if (rec) {
        path = rec.PATHCODE || '';
        let codes = path.replace('//', '').split('/');
        codes.pop(); // removes empty id at the end
        codes.forEach((code) => {
          let otherRec = this.financialStruct.find((r) =>
            r.FLTYPE === 'C' ? r.CDCOST_CENTER === code : r.CDACCOUNT === code
          );
          let descr =
            otherRec?.FLTYPE === 'C'
              ? otherRec?.DSCOST_CENTER || ''
              : otherRec?.DSACCOUNT || '';
          path = path.replace(code, descr);
        });
      }
      observer.next(path);
      observer.complete();
    });
    return observable;
  }

  getFinancialStructList(): Observable<FinancialStruct[]> {
    const observable = new Observable<FinancialStruct[]>((observer) => {
      observer.next(this.financialStruct);
      observer.complete();
    });
    return observable;
  }

  setFinancialStruct(list: FinancialStruct[]): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.financialStruct = list;
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
        this.personnel.length > 0 ||
        this.REQHeaders.length > 0 ||
        this.REQRows.length > 0;
      observer.next(result);
      observer.complete();
    });
    return observable;
  }
}
