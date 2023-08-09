import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchListComponent } from 'src/app/search-list/search-list.component';
import { SelectOption } from 'src/app/common/models';

@Injectable({
  providedIn: 'root',
})
export class SearchListService {
  constructor(private modalCtrl: ModalController) {}

  async openSearchList(
    title: string,
    options: SelectOption[],
    callbackConfirm: Function,
    callbackClear: Function
  ) {
    const modal = await this.modalCtrl.create({
      component: SearchListComponent,
      componentProps: {
        title: title,
        options: options,
      },
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      callbackConfirm(data);
    } else if (role === 'clear') {
      callbackClear();
    }
  }
}
