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
  abstract synchronize(): Promise<any>;
  abstract getAssetLocationList(): AssetLocation[];
  abstract getClassificationsList(): Classification[];
  abstract getComponentsList(): ComponentAsset[];
  abstract getComponentProblemsList(): ComponentProblem[];
  abstract getProblemsList(): Problem[];
  abstract getPersonnelList(): Personnel[];
  abstract addWorkRequest(workRequest: WorkRequest, callback: Function): any;
}
