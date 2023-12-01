// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useSQLite: false,
  databaseName: 'MNT_DB_',
  databaseVersion: 1,
  serverURL: 'http://evo-dev1:8280/DEV_Bertolino_Asset_411',
  isUsingMCM: true,
  serviceUser: 'service',
  servicePassword: 'service',
  serviceCompany: '001',
  loggedUser: 'cheng2',
  loggedPassword: 'EVO1234',
  loggedUserCode: '1011',
  maintenanceModuleActive: true,
  purchaseModuleActive: false,
  isDevelopmentVersion: true,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
