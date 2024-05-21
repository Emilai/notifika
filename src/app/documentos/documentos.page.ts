import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
})
export class DocumentosPage implements OnInit {

  instituto: any;
  userInfo: any;
  nuevoDoc: object = {};

  tituloDoc: any;
  file: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private fireStorage: AngularFireStorage
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


  async update() {

    const loading = await this.loadingController.create();
    await loading.present();
    this.nuevoDoc[this.tituloDoc] = this.file;
    if(this.file) {
      try {
        await this.cardService.createDocs(this.userInfo.code, this.nuevoDoc);
        await loading.dismiss();
        this.showAlert('Documento Cargado', '💪🏻😁');
        this.cancel();
      } catch {
        await loading.dismiss();
        this.showAlert('Hubo un error al actualizar', 'contacte a soporte@notifika.uy');
      }
    } else {
      await loading.dismiss();
      this.showAlert('No ha seleccionado un documento', 'Si es un error contacte a soporte@notifika.uy');
    }
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const loading = await this.loadingController.create();
      await loading.present();
      const path = `${this.userInfo.code}/documentos/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('URL: ', url);
      this.file = url;
      this.tituloDoc = file.name.replace(/[^\w\s_]/gi, ' ').split(' ').join(' ');
      await loading.dismiss();
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
