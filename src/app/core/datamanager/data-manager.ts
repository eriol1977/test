import { Observable } from 'rxjs';

import {
  AssetLocation,
  Classification,
  ComponentAsset,
  ComponentProblem,
  FinancialStruct,
  Personnel,
  Problem,
  REQHeader,
  REQRow,
  WorkRequest,
} from 'src/app/common/models';

export abstract class DataManager {
  abstract getAssetLocationList(): Observable<AssetLocation[]>;
  abstract getAssetLocation(ASLOCODE: string): Observable<AssetLocation>;
  abstract getChildrenAssetLocations(
    ASLOIDPARENT: string
  ): Observable<AssetLocation[]>;
  abstract getAssetLocationDescriptivePath(
    ASLOCODE: string
  ): Observable<string>;
  abstract setAssetLocationList(list: AssetLocation[]): Observable<void>;
  abstract getClassificationsList(): Observable<Classification[]>;
  abstract getClassification(CLASCODE: string): Observable<Classification>;
  abstract setClassificationsList(list: Classification[]): Observable<void>;
  abstract getComponentsList(): Observable<ComponentAsset[]>;
  abstract getComponent(
    COGRCDCOMP: string,
    COGRCDCLASS: string
  ): Observable<ComponentAsset>;
  abstract setComponentsList(list: ComponentAsset[]): Observable<void>;
  abstract getComponentProblemsList(): Observable<ComponentProblem[]>;
  abstract getComponentProblem(
    PRCOCDCOMP: string,
    PRCOCDCLASS: string,
    PRCOCDPROBLEM: string
  ): Observable<ComponentProblem>;
  abstract setComponentProblemsList(list: ComponentProblem[]): Observable<void>;
  abstract getProblemsList(): Observable<Problem[]>;
  abstract getProblem(PROBCODE: string): Observable<Problem>;
  abstract setProblemsList(list: Problem[]): Observable<void>;
  abstract getPersonnelList(): Observable<Personnel[]>;
  abstract getPersonnel(PERSONID: string): Observable<Personnel>;
  abstract setPersonnelList(list: Personnel[]): Observable<void>;
  abstract addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest>;
  abstract updateWorkRequest(workRequest: WorkRequest): Observable<WorkRequest>;
  abstract getWorkRequests(): Observable<WorkRequest[]>;
  abstract getWorkRequest(IDLIST: string): Observable<WorkRequest>;
  abstract deleteWorkRequest(IDLIST: string): Observable<void>;
  abstract hasMasterData(): Observable<boolean>;
  abstract getREQHeadersList(): Observable<REQHeader[]>;
  abstract getREQHeader(IDDOC: string): Observable<REQHeader>;
  abstract setREQHeadersList(list: REQHeader[]): Observable<void>;
  abstract getREQRowsList(): Observable<REQRow[]>;
  abstract setREQRowsList(list: REQRow[]): Observable<void>;
  abstract deleteREQ(IDDOC: string): Observable<void>;
  abstract getCostCenters(PARENTCODE: string): Observable<FinancialStruct[]>;
  abstract getAccounts(PARENTCODE: string): Observable<FinancialStruct[]>;
  abstract getFinancialStructRecord(
    IDFINSTRUCT: string
  ): Observable<FinancialStruct>;
  abstract getFinancialStructRecordDescriptivePath(
    IDFINSTRUCT: string
  ): Observable<string>;
  abstract getFinancialStructList(): Observable<FinancialStruct[]>;
  abstract setFinancialStruct(list: FinancialStruct[]): Observable<void>;
}
