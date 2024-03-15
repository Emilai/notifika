import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { AuthService } from '../services/auth.service';
import { OrderPipe } from 'ngx-order-pipe';
import { EditGroupsPage } from '../modal/edit-groups/edit-groups.page';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab6',
  templateUrl: './tab6.page.html',
  styleUrls: ['./tab6.page.scss'],
})
export class Tab6Page implements OnInit {

  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;
  textoBuscar = '';
  docBuscar = '';
  mailBuscar = '';
  documento = '';
  totalUsers: any;

  constructor(
    private cardService: CardService,
    private authService: AuthService,
    private orderPipe: OrderPipe,
    public modalCtrl: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await(await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      // this.cardService.getCompanyUsers(this.userInfo.code).then(cards => {
      //   cards.subscribe(card => {
      //     this.cards = card.map(cardRef => {
      //       const data = cardRef.payload.doc.data();
      //       return data;
      //     });
      //     this.cards = this.orderPipe.transform(this.cards, 'cedula', false);
      //   });
      // });
      return userInfo;
    });

  }


  async editGroups(user) {

    const modal = await this.modalCtrl.create({
      component: EditGroupsPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    this.cardService.editGroups = user;
    await modal.present();
  }

  onSearchChange(event) {
    this.textoBuscar = event.detail.value;
  }
  onSearchChange2(event) {
    this.docBuscar = event.detail.value;
  }
  onSearchChange3(event) {
    this.mailBuscar = event.detail.value;
  }

  async buscarUsuario() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.cardService.getCompanyUser(this.documento, this.userInfo.code).then(cards => {
      cards.subscribe(card => {
        this.cards = card.map(cardRef => {
          const data = cardRef.payload.doc.data();
          return data;
        });
      });
    });
    await loading.dismiss();
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
