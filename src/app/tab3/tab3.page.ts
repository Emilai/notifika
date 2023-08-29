import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventPage } from '../modal/event/event.page';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { OrderModule } from 'ngx-order-pipe';
import { OrderPipe } from 'ngx-order-pipe';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;


  constructor(public cardService: CardService, public modalCtrl: ModalController,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe) { }


  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      this.cardService.getEvent(this.userInfo.code, this.userInfo.grupos).then(cards => {
        cards.subscribe(card => {
          this.cards = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.cards = this.orderPipe.transform(this.cards, 'date' , true);
        });
      });
      return userInfo;
    });
  }


  async mostrarModal(card) {

    const modal = await this.modalCtrl.create({
      component: EventPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    this.cardService.cardInfo = card;
    await modal.present();
  }

}
