import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-galleryload',
  templateUrl: './galleryload.page.html',
  styleUrls: ['./galleryload.page.scss'],
})
export class GalleryloadPage implements OnInit {
  comunicado = {
    titulo: '',
    carpeta: '',
    grupos: '',
  };

  userInfo: any;
  instituto: any;
  grupos: any;

  constructor(private router: Router, private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController) {
  }

  async ngOnInit() {


    (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(kupones => {
          this.instituto = kupones.data();
          // this.instituto = this.instituto.sort((a, b) => b.date - a.date);
        });
      });
    });
    return;
  }

  back() {
    this.router.navigateByUrl('/tabs', {
      replaceUrl: true
    }
    );
  }

  async cargarGaleria() {
    const loading = await this.loadingController.create();
    await loading.present();
    await this.cardService.uploadGalery(this.userInfo.code, this.comunicado);
    await loading.dismiss();
    this.showAlert('Galeria Ingresada', 'Podrá verla en las próximas 24 horas');
    this.router.navigateByUrl('/tabs/tab2', {
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

  print() {
    console.log(this.comunicado);
  }

  checkValue(event) {
    const result = event.detail.value;
    this.comunicado.grupos = result;
  }

  load(link) {
    window.open(link, '_system');
  }
}
