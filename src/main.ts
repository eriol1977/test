import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';

if (environment.production) {
  enableProdMode();
}

if (environment.useSQLite) {
  // --> Below only required if you want to use a web platform
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    // required for jeep-sqlite Stencil component
    // to use a SQLite database in Browser
    jeepSqlite(window);

    window.addEventListener('DOMContentLoaded', async () => {
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      //      jeepEl.autoSave = true;
    });
  }
  // Above only required if you want to use a web platform <--
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
