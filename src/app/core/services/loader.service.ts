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
  async show(options: LoadingOptions = {}): Promise<void> {
    if (this.creating) return;
    this.creating = true;
    this.loader = await this.loadingController.create(options);
    await this.loader.present();
    this.isLoaded.next(true);
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

  addMessage(msg: string) {
    if (this.isLoaded) {
      this.loader.message += msg;
    }
  }

  removeMessage(msg: string) {
    if (this.isLoaded) {
      this.loader.message = this.loader.message.replace(msg, '');
    }
  }
}
