import { Component, OnInit } from '@angular/core';
import { SelectOption, TABLES } from '../common/models';
import { DataManager } from 'src/app/core/datamanager/data-manager';
import { LoaderService } from '../core';

@Component({
  selector: 'app-dbtester',
  templateUrl: './dbtester.page.html',
  styleUrls: ['./dbtester.page.scss'],
})
export class DBTesterPage implements OnInit {
  operations: SelectOption[] = [
    { value: 'S', label: 'SELECT' },
    { value: 'D', label: 'DELETE' },
  ];
  operation: string = 'S';
  count: boolean = false;
  tables: SelectOption[] = TABLES;
  table: string = 'assetLocation';
  recordId: string = '';
  recordId2: string = '';
  recordId3: string = '';
  result: string = '';

  constructor(
    private dataManager: DataManager,
    private loadingService: LoaderService
  ) {}

  ngOnInit() {}

  execute(): void {
    this.loadingService
      .show({
        message: 'Executing...',
      })
      .then(() => {
        switch (this.operation) {
          case 'S':
            this.select();
            break;
          case 'D':
            this.delete();
            break;
        }
      });
  }

  private select(): void {
    switch (this.table) {
      case 'assetLocation':
        if (this.recordId === '') {
          this.dataManager.getAssetLocationList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager.getAssetLocation(this.recordId).subscribe((item) => {
            if (item === null) this.displayResult('No record found');
            else this.listResult([item]);
          });
        }
        break;
      case 'classification':
        if (this.recordId === '') {
          this.dataManager.getClassificationsList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager
            .getClassification(this.recordId)
            .subscribe((item) => {
              if (item === null) this.displayResult('No record found');
              else this.listResult([item]);
            });
        }
        break;
      case 'component':
        if (
          (this.recordId === '' && this.recordId2 !== '') ||
          (this.recordId !== '' && this.recordId2 === '')
        ) {
          this.displayResult('Both IDs must be filled in');
        } else if (this.recordId === '' && this.recordId2 === '') {
          this.dataManager.getComponentsList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager
            .getComponent(this.recordId, this.recordId2)
            .subscribe((item) => {
              if (item === null) this.displayResult('No record found');
              else this.listResult([item]);
            });
        }
        break;
      case 'componentProblem':
        if (
          (this.recordId === '' ||
            this.recordId2 === '' ||
            this.recordId3 === '') &&
          (this.recordId !== '' ||
            this.recordId2 !== '' ||
            this.recordId3 !== '')
        ) {
          this.displayResult('All IDs must be filled in');
        } else if (
          this.recordId === '' &&
          this.recordId2 === '' &&
          this.recordId3 === ''
        ) {
          this.dataManager.getComponentProblemsList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager
            .getComponentProblem(this.recordId, this.recordId2, this.recordId3)
            .subscribe((item) => {
              if (item === null) this.displayResult('No record found');
              else this.listResult([item]);
            });
        }
        break;
      case 'problem':
        if (this.recordId === '') {
          this.dataManager.getProblemsList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager.getProblem(this.recordId).subscribe((item) => {
            if (item === null) this.displayResult('No record found');
            else this.listResult([item]);
          });
        }
        break;
      case 'personnel':
        if (this.recordId === '') {
          this.dataManager.getPersonnelList().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager.getPersonnel(this.recordId).subscribe((item) => {
            if (item === null) this.displayResult('No record found');
            else this.listResult([item]);
          });
        }
        break;
      case 'workRequest':
        if (this.recordId === '') {
          this.dataManager.getWorkRequests().subscribe((list) => {
            this.listResult(list);
          });
        } else {
          this.dataManager.getWorkRequest(this.recordId).subscribe((item) => {
            if (item === null) this.displayResult('No record found');
            else this.listResult([item]);
          });
        }
        break;
      default:
        this.displayResult('Operation not yet implemented!');
    }
  }

  delete(): void {
    switch (this.table) {
      case 'workRequest':
        if (this.recordId === '') {
          this.displayResult('Record ID is mandatory');
        } else {
          this.dataManager.getWorkRequest(this.recordId).subscribe((item) => {
            if (item === null) this.displayResult('No record found');
            else {
              this.dataManager
                .deleteWorkRequest(this.recordId)
                .subscribe(() => {
                  this.displayResult('Record deleted');
                });
            }
          });
        }
        break;
      default:
        this.displayResult('Operation not yet implemented!');
    }
  }

  clear(): void {
    this.result = '';
    this.count = false;
    this.recordId = '';
    this.recordId2 = '';
    this.recordId3 = '';
  }

  private listResult(list: any[]): void {
    let textResult = '';
    if (!this.recordId) {
      textResult = 'Counted records: ' + list.length + '\n\n';
    }
    if (!this.count || this.recordId) {
      textResult += JSON.stringify(list, null, 2);
    }
    this.displayResult(textResult);
  }

  private displayResult(textResult: string): void {
    this.result = textResult;
    console.log(textResult);
    this.loadingService.hide();
  }
}
