import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentStatus,
  ExportType,
  FinancialStruct,
  REQRow,
  REQValidated,
} from '../common/models';
import {
  LoaderService,
  SearchListService,
  SyncServicePurchase,
  ToastService,
} from '../core';
import { Observable } from 'rxjs';
import { DataManager } from '../core/datamanager/data-manager';
import { environment } from 'src/environments/environment';
import { AESService } from '../core/services/aes.service';

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

  constructor(
    private loadingService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private dataManager: DataManager,
    private searchListService: SearchListService,
    private syncService: SyncServicePurchase,
    private toastService: ToastService,
    private aes: AESService
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
    this.dataManager.getREQHeader(this.reqId).subscribe((reqHeader) => {
      let req: REQValidated = {
        IDAPP: this.generateRandomString(15),
        IDDOC: reqHeader.IDDOC,
        CDUNIT: reqHeader.CDUNIT,
        NRDOC: reqHeader.NRDOC,
        DSDOC: reqHeader.DSDOC,
        FLSTATUS: statusCode,
        CREATIONUSER: environment.isUsingMCM
          ? environment.loggedUserCode
          : this.aes.encryptStr(
              `${environment.loggedUser}${this.aes.SEPARATOR}${environment.loggedPassword}`
            ),
        ROWS: [],
      };
      for (let row of this.rows) {
        req.ROWS.push({
          CPROWNUM: row.CPROWNUM,
          IDITEM: row.IDITEM,
          CDKEY: row.CDKEY,
          QTEXAM: row.QTITEM,
          CDUOM: row.CDUOM,
          CDCOST_CENTER: row.CDCOST_CENTER,
          CDACCOUNT: row.CDACCOUNT,
          NTPHASE: row.NTPHASE,
        });
      }
      this.syncService.export(ExportType.REQ, req).subscribe(() => {
        this.toastService.showSuccess('REQ exported');
        this.router.navigate(['/reqapproval']);
        this.dataManager.deleteREQ(req.IDDOC).subscribe(() => {
          this.loadingService.hide();
        });
      });
    });
  }

  private generateRandomString = (length: number) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

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
    this.setGoBackCostCenterId(IDFINSTRUCT);
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
        this.dataManager.getFinancialStructRecord(id).subscribe((cc) => {
          this.selectedRow.CDCOST_CENTER = cc.CDCOST_CENTER;
          this.selectedRow.CDACCOUNT = '';
        });
      } else {
        // otherwise, the next "treeview" level is opened, to show the cost center's children
        this.onNavigationCostCenterSelected(id || '');
      }
    } else {
      // go back to previous path step
      this.onNavigationCostCenterSelected(this.goBackCostCenterId);
    }
  }

  onCostCenterCleared(): void {
    this.selectedRow.CDCOST_CENTER = '';
    this.selectedRow.CDACCOUNT = '';
  }

  // stores the code of the "grandpa" cost center to go back to
  // when executing a Back operation from the treeview path
  private goBackCostCenterId: string = '';
  private selectedRow: REQRow = this.rows[0];

  private setGoBackCostCenterId(id: string): void {
    if (id === '') this.goBackCostCenterId == '';
    else
      this.dataManager.getFinancialStructRecord(id).subscribe((rec) => {
        this.goBackCostCenterId = rec.PARENTCODE || '';
      });
  }

  // selection from "treeview" button (search lists for different levels)
  selectAccountForRow(CDACCOUNT: string, row: REQRow): void {
    this.selectedRow = row;
    if (CDACCOUNT === '') {
      // starts navigation from the cost center root
      let IDFINSTRUCT_COST_CENTER =
        this.financialStructure.find(
          (fs) => fs.FLTYPE === 'C' && fs.CDCOST_CENTER === row.CDCOST_CENTER
        )?.IDFINSTRUCT || '';
      this.onNavigationAccountSelected(IDFINSTRUCT_COST_CENTER);
    } else {
      // starts navigation from the parent of the currently selected account
      let IDFINSTRUCT =
        this.financialStructure.find(
          (fs) =>
            fs.FLTYPE === 'A' &&
            fs.CDCOST_CENTER === row.CDCOST_CENTER &&
            fs.CDACCOUNT === CDACCOUNT
        )?.PARENTCODE || '';
      this.onNavigationAccountSelected(IDFINSTRUCT);
    }
  }

  // selection of tree node inside a search list
  onNavigationAccountSelected(IDFINSTRUCT: string): void {
    // stores the code of the current parent node for the 'Back' operation
    this.setGoBackAccountId(IDFINSTRUCT);
    this.dataManager.getAccounts(IDFINSTRUCT).subscribe((list) => {
      // creates list elements from children accounts
      let options = list.map((cc) => {
        return {
          value: cc.IDFINSTRUCT || '',
          label: cc.CDACCOUNT || '',
          color: cc.FLNAVIGATION === 'N' ? 'secondary' : '',
        };
      });
      this.dataManager
        .getFinancialStructRecord(IDFINSTRUCT)
        .subscribe((rec) => {
          // the "go back" path must be displayed only if the parent node is not a cost center
          // (which works as a "root" node when choosing an account)
          if (rec.FLTYPE === 'A') {
            // before proceeding, fills in the descriptive path for the presently selected account
            this.dataManager
              .getFinancialStructRecordDescriptivePath(IDFINSTRUCT)
              .subscribe((path) => {
                this.searchListService.openSearchList(
                  'Accounts',
                  options,
                  this.onAccountSelectedFromTreeview.bind(this),
                  this.onAccountCleared.bind(this),
                  path
                );
              });
          } else {
            this.searchListService.openSearchList(
              'Accounts',
              options,
              this.onAccountSelectedFromTreeview.bind(this),
              this.onAccountCleared.bind(this),
              ''
            );
          }
        });
    });
  }

  // account was selected from "treeview" search list
  onAccountSelectedFromTreeview(id: string): void {
    if (id) {
      let account = this.financialStructure.find(
        (rec) => rec.IDFINSTRUCT === id
      );
      if (account?.FLNAVIGATION === 'N') {
        // if a "real" account has been selected, the process ends
        this.dataManager
          .getFinancialStructRecord(id)
          .subscribe((acc) => (this.selectedRow.CDACCOUNT = acc.CDACCOUNT));
      } else {
        // otherwise, the next "treeview" level is opened, to show the account's children
        this.onNavigationAccountSelected(id || '');
      }
    } else {
      // go back to previous path step
      this.onNavigationAccountSelected(this.goBackAccountId);
    }
  }

  onAccountCleared(): void {
    this.selectedRow.CDACCOUNT = '';
  }

  // stores the code of the "grandpa" account to go back to
  // when executing a Back operation from the treeview path
  private goBackAccountId: string = '';

  private setGoBackAccountId(id: string): void {
    if (id === '') this.goBackAccountId == '';
    else
      this.dataManager.getFinancialStructRecord(id).subscribe((rec) => {
        this.goBackAccountId = rec.PARENTCODE || '';
      });
  }

  goBack(): void {
    this.router.navigate(['/reqapproval']);
  }
}
