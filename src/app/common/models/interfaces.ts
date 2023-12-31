import { SyncStatus } from './enums';

export interface WorkRequest {
  IDLIST?: string;
  WOREWRTYCODE?: string;
  WORECDUNIT?: string;
  WORESTATCODE?: string;
  WOREDESCR?: string;
  WOREDATETIME?: string;
  WOREOFFSET?: string;
  WOREPERSREPO?: string;
  WOREDTREPO?: string;
  WOREOFSREPO?: string;
  WOREASLOCODE?: string;
  WORECLASCODE?: string;
  WORECOGRCODE?: string;
  WOREPROBCODE?: string;
  WORENUMBER?: string;
  WORENOTE?: string;
  WORENRATTACH?: string;
  WOREISREPGUEST?: string;
  IDLISTDEVICE?: string;
  DEVICEID?: string;
  CREATIONUSER?: string;
  CREATIONDATETIME?: string;
  CREATIONOFFSET?: string;
  SYNC?: SyncStatus;
}

export interface AssetLocation {
  ASLOCODE?: string;
  ASLOTILELABEL1?: string;
  ASLOTILELABEL2?: string;
  ASLOTILELABEL3?: string;
  ASLOTILELABEL4?: string;
  ASLOTILELABEL5?: string;
  ASLOTILELABEL6?: string;
  ASLOTILELABEL7?: string;
  ASLOTILELABEL8?: string;
  ASLOTILELABEL9?: string;
  ASLOISTEMPLATE?: string;
  ASLOIDPATH?: string;
  ASLOLABEIMAGE?: string;
  ASLOISSERIALNR?: string;
  ASLOIDITEM?: string;
  ASLOCDCLASS?: string;
  ASLOSERIALNR?: string;
  ASLODESCR?: string;
  ASLOCDUNIT?: string;
  ASLODOWN?: string;
  ASLOISMAINT?: string;
  ASLOISUNIQUE?: string;
  ASLODTSTART?: string;
  ASLOFAMILY?: string;
  ASLOTILEDATA1?: string;
  ASLOTILEDATA2?: string;
  ASLOTILEDATA3?: string;
  ASLOTILEDATA4?: string;
  ASLOTILEDATA5?: string;
  ASLOTILEDATA6?: string;
  ASLOTILEDATA7?: string;
  ASLOTILEDATA8?: string;
  ASLOTILEDATA9?: string;
  ASLOCDDEPTO?: string;
  ASLOCRITICALRANK?: string;
  ASLODESCR2?: string;
  ASLOPATHSHORTCODE?: string;
  ASLONOTE?: string;
  ASLOCDSHORT?: string;
  ASLOCOMPANYID?: string;
  ASLOTYPE?: string;
  ASLOLABECOLOR?: string;
  ASLOIDPARENT?: string;
  ASLOSTATUS?: string;
  PAR_CDUNIT?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  CUSTOMFIELD?: string;
  RECORDCOUNTER?: string;
}

export interface ComponentAsset {
  COGRCDCOMP?: string;
  COGRCDPATH?: string;
  COGRISDEFAULT?: string;
  COGRDESCR?: string;
  COGRCDPARENT?: string;
  COGRCDCLASS?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  RECORDCOUNTER?: string;
}

export interface ComponentProblem {
  PRCOCDCOMP?: string;
  PRCOCDCLASS?: string;
  PRCOCDPROBLEM?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  RECORDCOUNTER?: string;
}

export interface Problem {
  PROBCODE?: string;
  PROBDESCR?: string;
  PROBDESCR2?: string;
  PROBCDACTIVITY?: string;
  PROBCDCATE?: string;
  PROBISSYMPTOM?: string;
  PROBISFAILMODE?: string;
  PROBCDUNIT?: string;
  PROBCOMPANYID?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  RECORDCOUNTER?: string;
}

export interface Personnel {
  PERSONID?: string;
  PERSONCDUNIT?: string;
  PERSONNAME?: string;
  PERSONDTSTART?: string;
  PERSONDTSTOP?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  RECORDCOUNTER?: string;
}

export interface Classification {
  CLASCODE?: string;
  CLASDESCR?: string;
  CLASISASSET?: string;
  CLASPARENTID?: string;
  CLASPATH?: string;
  CLASCDUNIT?: string;
  CLASCOMPANYID?: string;
  CLASISITEM?: string;
  CLASINHERITBY?: string;
  pTop?: string;
  CANCELLED?: string;
  UPDATEDATETIME?: string;
  UPDATEOFFSET?: string;
  RECORDCOUNTER?: string;
}

export interface REQHeader {
  IDDOC: string;
  NRDOC: string;
  DSDOC: string;
  DTDOC: string;
  CDUNIT: string;
  DSUNIT: string;
  CDCURRENCY: string;
  NEXTSTATUSES: string;
  USERS: string;
}

export interface REQRow {
  IDDOC: string;
  CPROWNUM: string;
  IDITEM: string;
  CDKEY: string;
  DSITEM: string;
  QTITEM: string;
  CDUOM: string;
  CDCOST_CENTER: string;
  CDACCOUNT: string;
  NTPHASE: string;
}

export interface REQValidated {
  IDAPP: string;
  IDDOC: string;
  CDUNIT: string;
  NRDOC: string;
  DSDOC: string;
  FLSTATUS: string;
  CREATIONUSER: string;
  ROWS: REQRowValidated[];
}

export interface REQRowValidated {
  CPROWNUM: string;
  IDITEM: string;
  CDKEY: string;
  QTEXAM: string;
  CDUOM: string;
  CDCOST_CENTER: string;
  CDACCOUNT: string;
  NTPHASE: string;
}

export interface FinancialStruct {
  IDFINSTRUCT: string;
  CDUNIT: string;
  CDCOST_CENTER: string;
  DSCOST_CENTER: string;
  CDACCOUNT: string;
  DSACCOUNT: string;
  FLTYPE: string;
  FLNAVIGATION: string;
  SUSPUNITS: string;
  PARENTCODE: string;
  PATHCODE: string;
  FLCANC: string;
}
