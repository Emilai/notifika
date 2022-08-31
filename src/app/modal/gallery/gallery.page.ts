import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  cardInfo: any;
  cardImgs: any;
  imagenes: any;

  constructor(private modalCtrl: ModalController, private cardService: CardService) { }

  async ngOnInit() {
    this.cardInfo = this.cardService.cardInfo;
    await (await this.cardService.getGallery(this.cardInfo.link)).subscribe(imgs => {
      this.cardImgs = imgs;
      this.imagenes = this.cardImgs.photoset.photo;
      console.log(this.imagenes);
    });

  }

  salir() {
    this.modalCtrl.dismiss();
  }

  openImg(link) {
    window.open(link, '_system');
  }
}
