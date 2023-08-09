import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
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
} from '../../common/models';
import { WorkRequestRestService } from '../../core';
import { ToastService } from '../../core/services/toast.service';
import { LoaderService } from '../../core/services/loader.service';
import { ModalController } from '@ionic/angular';
import { SearchListComponent } from 'src/app/search-list/search-list.component';

@Component({
  selector: 'new-work-request',
  templateUrl: './new-work-request.page.html',
  styleUrls: ['./new-work-request.page.scss'],
})
export class NewWorkRequestPage implements OnInit {
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
  assetLocationComponents: ComponentAsset[] = [];
  componentsOptions: SelectOption[] = [];
  componentComboEnabled: boolean = false;

  wrProblemCode: string = '';
  wrProblem: Problem = {};
  allComponentProblems: ComponentProblem[] = [];
  assetLocationComponentProblems: ComponentProblem[] = [];
  allProblems: Problem[] = [];
  componentProblems: Problem[] = [];
  problemsComboEnabled: boolean = false;

  wrReportedByCode: string = '';
  wrReportedBy: Personnel = {};
  allPersonnel: Personnel[] = [];

  wrDescription: string = '';
  wrNotes: string = '';
  wrIsRepGuest: string = 'N';

  constructor(
    private wrService: WorkRequestRestService,
    private loadingService: LoaderService,
    private toastService: ToastService,
    private modalCtrl: ModalController
  ) {}

  onAssetLocationSelected(): void {
    this.wrAssetLocation =
      this.allAssetLocations.filter(
        (loc) => loc.ASLOCODE === this.wrAssetLocationCode
      )[0] || {};
    this.filterComponents();
    this.filterProblems();
    this.updateWRDescription();
  }

  filterComponents(): void {
    if (this.wrAssetLocationCode !== '') {
      this.assetLocationComponents = this.allComponents.filter(
        (comp) => comp.COGRCDCLASS === this.wrAssetLocation.ASLOCDCLASS
      );
      this.componentsOptions = this.assetLocationComponents.map((comp) => {
        return { value: comp.COGRCDCOMP || '', label: comp.COGRDESCR || '' };
      });
      this.componentComboEnabled = true;
    } else {
      this.assetLocationComponents = [];
      this.componentsOptions = [];
      this.componentComboEnabled = false;
    }
    this.wrComponentCode = '';
    this.wrComponent = {};
  }

  onComponentSelected(): void {
    this.wrComponent =
      this.assetLocationComponents.filter(
        (comp) => comp.COGRCDCOMP === this.wrComponentCode
      )[0] || {};
    this.filterProblems();
    this.updateWRDescription();
  }

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
      this.componentProblems.unshift({ PROBCODE: '', PROBDESCR: '' });
      this.problemsComboEnabled = true;
    } else {
      this.componentProblems = [];
      this.problemsComboEnabled = false;
    }
    this.wrProblemCode = '';
    this.wrProblem = {};
  }

  onProblemSelected(): void {
    this.wrProblem =
      this.componentProblems.filter(
        (prob) => prob.PROBCODE === this.wrProblemCode
      )[0] || {};
    this.updateWRDescription();
  }

  onReportedBySelected(): void {
    this.wrReportedBy =
      this.allPersonnel.filter(
        (pers) => pers.PERSONID === this.wrReportedByCode
      )[0] || {};
  }

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

  onWRNotesChanged(): void {
    // TODO: remove special characters
  }

  addWorkRequest(): void {
    this.loadingService.show({
      message: 'Adding Work Request...',
    });
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
    };
    this.wrService.addWorkRequest(workRequest).subscribe((data) => {
      this.loadingService.hide();
      this.toastService.showSuccess('Work Request added');
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

  private clearForm() {
    this.wrDate = moment().format('YYYY-MM-DD HH:mm');
    this.wrTimezone = `${moment().utcOffset()}`;
    this.wrStatus = Status.DRAFT;
    this.wrAssetLocationCode = '';
    this.wrAssetLocation = {};
    this.wrComponentCode = '';
    this.wrComponent = {};
    this.assetLocationComponents = [];
    this.componentComboEnabled = false;
    this.wrProblemCode = '';
    this.wrProblem = {};
    this.assetLocationComponentProblems = [];
    this.componentProblems = [];
    this.problemsComboEnabled = false;
    this.wrReportedByCode = '';
    this.wrReportedBy = {};
    this.wrDescription = '';
    this.wrNotes = '';
    this.wrIsRepGuest = 'N';
  }

  ngOnInit() {
    this.loadingService.show({
      message: 'Loading...',
    });

    this.wrService.getAssetLocationList().subscribe((data) => {
      console.log('Asset Locations: ');
      console.log(data);
      this.allAssetLocations = data;
      this.assetLocationOptions = this.allAssetLocations.map((loc) => {
        return { value: loc.ASLOCODE || '', label: loc.ASLODESCR || '' };
      });
      this.loadingService.hide();
    });

    this.wrService.getComponentsList().subscribe((data) => {
      console.log('Components: ');
      console.log(data);
      this.allComponents = data;
    });

    this.wrService.getComponentProblemsList().subscribe((data) => {
      console.log('Component Problems: ');
      console.log(data);
      this.allComponentProblems = data;
    });

    this.wrService.getProblemsList().subscribe((data) => {
      console.log('Problems: ');
      console.log(data);
      this.allProblems = data;
    });

    this.wrService.getPersonnelList().subscribe((data) => {
      console.log('Personnel: ');
      console.log(data);
      this.allPersonnel = data;
      this.allPersonnel.unshift({ PERSONID: '', PERSONNAME: '' });
    });

    this.wrService.getClassificationsList().subscribe((data) => {
      console.log('Classifications: ');
      console.log(data);
      this.allClassifications = data;
    });
  }

  async selectAssetLocation() {
    this.loadingService.show({
      message: 'Loading list...',
    });
    const modal = await this.modalCtrl.create({
      component: SearchListComponent,
      componentProps: {
        title: 'Asset Locations',
        options: this.assetLocationOptions,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      this.wrAssetLocationCode = data;
      this.onAssetLocationSelected();
    } else if (role === 'clear') {
      this.wrAssetLocationCode = '';
      this.onAssetLocationSelected();
    }
  }

  async selectComponent() {
    if (this.componentComboEnabled) {
      this.loadingService.show({
        message: 'Loading list...',
      });
      const modal = await this.modalCtrl.create({
        component: SearchListComponent,
        componentProps: {
          title: 'Components',
          options: this.componentsOptions,
        },
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (role === 'confirm') {
        this.wrComponentCode = data;
        this.onComponentSelected();
      } else if (role === 'clear') {
        this.wrComponentCode = '';
        this.onComponentSelected();
      }
    }
  }
}
