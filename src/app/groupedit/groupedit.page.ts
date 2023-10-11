import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-groupedit',
  templateUrl: './groupedit.page.html',
  styleUrls: ['./groupedit.page.scss'],
})
export class GroupeditPage implements OnInit {

  instituto: any;
  userInfo: any;
  nuevoGrupo: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController
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
      this.userInfo = userInfo;
    });

    return;
  }


  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  del(i) {
    console.log('Eliminado grupo: ', this.instituto.grupos[i]);
    this.instituto.grupos.splice(i, 1);
  }

  add() {
    const groupName = this.nuevoGrupo.split(' ').join('-');
    this.instituto.grupos.push(groupName);
    this.nuevoGrupo = '';
  }

  async update() {

    const loading = await this.loadingController.create();
    await loading.present();
    console.log('update');
    try {
      await this.cardService.updateGroups(this.userInfo.code, this.instituto.grupos);
      await loading.dismiss();
      this.showAlert('Grupos Actualizados', '💪🏻😁');
    } catch {
      await loading.dismiss();
      this.showAlert('Hubo un error al actualizar', 'contacte a soporte@notifika.uy');
    }


  }

  cancel() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
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
