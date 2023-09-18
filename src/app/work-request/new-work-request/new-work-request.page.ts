import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  Personnel,
  ComponentProblem,
  SelectOption,
  Status,
  STATUSES,
  TIMEZONES,
  WorkRequest,
  Problem,
  SyncStatus,
  YES_NO,
} from '../../common/models';
import { ToastService } from '../../core/services/toast.service';
import { LoaderService } from '../../core/services/loader.service';
import { SearchListService } from '../../core/services/search-list.service';
import { AlertController } from '@ionic/angular';
import { SyncService } from 'src/app/core';
import { DataManager } from 'src/app/core/datamanager/data-manager';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'new-work-request',
  templateUrl: './new-work-request.page.html',
  styleUrls: ['./new-work-request.page.scss'],
})
export class NewWorkRequestPage implements OnInit {
  // ---------------------- PROPERTIES ---------------------------------

  wrDate: string = moment().format('YYYY-MM-DD HH:mm');
  get wrDateModal(): string {
    return moment(this.wrDate, 'YYYY-MM-DD HH:mm').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
  }
  set wrDateModal(data: string) {
    this.wrDate = moment(data, 'YYYY-MM-DDTHH:mm:ss').format(
      'YYYY-MM-DD HH:mm'
    );
  }

  wrTimezone: string = `${moment().utcOffset()}`;
  timezones: SelectOption[] = TIMEZONES;

  wrStatus: string = Status.DRAFT;
  statuses: SelectOption[] = STATUSES;

  wrAssetLocationCode: string = '';
  wrAssetLocation: AssetLocation = {};
  allAssetLocations: AssetLocation[] = [];
  assetLocationOptions: SelectOption[] = [];

  allClassifications: Classification[] = [];

  wrComponentCode: string = '';
  wrComponent: ComponentAsset = {};
  allComponents: ComponentAsset[] = [];
  componentsOptions: SelectOption[] = [];
  componentComboEnabled: boolean = false;

  wrProblemCode: string = '';
  wrProblem: Problem = {};
  allComponentProblems: ComponentProblem[] = [];
  assetLocationComponentProblems: ComponentProblem[] = [];
  allProblems: Problem[] = [];
  componentProblems: Problem[] = [];
  problemsOptions: SelectOption[] = [];
  problemsComboEnabled: boolean = false;

  wrReportedByCode: string = '';
  wrReportedBy: Personnel = {};
  allPersonnel: Personnel[] = [];
  reportedByOptions: SelectOption[] = [];

  wrDescription: string = '';
  wrNotes: string = '';

  wrIsRepGuest: string = 'N';
  repGuestOpts: SelectOption[] = YES_NO;

  wrToEditId?: string;
  wrToEdit?: WorkRequest;

  wrDisabled: boolean = false;

  constructor(
    private loadingService: LoaderService,
    private toastService: ToastService,
    private searchListService: SearchListService,
    private alertController: AlertController,
    private syncService: SyncService,
    private dataManager: DataManager,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // waits for the loading message component to be ready, before proceeding
    this.loadingService
      .show({
        message: 'Loading...',
      })
      .then(() => {
        this.initData().subscribe(() => {
          this.loadingService.hide();
        });

        this.route.params.subscribe((params) => {
          this.wrToEditId = params['id'];
          if (this.wrToEditId) {
            this.dataManager.getWorkRequest(this.wrToEditId).subscribe((wr) => {
              this.wrToEdit = wr;
              this.initForm();
            });
          }
        });
      });
  }

  // ---------------------- GLOBAL STUFF ---------------------------------

  private initData(): Observable<void> {
    const observable = new Observable<void>((observer) => {
      // executes all the async data retrieving before proceeding
      const inits: Observable<any>[] = [];
      inits.push(this.dataManager.getAssetLocationList());
      inits.push(this.dataManager.getClassificationsList());
      inits.push(this.dataManager.getComponentsList());
      inits.push(this.dataManager.getComponentProblemsList());
      inits.push(this.dataManager.getProblemsList());
      inits.push(this.dataManager.getPersonnelList());
      forkJoin(inits).subscribe(
        ([
          assetLocationData,
          classificationData,
          componentsData,
          compProblemsData,
          problemsData,
          personnelData,
        ]) => {
          this.allAssetLocations = assetLocationData;
          // only maintenance asset locations are selectable in the main combo
          this.assetLocationOptions = this.allAssetLocations
            .filter((loc: AssetLocation) => loc.ASLOISMAINT === 'Y')
            .map((loc) => {
              return { value: loc.ASLOCODE || '', label: loc.ASLODESCR || '' };
            });
          this.allClassifications = classificationData;
          this.allComponents = componentsData;
          this.allComponentProblems = compProblemsData;
          this.allProblems = problemsData;
          this.allPersonnel = personnelData;
          this.reportedByOptions = this.allPersonnel.map((pers) => {
            return { value: pers.PERSONID || '', label: pers.PERSONNAME || '' };
          });
          observer.next();
          observer.complete();
        }
      );
    });
    return observable;
  }

