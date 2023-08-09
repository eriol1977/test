import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SelectOption } from '../common/models';
import { InfiniteScrollCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-search-list',
  templateUrl: './search-list.component.html',
  styleUrls: ['./search-list.component.scss'],
})
export class SearchListComponent implements OnInit {
  title!: string;
  options: SelectOption[] = [];
  filteredOptions: SelectOption[] = [];
  visibleOptions: SelectOption[] = [];
  filterText: string = '';
  SCROLL_STEP: number = 20;
  currentScroll: number = 0;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.title = this.title.toUpperCase();
    this.applyFilter();
  }

  onIonInfinite(ev: any) {
    this.addOptions();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 10);
  }

  private addOptions(): void {
    if (this.currentScroll < this.filteredOptions.length) {
      let newOptions = this.filteredOptions.slice(
        this.currentScroll,
        this.currentScroll + this.SCROLL_STEP
      );
      this.visibleOptions = this.visibleOptions.concat(newOptions);
      this.currentScroll += this.SCROLL_STEP;
    }
  }

  applyFilter() {
    if (this.filterText === '') {
      this.filteredOptions = this.options;
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option.label.toLocaleLowerCase().includes(this.filterText.toLowerCase())
      );
    }
    this.currentScroll = 0;
    this.visibleOptions = this.filteredOptions.slice(0, this.SCROLL_STEP);
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
