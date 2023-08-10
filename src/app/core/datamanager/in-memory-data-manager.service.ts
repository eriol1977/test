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
import { WorkRequestRestService } from '../services';

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

  constructor(private wrService: WorkRequestRestService) {}

  async synchronize(): Promise<any> {
    return new Promise((resolve) =>
      this.wrService.getAssetLocationList().subscribe((data) => {
        this.assetLocations = data;

        this.wrService.getClassificationsList().subscribe((data) => {
          this.classifications = data;

          this.wrService.getComponentsList().subscribe((data) => {
            this.components = data;

            this.wrService.getComponentProblemsList().subscribe((data) => {
              this.componentsProblems = data;

              this.wrService.getProblemsList().subscribe((data) => {
                this.problems = data;

                this.wrService.getPersonnelList().subscribe((data) => {
                  this.personnel = data;

                  resolve('OK');
                });
              });
            });
          });
        });
      })
    );
  }

  getAssetLocationList(): AssetLocation[] {
    return this.assetLocations;
  }

  getClassificationsList(): Classification[] {
    return this.classifications;
  }

  getComponentsList(): ComponentAsset[] {
    return this.components;
  }

  getComponentProblemsList(): ComponentProblem[] {
    return this.componentsProblems;
  }

  getProblemsList(): Problem[] {
    return this.problems;
  }

  getPersonnelList(): Personnel[] {
    return this.personnel;
  }

  addWorkRequest(workRequest: WorkRequest, callback: Function): void {
    this.wrService.addWorkRequest(workRequest).subscribe((data) => {
      callback(data);
    });
  }
}