  private clearForm() {
    this.wrDate = moment().format('YYYY-MM-DD HH:mm');
    this.wrTimezone = `${moment().utcOffset()}`;
    this.wrStatus = Status.DRAFT;
    this.wrAssetLocationCode = '';
    this.wrAssetLocation = {};
    this.wrComponentCode = '';
    this.wrComponent = {};
    this.componentsOptions = [];
    this.componentComboEnabled = false;
    this.wrProblemCode = '';
    this.wrProblem = {};
    this.assetLocationComponentProblems = [];
    this.componentProblems = [];
    this.problemsOptions = [];
    this.problemsComboEnabled = false;
    this.wrReportedByCode = '';
    this.wrReportedBy = {};
    this.wrDescription = '';
    this.wrNotes = '';
    this.wrIsRepGuest = 'N';
    this.wrToEditId = '';
    this.wrToEdit = undefined;
  }

  private initForm() {
    this.wrDate = moment(
      this.wrToEdit?.WOREDATETIME,
      'YYYY-MM-DD HH:mm:ss 000'
    ).format('YYYY-MM-DD HH:mm');
    this.wrTimezone = this.wrToEdit?.WOREOFFSET || '';
    this.wrStatus = this.wrToEdit?.WORESTATCODE || '';
    this.wrAssetLocationCode = this.wrToEdit?.WOREASLOCODE || '';
    this.onAssetLocationSelected(this.wrAssetLocationCode);
    this.wrComponentCode = this.wrToEdit?.WORECOGRCODE || '';
    this.onComponentSelected(this.wrComponentCode);
    this.wrProblemCode = this.wrToEdit?.WOREPROBCODE || '';
    this.onProblemSelected(this.wrProblemCode);
    this.wrReportedByCode = this.wrToEdit?.WOREPERSREPO || '';
    this.onReportedBySelected(this.wrReportedByCode);
    this.wrDescription = this.wrToEdit?.WOREDESCR || '';
    this.wrNotes = this.wrToEdit?.WORENOTE || '';
    this.wrIsRepGuest = this.wrToEdit?.WOREISREPGUEST || '';

    // the WR cannot be modified, if already sent to MCM
    if (this.wrToEdit?.SYNC === SyncStatus.EXPORTED) {
      this.wrDisabled = true;
    }
  }

  // ---------------------- ASSET LOCATIONS ---------------------------------

  // selection from main combo
  selectAssetLocation(): void {
    if (!this.wrDisabled) {
      this.searchListService.openSearchList(
        'Asset Locations',
        this.assetLocationOptions,
        this.onAssetLocationSelected.bind(this),
        this.onAssetLocationSelected.bind(this)
      );
    }
  }

  // selection from "treeview" (combos for different levels)
  selectAssetLocationTreeview(ASLOIDPARENT: string): void {
    if (!this.wrDisabled) {
      // stores the code of the location for the 'Back' operation,
      // which should be the parent of the informed parent location
      this.setGoBackLocationCode(ASLOIDPARENT);
      this.dataManager
        .getChildrenAssetLocations(ASLOIDPARENT)
        .subscribe((list) => {
          // creates list elements from children asset locations
          let options = list.map((loc) => {
            return {
              value: loc.ASLOCODE || '',
              label: loc.ASLODESCR || '',
              color: loc.ASLOISMAINT === 'Y' ? 'secondary' : '',
            };
          });
          // before proceeding, fills in the descriptive path for the presently selected asset location
          this.dataManager
            .getAssetLocationDescriptivePath(ASLOIDPARENT)
            .subscribe((path) => {
              this.searchListService.openSearchList(
                'Asset Locations',
                options,
                this.onAssetLocationSelectedFromTreeview.bind(this),
                this.onAssetLocationSelected.bind(this),
                path
              );
            });
        });
    }
  }

  // asset location was selected from main combo
  onAssetLocationSelected(code?: string): void {
    this.wrAssetLocationCode = code || '';
    this.wrAssetLocation =
      this.allAssetLocations.find(
        (loc) => loc.ASLOCODE === this.wrAssetLocationCode
      ) || {};
    this.filterComponents();
    this.filterProblems();
    this.updateWRDescription();
  }

