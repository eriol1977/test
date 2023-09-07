import { Observable } from 'rxjs';

import {
  AssetLocation,
  Classification,
  ComponentAsset,
  ComponentProblem,
  Personnel,
  Problem,
  WorkRequest,
} from 'src/app/common/models';

export abstract class DataManager {
  abstract getAssetLocationList(): Observable<AssetLocation[]>;
  abstract setAssetLocationList(list: AssetLocation[]): Observable<void>;
  abstract getClassificationsList(): Observable<Classification[]>;
  abstract setClassificationsList(list: Classification[]): Observable<void>;
  abstract getComponentsList(): Observable<ComponentAsset[]>;
  abstract setComponentsList(list: ComponentAsset[]): Observable<void>;
  abstract getComponentProblemsList(): Observable<ComponentProblem[]>;
  abstract setComponentProblemsList(list: ComponentProblem[]): Observable<void>;
  abstract getProblemsList(): Observable<Problem[]>;
  abstract setProblemsList(list: Problem[]): Observable<void>;
  abstract getPersonnelList(): Observable<Personnel[]>;
  abstract setPersonnelList(list: Personnel[]): Observable<void>;
  abstract addWorkRequest(workRequest: WorkRequest): Observable<WorkRequest>;
  abstract updateWorkRequest(workRequest: WorkRequest): Observable<WorkRequest>;
  abstract getWorkRequests(): Observable<WorkRequest[]>;
  abstract hasMasterData(): Observable<boolean>;
}
