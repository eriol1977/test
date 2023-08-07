import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  async presentToast(
    msg: string,
    color: string,
    position: 'top' | 'middle' | 'bottom' = 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: position,
      color: color,
    });

    await toast.present();
  }

  showSuccess(msg: string) {
    this.presentToast(msg, 'success');
  }

  showError(msg: string) {
    this.presentToast(msg, 'danger');
  }
}
