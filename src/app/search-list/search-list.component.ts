import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectOption } from '../common/models';
import { LoaderService } from '../core/services/loader.service';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit {
  title!: string;
  options: SelectOption[] = [];
  filteredOptions: SelectOption[] = [];
  filterText: string = '';

  constructor(
    private modalCtrl: ModalController,
    private loadingService: LoaderService
  ) {}

  ngOnInit() {
    this.filteredOptions = this.options;
  }

  ionViewDidEnter() {
    this.loadingService.hide();
  }

  applyFilter() {
    if (this.filterText === '') {
      this.filteredOptions = this.options;
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option.label.toLocaleLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  clear() {
    return this.modalCtrl.dismiss(null, 'clear');
  }

  confirm(aslocode: string) {
    return this.modalCtrl.dismiss(aslocode, 'confirm');
  }
}
