// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useSQLite: true,
  databaseName: 'MNT_DB_',
  databaseVersion: 1,
  mcmURL: 'http://localhost:8080/MCM_3_2',
  serviceUser: 'MOBILE_MCM',
  servicePassword: 'MOBILE_MCM',
  serviceCompany: '001',
  loggedUser: 'carpenter1_vi',
  loggedPassword: 'IB1234',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