  // stores the code of the "grandma" location to go back to
  // when executing a Back operation from the treeview path
  private goBackLocationCode: string = '';

  // asset location was selected from "treeview" combos
  onAssetLocationSelectedFromTreeview(code?: string): void {
    if (code) {
      let location =
        this.allAssetLocations.find((loc) => loc.ASLOCODE === code) || {};
      if (location.ASLOISMAINT === 'Y') {
        // if a maintenance location has been selected, the process ends
        this.wrAssetLocationCode = code || '';
        this.wrAssetLocation = location;
        this.filterComponents();
        this.filterProblems();
        this.updateWRDescription();
      } else {
        // otherwise, the next "treeview" level is opened, to show the location's children
        this.selectAssetLocationTreeview(code || '');
      }
    } else {
      // go back to previous path step
      this.selectAssetLocationTreeview(this.goBackLocationCode);
    }
  }

  private setGoBackLocationCode(locationCode: string): void {
    if (locationCode === '') this.goBackLocationCode == '';
    else
      this.dataManager.getAssetLocation(locationCode).subscribe((loc) => {
        this.goBackLocationCode = loc.ASLOIDPARENT || '';
      });
  }

  async showAssetLocationDetails() {
    const alert = await this.alertController.create({
      header: 'Asset Location Path',
      subHeader: this.wrAssetLocation.ASLODESCR,
      message: this.wrAssetLocation.ASLOIDPATH,
    });

    await alert.present();
  }

  // ---------------------- COMPONENTS ---------------------------------

  filterComponents(): void {
    if (this.wrAssetLocationCode !== '') {
      this.componentsOptions = this.allComponents
        .filter((comp) => comp.COGRCDCLASS === this.wrAssetLocation.ASLOCDCLASS)
        .map((comp) => {
          return { value: comp.COGRCDCOMP || '', label: comp.COGRDESCR || '' };
        });
      this.componentComboEnabled = true;
    } else {
      this.componentsOptions = [];
      this.componentComboEnabled = false;
    }
    this.wrComponentCode = '';
    this.wrComponent = {};
  }

  selectComponent(): void {
    if (this.componentComboEnabled && !this.wrDisabled) {
      this.searchListService.openSearchList(
        'Components',
        this.componentsOptions,
        this.onComponentSelected.bind(this),
        this.onComponentSelected.bind(this)
      );
    }
  }

  onComponentSelected(code?: string): void {
    this.wrComponentCode = code || '';
    this.wrComponent =
      this.allComponents.find(
        (comp) => comp.COGRCDCOMP === this.wrComponentCode
      ) || {};
    this.filterProblems();
    this.updateWRDescription();
  }

  async showAssetComponentDetails() {
    const alert = await this.alertController.create({
      header: 'Component Path',
      subHeader: this.wrComponent.COGRDESCR,
      message: this.wrComponent.COGRCDPATH,
    });

    await alert.present();
  }

  // ---------------------- PROBLEMS ---------------------------------

  filterProblems(): void {
    if (this.wrComponentCode !== '') {
      this.assetLocationComponentProblems = this.allComponentProblems.filter(
        (prob) =>
          prob.PRCOCDCOMP === this.wrComponent.COGRCDCOMP &&
          prob.PRCOCDCLASS === this.wrComponent.COGRCDCLASS
      );

      // for each asset location Component Problem, adds the corresponding Problem to the componentProblems array
      this.componentProblems = [];
      this.assetLocationComponentProblems.forEach((compProb) => {
        this.componentProblems.push(
          this.allProblems.find(
            (prob) => prob.PROBCODE === compProb.PRCOCDPROBLEM
          ) || {}
        );
      });
      // sorts problems by description
      this.componentProblems.sort((prob1, prob2) =>
        (prob1.PROBDESCR || '') > (prob2.PROBDESCR || '') ? 1 : -1
      );
      this.problemsOptions = this.componentProblems.map((prob) => {
        return { value: prob.PROBCODE || '', label: prob.PROBDESCR || '' };
      });
      this.problemsComboEnabled = true;
    } else {
      this.assetLocationComponentProblems = [];
      this.componentProblems = [];
      this.problemsOptions = [];
      this.problemsComboEnabled = false;
    }
    this.wrProblemCode = '';
    this.wrProblem = {};
  }

