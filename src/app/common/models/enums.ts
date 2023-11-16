export enum Status {
  DRAFT = '10',
  COMPLETED = '20',
}

export enum SyncStatus {
  FROM_MCM = 0,
  TO_BE_EXPORTED = 1,
  EXPORTED = 2,
  DRAFT = 3,
}

export enum ImportType {
  ASSET_LOCATION = 'ASSET_LOCATION',
  CLASSIFICATION = 'CLASSIFICATION',
  COMPONENT = 'COMPONENT',
  COMPONENT_PROBLEM = 'COMPONENT_PROBLEM',
  PROBLEM = 'PROBLEM',
  PERSONNEL = 'PERSONNEL',
}

export enum ExportType {
  WR = 'WR',
  REQ = 'REQ',
}
