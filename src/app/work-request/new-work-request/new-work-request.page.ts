import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {
  AssetLocation,
  Classification,
  ComponentAsset,
  Personnel,
  Problem,
  SelectOption,
  Status,
  STATUSES,
  TIMEZONES,
  WorkRequest,
} from '../../common/models';
import { WorkRequestRestService } from '../../core';
import { ToastService } from '../../core/services/toast.service';
import { LoaderService } from '../../core/services/loader.service';

@Component({
  selector: 'new-work-request',
  templateUrl: './new-work-request.page.html',
  styleUrls: ['./new-work-request.page.scss'],
})
export class NewWorkRequestPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);

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

  allClassifications: Classification[] = [];

  wrComponentCode: string = '';
  wrComponent: ComponentAsset = {};
  allComponents: ComponentAsset[] = [];
  assetLocationComponents: ComponentAsset[] = [];
  componentComboEnabled: boolean = false;

  wrProblemCode: string = '';
  wrProblem: Problem = {};
  allProblems: Problem[] = [];

  wrReportedByCode: string = '';
  wrReportedBy: Personnel = {};
  allPersonnel: Personnel[] = [];

  wrDescription: string = '';
  wrNote: string = '';
  wrIsRepGuest: boolean = false;

  wrAdded: boolean = false;

  constructor(
    private wrService: WorkRequestRestService,
    private loadingService: LoaderService,
    private toastService: ToastService
  ) {}

  onAssetLocationSelected() {
    this.wrAssetLocation =
      this.allAssetLocations.filter(
        (loc) => loc.ASLOCODE === this.wrAssetLocationCode
      )[0] || {};
    this.filterComponents();
  }

  filterComponents() {
    if (this.wrAssetLocationCode !== '') {
      this.assetLocationComponents = this.allComponents.filter(
        (comp) => comp.COGRCDCLASS === this.wrAssetLocation.ASLOCDCLASS
      );
      this.assetLocationComponents.unshift({ COGRCDCOMP: '', COGRDESCR: '' });
      this.componentComboEnabled = true;
    } else {
      this.assetLocationComponents = [];
      this.componentComboEnabled = false;
    }
    this.wrComponentCode = '';
    this.wrComponent = {};
  }

  onComponentSelected() {
    this.wrComponent =
      this.assetLocationComponents.filter(
        (comp) => comp.COGRCDCOMP === this.wrComponentCode
      )[0] || {};
  }

  addWorkRequest() {
    this.loadingService.show({
      message: 'Adding Work Request...',
    });
    let workRequest: WorkRequest = {
      IDLIST: 'TSTOjisXBkdJQZg', // where from?
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
      WORECLASCODE: 'HQS0000100', // Classifications are needed! load with web service and store locally
      WORECOGRCODE: this.wrComponentCode,
      WOREPROBCODE: this.wrProblemCode,
      WORENUMBER: '', // should be empty, created by Asset
      WORENOTE: this.wrNote,
      WORENRATTACH: '', // attachments management?
      WOREISREPGUEST: this.wrIsRepGuest ? 'Y' : 'N',
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
      this.wrAdded = true;
    });
  }

  ngOnInit() {
    this.loadingService.show({
      message: 'Loading...',
    });

    this.wrService.getAssetLocationList().subscribe((data) => {
      console.log('Asset Locations: ');
      console.log(data);
      this.allAssetLocations = data;
      this.allAssetLocations.unshift({ ASLOCODE: '', ASLODESCR: '' });
      this.loadingService.hide();
    });

    this.wrService.getComponentsList().subscribe((data) => {
      console.log('Components: ');
      console.log(data);
      this.allComponents = data;
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
    });

    this.wrService.getClassificationsList().subscribe((data) => {
      console.log('Classifications: ');
      console.log(data);
      this.allClassifications = data;
    });
  }
}
