import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  comunicado = {
    titulo: '',
    fecha: undefined,
    date: undefined,
    contenido: '',
    img: '',
    link: '',
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

  async cargarComunicado() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.comunicado.date = this.comunicado.fecha;
    this.comunicado.fecha = format(parseISO(this.comunicado.fecha), 'dd - MMMM - yyyy', { locale: es });
    await this.cardService.createEvent(this.userInfo.code, this.comunicado);
    await console.log(this.comunicado);
    await loading.dismiss();
    // this.kuponInfo = this.kuponInfo2;
    this.showAlert('Evento Ingresado', 'Exito');
    this.router.navigateByUrl('/tabs/tab3', {
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

}
