import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  cardInfo: any;

  constructor(private modalCtrl: ModalController, private cardService: CardService) { }

  ngOnInit() {
    this.cardInfo = this.cardService.cardInfo;
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  link() {
    window.open(this.cardInfo.link, '_system');
  }
}
