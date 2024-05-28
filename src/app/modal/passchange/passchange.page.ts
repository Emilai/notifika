import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { Auth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from '@angular/fire/auth';

@Component({
  selector: 'app-passchange',
  templateUrl: './passchange.page.html',
  styleUrls: ['./passchange.page.scss'],
})
export class PasschangePage implements OnInit {

  invalidPass = false;
  hide = true;
  oldPass: string;
  newPass: string;
  newPassConfirm: string;
  userInfo: any;
  instituto: any;

  newPassInvalid = false;
  newPassConfirmInvalid = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private cardService: CardService,
    private auth: Auth,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      // await this.pushService.configuracionInicialPush();
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(async kupones => {
          this.instituto = kupones.data();
        });
      });
    });
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  toggleShow() {
    this.hide = !this.hide;
  }

  validateNewPass() {
    this.newPassInvalid = this.newPass.length < 8;
  }

  validateNewPassConfirm() {
    this.newPassConfirmInvalid = this.newPass !== this.newPassConfirm;
  }

  isChangePasswordDisabled() {
    return this.newPassInvalid || this.newPassConfirmInvalid || !this.newPass || !this.newPassConfirm;
  }

  async changePassword() {
    this.invalidPass = false;

    if (this.newPassInvalid || this.newPassConfirmInvalid) {
      console.log('Validation failed');
      return;
    } else {
      try {
        const user = this.auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, this.oldPass);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, this.newPass);
        this.authService.updateUserPass(this.userInfo.id, this.newPass);
        console.log('Password updated successfully');
        this.showAlert('Contraseña Actualizada', 'Su contreseña fue actualizada correctamente');
        this.salir();
      } catch (error) {
        console.log('Error changing password:', error);
        this.invalidPass = true;
      }
    }
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
