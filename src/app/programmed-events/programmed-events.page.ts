import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { AuthService } from '../services/auth.service';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { EventPage } from '../modal/event/event.page';

@Component({
  selector: 'app-programmed-events',
  templateUrl: './programmed-events.page.html',
  styleUrls: ['./programmed-events.page.scss'],
})
export class ProgrammedEventsPage implements OnInit {
  programmed: any;
  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;
  toDelete: any;

  constructor(
    public cardService: CardService,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe,
    public datePipe: DatePipe,
    private router: Router,
    public modalCtrl: ModalController,
    private alertController: AlertController
  ) {
  }

  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      this.cardService.getProgrammedEvent(this.userInfo.code).then(cards => {
        cards.subscribe(card => {
          this.cards = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.cards = this.orderPipe.transform(this.cards, 'date', false);
          console.log(this.cards);
        });
      });
      return userInfo;
    });
  }

  // async mostrarModal(card) {

  //   const modal = await this.modalCtrl.create({
  //     component: EditprogrammedPage,
  //     showBackdrop: true,
  //     canDismiss: true,
  //     animated: true,
  //     mode: 'ios',
  //   });
  //   this.cardService.programmed = card;
  //   await modal.present();
  // }

  async open(card) {


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
  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  // edit(data) {
  //   console.log(data);
  //   this.mostrarModal(data);
  // }

  del(data) {
    this.showAlert('Se eliminará el Evento', 'Desea continuar?', data);
  }

  async showAlert(header, message, data) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirmar',
        handler: async () => {
          await this.cardService.deleteEvent(this.userInfo.code, data.id);
          await this.cardService.cancelScheduledNotification(data.notId);
        }
      }]
    });
    await alert.present();
  }
}
