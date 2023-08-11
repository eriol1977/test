import { Injectable } from '@angular/core';
import { DataManager } from './data-manager';
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

  async getAssetLocationList(): Promise<AssetLocation[]> {
    return this.assetLocations;
  }

  async setAssetLocationList(list: AssetLocation[]): Promise<void> {
    this.assetLocations = list;
  }

  async getClassificationsList(): Promise<Classification[]> {
    return this.classifications;
  }

  async setClassificationsList(list: Classification[]): Promise<void> {
    this.classifications = list;
  }

  async getComponentsList(): Promise<ComponentAsset[]> {
    return this.components;
  }

  async setComponentsList(list: ComponentAsset[]): Promise<void> {
    this.components = list;
  }

  async getComponentProblemsList(): Promise<ComponentProblem[]> {
    return this.componentsProblems;
  }

  async setComponentProblemsList(list: ComponentProblem[]): Promise<void> {
    this.componentsProblems = list;
  }

  async getProblemsList(): Promise<Problem[]> {
    return this.problems;
  }

  async setProblemsList(list: Problem[]): Promise<void> {
    this.problems = list;
  }

  async getPersonnelList(): Promise<Personnel[]> {
    return this.personnel;
  }

  async setPersonnelList(list: Personnel[]): Promise<void> {
    this.personnel = list;
  }

  async addWorkRequest(
    workRequest: WorkRequest,
    callback: Function
  ): Promise<void> {
    this.workRequests.push(workRequest);
    callback(workRequest);
  }

  async getWorkRequests(): Promise<WorkRequest[]> {
    return this.workRequests;
  }
}
