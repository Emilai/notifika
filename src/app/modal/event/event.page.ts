import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
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