  selectProblem(): void {
    if (this.problemsComboEnabled && !this.wrDisabled) {
      this.searchListService.openSearchList(
        'Problems',
        this.problemsOptions,
        this.onProblemSelected.bind(this),
        this.onProblemSelected.bind(this)
      );
    }
  }

  onProblemSelected(code?: string): void {
    this.wrProblemCode = code || '';
    this.wrProblem =
      this.componentProblems.find(
        (prob) => prob.PROBCODE === this.wrProblemCode
      ) || {};
    this.updateWRDescription();
  }

  // ---------------------- REPORTED BY ---------------------------------

  selectReportedBy(): void {
    if (!this.wrDisabled) {
      this.searchListService.openSearchList(
        'Reported By',
        this.reportedByOptions,
        this.onReportedBySelected.bind(this),
        this.onReportedBySelected.bind(this)
      );
    }
  }

  onReportedBySelected(code?: string): void {
    this.wrReportedByCode = code || '';
    this.wrReportedBy =
      this.allPersonnel.find(
        (pers) => pers.PERSONID === this.wrReportedByCode
      ) || {};
  }

  // ---------------------- DESCRIPTION ---------------------------------

  private updateWRDescription(): void {
    this.wrDescription = (
      (this.wrComponent.COGRDESCR || '') +
      ' ' +
      (this.wrProblem.PROBDESCR || '')
    ).trim();
  }

  onWRDescriptionChanged(): void {
    // TODO: remove special characters
  }

  // ---------------------- NOTES ---------------------------------

  onWRNotesChanged(): void {
    // TODO: remove special characters
  }

  // ---------------------- WORK REQUEST ---------------------------------

  saveWorkRequest(): void {
    let workRequest: WorkRequest = {
      IDLIST: this.wrToEdit
        ? this.wrToEdit.IDLIST
        : this.generateRandomString(15), // where from?
      WOREWRTYCODE: 'HD', // FIXED to HD?
      WORECDUNIT: 'VI', // also FIXED from MCM configuration?
      WORESTATCODE: this.wrStatus,
      WOREDESCR: this.wrDescription,
      WOREDATETIME: moment(this.wrDate, 'YYYY-MM-DD HH:mm').format(
        'YYYY-MM-DD HH:mm:ss 000'
      ),
      WOREOFFSET: this.wrTimezone,
      WOREPERSREPO: this.wrReportedByCode,
      WOREDTREPO: moment(this.wrDate, 'YYYY-MM-DD HH:mm').format(
        'YYYY-MM-DD HH:mm:ss 000'
      ),
      WOREOFSREPO: this.wrTimezone,
      WOREASLOCODE: this.wrAssetLocationCode,
      WORECLASCODE: this.wrAssetLocation.ASLOCDCLASS,
      WORECOGRCODE: this.wrComponentCode,
      WOREPROBCODE: this.wrProblemCode,
      WORENUMBER: '', // should be empty, created by Asset
      WORENOTE: this.wrNotes,
      WORENRATTACH: '', // attachments management?
      WOREISREPGUEST: this.wrIsRepGuest,
      IDLISTDEVICE: 'dvZhjisXBkdJQZg', // where from?
      DEVICEID: 'dev-user', // where from?
      CREATIONUSER: '1004', // should be the logged in user Asset usercode
      CREATIONDATETIME: moment(this.wrDate, 'YYYY-MM-DD HH:mm').format(
        'YYYY-MM-DD HH:mm:ss 000'
      ),
      CREATIONOFFSET: this.wrTimezone,
      SYNC: SyncStatus.TO_BE_EXPORTED,
    };
    if (this.wrToEdit) {
      this.dataManager
        .updateWorkRequest(workRequest)
        .subscribe((workRequest) => this.onWorkRequestSaved(workRequest));
    } else {
      this.dataManager
        .addWorkRequest(workRequest)
        .subscribe((workRequest) => this.onWorkRequestSaved(workRequest));
    }
  }

  private onWorkRequestSaved(workRequest: WorkRequest): void {
    // exports WR as soon as it's been created and added to the data store,
    // but only if it's in COMPLETED state
    if (workRequest.WORESTATCODE === Status.COMPLETED) {
      this.syncService.exportWorkRequest(workRequest).subscribe(() => {
        this.toastService.showSuccess('Work Request exported');
        this.clearForm();
        this.router.navigate(['/work-request/work-requests']);
      });
    } else {
      this.clearForm();
      this.router.navigate(['/work-request/work-requests']);
    }
  }

  goBack(): void {
    if (this.wrToEdit) this.router.navigate(['/work-request/work-requests']);
    else this.router.navigate(['/landing']);
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
}
