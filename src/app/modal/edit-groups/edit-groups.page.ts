import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-edit-groups',
  templateUrl: './edit-groups.page.html',
  styleUrls: ['./edit-groups.page.scss'],
})
export class EditGroupsPage implements OnInit {

  userInfo: any;
  nombre: any;
  cedula: any;
  email: any;
  grupos: [];
  instituto: any;


  constructor(
    private cardService: CardService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
   }

    async ngOnInit() {
      this.userInfo = this.cardService.editGroups;
      this.nombre = this.userInfo.nombre;
      this.cedula = this.userInfo.cedula;
      this.email = this.userInfo.email;
      this.grupos = this.userInfo.grupos;

      await this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(kupones => {
          this.instituto = kupones.data();
        });
      });
    }

  checkValue(event) {
    const result = event.detail.value;
    this.grupos = result;
  }

  async updateUser() {
    const loading = await this.loadingController.create();
    await loading.present();
    const path = 'Usuarios';
    this.userInfo.nombre = this.nombre;
    this.userInfo.cedula = this.cedula;
    this.userInfo.grupos = this.grupos;

    try {
      await this.authService.createUser(this.userInfo, path, this.userInfo.id);
      await loading.dismiss();
      await this.showAlert('Datos Correctos', 'Usuario Actualizado de manera exitosa');
      this.back();
    } catch (error) {
      await loading.dismiss();
      await this.showAlert('Error', 'El usuario no se ha actualizado');
      console.log(error);
      this.back();
    }
  }

  back() {
      this.modalCtrl.dismiss();
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
