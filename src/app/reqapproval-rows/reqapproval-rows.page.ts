import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentStatus, FinancialStruct, REQRow } from '../common/models';
import { LoaderService, SearchListService } from '../core';
import { Observable } from 'rxjs';
import { DataManager } from '../core/datamanager/data-manager';

@Component({
  selector: 'app-reqapproval-rows',
  templateUrl: './reqapproval-rows.page.html',
  styleUrls: ['./reqapproval-rows.page.scss'],
})
export class REQApprovalRowsPage implements OnInit {
  reqId: string = '';
  loading: boolean = false;
  rows: REQRow[] = [];
  statusList: DocumentStatus[] = [];
  financialStructure: FinancialStruct[] = [];
  // costCenterIdMap: Map<string, string> = new Map<string, string>();
  // costCenterMap: Map<string, FinancialStruct> = new Map<
  //   string,
  //   FinancialStruct
  // >();

  constructor(
    private loadingService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private dataManager: DataManager,
    private searchListService: SearchListService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.reqId = params['id'];
      this.loading = true;
      this.startLoading();
    });
  }

  private startLoading(): void {
    this.loadingService
      .show({
        message: 'Loading...',
      })
      .then(() => {
        // waits for the loading message component to be ready, before proceeding

        this.initData().subscribe(() => {
          this.loadingService.hide();
        });
      });
  }

  private initData(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      this.rows = [];
      this.dataManager.getREQRowsList().subscribe((list) => {
        this.rows = list.filter((r) => r.IDDOC === this.reqId);

        // gets possible statuses
        this.statusList = [];
        this.dataManager.getREQHeader(this.reqId).subscribe((req) => {
          let nextStatuses: string[] = req.NEXTSTATUSES.split(';');
          for (let nextStatus of nextStatuses) {
            if (nextStatus.trim() !== '') {
              let parts: string[] = nextStatus.split('#');
              this.statusList.push({
                code: parts[0],
                description: parts[1],
                isCancelled: parts[2] === 'N' ? false : true,
              });
            }
          }

          // gets financial structure
          this.dataManager.getFinancialStructList().subscribe((list) => {
            this.financialStructure = list;
            observer.next();
            observer.complete();
          });
        });
      });
    });
    return observable;
  }

  changeStatus(statusCode: string) {
    alert(`Change status to ${statusCode}`);
  }

  // selection from "treeview" button (search lists for different levels)
  selectCostCenterForRow(CDCOST_CENTER: string, row: REQRow): void {
    this.selectedRow = row;
    if (CDCOST_CENTER === '') {
      // starts navigation from the root
      this.onNavigationCostCenterSelected('');
    } else {
      // starts navigation from the parent of the currently selected cost center
      let IDFINSTRUCT =
        this.financialStructure.find(
          (fs) => fs.FLTYPE === 'C' && fs.CDCOST_CENTER === CDCOST_CENTER
        )?.PARENTCODE || '';
      this.onNavigationCostCenterSelected(IDFINSTRUCT);
    }
  }

  // selection of tree node inside a search list
  onNavigationCostCenterSelected(IDFINSTRUCT: string): void {
    // stores the code of the current parent node for the 'Back' operation
    this.setGoBackCostCenterCode(IDFINSTRUCT);
    this.dataManager.getCostCenters(IDFINSTRUCT).subscribe((list) => {
      // creates list elements from children cost centers
      let options = list.map((cc) => {
        return {
          value: cc.IDFINSTRUCT || '',
          label: cc.CDCOST_CENTER || '',
          color: cc.FLNAVIGATION === 'N' ? 'secondary' : '',
        };
      });
      // before proceeding, fills in the descriptive path for the presently selected cost center
      this.dataManager
        .getFinancialStructRecordDescriptivePath(IDFINSTRUCT)
        .subscribe((path) => {
          this.searchListService.openSearchList(
            'Cost Centers',
            options,
            this.onCostCenterSelectedFromTreeview.bind(this),
            this.onCostCenterCleared.bind(this),
            path
          );
        });
    });
  }

  // cost center was selected from "treeview" search list
  onCostCenterSelectedFromTreeview(id: string): void {
    if (id) {
      let costCenter = this.financialStructure.find(
        (rec) => rec.IDFINSTRUCT === id
      );
      if (costCenter?.FLNAVIGATION === 'N') {
        // if a "real" cost center has been selected, the process ends
        this.dataManager
          .getFinancialStructRecord(id)
          .subscribe(
            (cc) => (this.selectedRow.CDCOST_CENTER = cc.CDCOST_CENTER)
          );
      } else {
        // otherwise, the next "treeview" level is opened, to show the location's children
        this.onNavigationCostCenterSelected(id || '');
      }
    } else {
      // go back to previous path step
      this.onNavigationCostCenterSelected(this.goBackCostCenterCode);
    }
  }

  onCostCenterCleared(): void {
    this.selectedRow.CDCOST_CENTER = '';
  }

  // stores the code of the "grandpa" cost center to go back to
  // when executing a Back operation from the treeview path
  private goBackCostCenterCode: string = '';
  private selectedRow: REQRow = this.rows[0];

  private setGoBackCostCenterCode(costCenterCode: string): void {
    if (costCenterCode === '') this.goBackCostCenterCode == '';
    else
      this.dataManager
        .getFinancialStructRecord(costCenterCode)
        .subscribe((rec) => {
          this.goBackCostCenterCode = rec.PARENTCODE || '';
        });
  }

  goBack(): void {
    this.router.navigate(['/reqapproval']);
  }
}
