import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  galleryInfo: any;
  cardImgs: any;
  imagenes: any;

  constructor(private modalCtrl: ModalController, private cardService: CardService) { }

  async ngOnInit() {
    this.galleryInfo = this.cardService.gallery;

  }

  salir() {
    this.modalCtrl.dismiss();
  }

  openImg(link) {
    window.open(link, '_system');
  }
}
