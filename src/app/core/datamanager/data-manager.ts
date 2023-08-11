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
  abstract getAssetLocationList(): Promise<AssetLocation[]>;
  abstract setAssetLocationList(list: AssetLocation[]): Promise<void>;
  abstract getClassificationsList(): Promise<Classification[]>;
  abstract setClassificationsList(list: Classification[]): Promise<void>;
  abstract getComponentsList(): Promise<ComponentAsset[]>;
  abstract setComponentsList(list: ComponentAsset[]): Promise<void>;
  abstract getComponentProblemsList(): Promise<ComponentProblem[]>;
  abstract setComponentProblemsList(list: ComponentProblem[]): Promise<void>;
  abstract getProblemsList(): Promise<Problem[]>;
  abstract setProblemsList(list: Problem[]): Promise<void>;
  abstract getPersonnelList(): Promise<Personnel[]>;
  abstract setPersonnelList(list: Personnel[]): Promise<void>;
  abstract addWorkRequest(
    workRequest: WorkRequest,
    callback: Function
  ): Promise<void>;
  abstract getWorkRequests(): Promise<WorkRequest[]>;
}
