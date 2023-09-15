import { Injectable } from '@angular/core';
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
export class DataCache {
  assetLocations: AssetLocation[] = [];
  classifications: Classification[] = [];
  components: ComponentAsset[] = [];
  componentsProblems: ComponentProblem[] = [];
  problems: Problem[] = [];
  personnel: Personnel[] = [];
  workRequests: WorkRequest[] = [];

  constructor() {}

  getAssetLocationList(): AssetLocation[] {
    return this.assetLocations;
  }

  getAssetLocation(ASLOCODE: string): AssetLocation | undefined {
    return this.assetLocations.find((l) => l.ASLOCODE === ASLOCODE);
  }

  getChildrenAssetLocations(ASLOIDPARENT: string): AssetLocation[] {
    return this.assetLocations.filter(
      (loc) => loc.ASLOIDPARENT === ASLOIDPARENT
    );
  }

  setAssetLocationList(list: AssetLocation[]): void {
    this.assetLocations = list;
  }

  getClassificationsList(): Classification[] {
    return this.classifications;
  }

  getClassification(CLASCODE: string): Classification | undefined {
    return this.classifications.find((c) => c.CLASCODE === CLASCODE);
  }

  setClassificationsList(list: Classification[]): void {
    this.classifications = list;
  }

  getComponentsList(): ComponentAsset[] {
    return this.components;
  }

  getComponent(
    COGRCDCOMP: string,
    COGRCDCLASS: string
  ): ComponentAsset | undefined {
    return this.components.find(
      (c) => c.COGRCDCOMP === COGRCDCOMP && c.COGRCDCLASS === COGRCDCLASS
    );
  }

  setComponentsList(list: ComponentAsset[]): void {
    this.components = list;
  }

  getComponentProblemsList(): ComponentProblem[] {
    return this.componentsProblems;
  }

  getComponentProblem(
    PRCOCDCOMP: string,
    PRCOCDCLASS: string,
    PRCOCDPROBLEM: string
  ): ComponentProblem | undefined {
    return this.componentsProblems.find(
      (c) =>
        c.PRCOCDCOMP === PRCOCDCOMP &&
        c.PRCOCDCLASS === PRCOCDCLASS &&
        c.PRCOCDPROBLEM === PRCOCDPROBLEM
    );
  }

  setComponentProblemsList(list: ComponentProblem[]): void {
    this.componentsProblems = list;
  }

  getProblemsList(): Problem[] {
    return this.problems;
  }

  getProblem(PROBCODE: string): Problem | undefined {
    return this.problems.find((p) => p.PROBCODE === PROBCODE);
  }

  setProblemsList(list: Problem[]): void {
    this.problems = list;
  }

  getPersonnelList(): Personnel[] {
    return this.personnel;
  }

  getPersonnel(PERSONID: string): Personnel | undefined {
    return this.personnel.find((p) => p.PERSONID === PERSONID);
  }

  setPersonnelList(list: Personnel[]): void {
    this.personnel = list;
  }

  addWorkRequest(workRequest: WorkRequest): void {
    this.workRequests.push(workRequest);
  }

  updateWorkRequest(workRequest: WorkRequest): void {
    // removes the original WR and re-adds it, with its updated fields
    this.workRequests = this.workRequests.filter(
      (wr) => wr.IDLIST !== workRequest.IDLIST
    );
    this.workRequests.push(workRequest);
  }

  getWorkRequests(): WorkRequest[] {
    return this.workRequests;
  }

  getWorkRequest(IDLIST: string): WorkRequest | undefined {
    return this.workRequests.find((wr) => wr.IDLIST === IDLIST);
  }

  deleteWorkRequest(IDLIST: string): void {
    this.workRequests = this.workRequests.filter((wr) => wr.IDLIST !== IDLIST);
  }

  setWorkRequests(list: WorkRequest[]): void {
    this.workRequests = list;
  }
}
