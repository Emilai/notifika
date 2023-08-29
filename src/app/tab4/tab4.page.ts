import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { PushService } from '../services/push.service';

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
    private pushService: PushService
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
    this.showAlert('Su cuenta será borrada', 'Desea hacerlo?');
  }

  async deleteAccount() {
    await this.authService.deleteUserData();
    await this.authService.logout();
    this.router.navigateByUrl('/login', {
      replaceUrl: true
    });
    this.showAlert2('Su cuenta ha sido eliminada');
  }


  comunicado() {
    this.router.navigateByUrl('/comunicado', {
      replaceUrl: true}
      );
  }

  galery() {
    this.router.navigateByUrl('/galleries', {
      replaceUrl: true
    }
    );
  }

  galeryload() {
    this.router.navigateByUrl('/galleryload', {
      replaceUrl: true
    }
    );
  }

  evento() {
    this.router.navigateByUrl('/evento', {
      replaceUrl: true
    }
    );
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
            this.authService.deleteAuthData();
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

}
