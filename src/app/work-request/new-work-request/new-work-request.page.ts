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
} from '../../common/models';
import { ToastService } from '../../core/services/toast.service';
import { LoaderService } from '../../core/services/loader.service';
import { SearchListService } from '../../core/services/search-list.service';
import { AlertController } from '@ionic/angular';
import { SyncService } from 'src/app/core';
import { DataManager } from 'src/app/core/datamanager/data-manager';

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

  constructor(
    private loadingService: LoaderService,
    private toastService: ToastService,
    private searchListService: SearchListService,
    private alertController: AlertController,
    private syncService: SyncService,
    private dataManager: DataManager
  ) {}

  ngOnInit() {
    this.loadingService
      .show({
        message: 'Initializing app:',
      })
      .then(() => {
        // waits for the loading message component to be ready, before proceeding

        // synchronizes all data to/from MCM as soon as the page is loaded (useful for tests)
        this.syncService.synchronize().subscribe(() => {
          this.loadingService.addMessage('<BR/>Initializing local data...');
          this.initData().subscribe(() => {
            this.loadingService.hide();
          });
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
          this.assetLocationOptions = this.allAssetLocations.map((loc) => {
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
  }

  // ---------------------- ASSET LOCATIONS ---------------------------------

  selectAssetLocation(): void {
    this.searchListService.openSearchList(
      'Asset Locations',
      this.assetLocationOptions,
      this.onAssetLocationSelected.bind(this),
      this.onAssetLocationSelected.bind(this)
    );
  }

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
    if (this.componentComboEnabled) {
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
    if (this.problemsComboEnabled) {
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
    this.searchListService.openSearchList(
      'Reported By',
      this.reportedByOptions,
      this.onReportedBySelected.bind(this),
      this.onReportedBySelected.bind(this)
    );
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

  addWorkRequest(): void {
    let workRequest: WorkRequest = {
      IDLIST: this.generateRandomString(15), // where from?
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
    this.dataManager
      .addWorkRequest(workRequest)
      .subscribe((workRequest) => this.onWorkRequestAdded(workRequest));
  }

  private onWorkRequestAdded(workRequest: WorkRequest): void {
    // exports WR as soon as it's been created and added to the data store
    this.syncService.exportWorkRequest(workRequest).subscribe(() => {
      this.toastService.showSuccess('Work Request exported');
      this.clearForm();
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
}
