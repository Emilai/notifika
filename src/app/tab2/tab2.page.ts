import { getLocaleFirstDayOfWeek } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { iosTransitionAnimation, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ModalPage } from 'src/app/modal/modal/modal.page';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { OrderModule } from 'ngx-order-pipe';
import { OrderPipe } from 'ngx-order-pipe';
import { GalleryPage } from '../modal/gallery/gallery.page';
import { GalleryPageModule } from '../modal/gallery/gallery.module';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page implements OnInit {

  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;

  constructor(public cardService: CardService, public modalCtrl: ModalController,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe) {
  }

  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      this.cardService.getGalleries(this.userInfo.code, this.userInfo.grupos).then(cards => {
        cards.subscribe(card => {
          this.cards = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.cards = this.orderPipe.transform(this.cards, 'date', true); // ver si el orden es el correcto

        });
      });
      return userInfo;
    });


  }


  async mostrarModal(card) {

    const modal = await this.modalCtrl.create({
      component: GalleryPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    this.cardService.gallery = card;
    await modal.present();
  }


}
