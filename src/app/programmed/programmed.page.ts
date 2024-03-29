import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { AuthService } from '../services/auth.service';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { EditprogrammedPage } from '../editprogrammed/editprogrammed.page';
import { ModalPage } from '../modal/modal/modal.page';

@Component({
  selector: 'app-programmed',
  templateUrl: './programmed.page.html',
  styleUrls: ['./programmed.page.scss'],
})
export class ProgrammedPage implements OnInit {

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
      this.cardService.getProgrammedComunic(this.userInfo.code).then(cards => {
        cards.subscribe(card => {
          this.cards = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.cards = this.orderPipe.transform(this.cards, 'date', false);

        });
      });
      return userInfo;
    });
  }

  async mostrarModal(card) {

    const modal = await this.modalCtrl.create({
      component: EditprogrammedPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    this.cardService.programmed = card;
    await modal.present();
  }

  async open(card) {


    const modal = await this.modalCtrl.create({
      component: ModalPage,
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

  edit(data){
    console.log(data);
    this.mostrarModal(data);
  }

  del(data) {
    this.showAlert('Se eliminará el Comunicado', 'Desea continuar?', data);
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
          await this.cardService.deleteCom(this.userInfo.code, data.id);
          await this.cardService.cancelScheduledNotification(data.notId);
        }
      }]
    });
    await alert.present();
  }
}
