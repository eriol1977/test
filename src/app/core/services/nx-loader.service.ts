import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  loader: any;
  isLoaded: Subject<boolean> = new BehaviorSubject<boolean>(false);
  creating: boolean = false;

  constructor(public loadingController: LoadingController) {}

  /**
   *
   * @param options
   */
  show(options: LoadingOptions = {}): void {
    if (this.creating) return;

    this.creating = true;

    this.loadingController.create(options).then((loader) => {
      this.loader = loader;

      this.loader.present().then(() => {
        this.isLoaded.next(true);
      });
    });
  }

  /**
   *
   */
  hide(): void {
    let sub = this.isLoaded.subscribe((isLoaded) => {
      if (isLoaded) {
        this.loader.dismiss().then(() => {
          this.loader = null;
          sub.unsubscribe();
          this.creating = false;
          this.isLoaded.next(false);
        });
      }
    });
  }
}
