/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { PushService } from '../services/push.service';
import { RecibosPage } from '../modal/recibos/recibos.page';
import { PasschangePage } from '../modal/passchange/passchange.page';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  userInfo: any;
  instituto: any;

  constructor(
    public authService: AuthService,
    public cardService: CardService,
    private router: Router,
    private alertController: AlertController,
    private pushService: PushService,
    public modalCtrl: ModalController
  ) { }


  async ngOnInit() {
    (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(kupones => {
          this.instituto = kupones.data();
        });
      });
    });
    return;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', {
      replaceUrl: true
    });
  }

  deleteAccountOption() {
    this.showAlert('Solicitará la eliminación de su cuenta por Whatsapp', 'Desea hacerlo?');
  }

  async deleteAccount() {

    window.location.href = `https://api.whatsapp.com/send?phone=+59891998256&text=Deseo%20eliminar%20mi%20cuenta%20de%20Notifika.%20Usuario:%20${this.userInfo.email}%20-%20Empresa:%20${this.instituto.nombre}`;
    // await this.authService.deleteUserData();
    // await this.authService.logout();
    // this.router.navigateByUrl('/login', {
    //   replaceUrl: true
    // });
    // this.showAlert2('Su cuenta ha sido eliminada');
  }

  async showAlert(header, message) {
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
          handler: () => {
            this.deleteAccount();
            // this.authService.deleteAuthData();
          }
        }]
    });
    await alert.present();
  }

  async showAlert2(header) {
    const alert = await this.alertController.create({
      header,
      buttons: ['OK']
    });
    await alert.present();
  }

  whatsapp() {
    window.location.href = 'https://wa.me/' + this.instituto.whatsapp;
  }

  instagram() {
    window.location.href = this.instituto.instagram;
  }

  web() {
    window.location.href = this.instituto.web;
  }

  async mostrarRecibos(cedula, fym, code) {
    const modal = await this.modalCtrl.create({
      component: RecibosPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });


    this.authService.cedula = cedula;
    this.authService.fym = fym;
    this.authService.code = code;
    await modal.present();
  }

  async passChange() {
    const modal = await this.modalCtrl.create({
      component: PasschangePage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    await modal.present();
  }

}
