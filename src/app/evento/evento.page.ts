import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PushService } from '../services/push.service';
import { DatePipe } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.page.html',
  styleUrls: ['./evento.page.scss'],
})
export class EventoPage implements OnInit {

  public editor = ClassicEditor;

  comunicado = {
    titulo: '',
    fecha: undefined,
    fechaCheck: undefined,
    date: undefined,
    contenido: '',
    img: '',
    link: '',
    grupos: [],
    id: '',
    notId: ''
  };

  userInfo: any;
  instituto: any;
  grupos: any;
  fechaSelect: undefined;
  fecha = new Date();

  programar = false;

  notificationCom = {
    titulo: '',
    contenido: '',
    body: 'Hay un nuevo Evento!',
    empresa: '',
    grupos: [],
    fecha: undefined,
    sent: false,
    cancel: false,
    notId: ''
  };

  imgg: any;
  disableDate = undefined;
  date = new Date();
  date2: any;

  constructor(private router: Router, private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private datePipe: DatePipe,
    private fireStorage: AngularFireStorage,
    private pushService: PushService) {
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
    this.date2 = this.datePipe.transform(this.date, 'yyyy-MM-dd-HH-mm-ss');
    this.disableDate = this.datePipe.transform(this.fecha, 'yyyy-MM-ddTHH:mm:ss');
    return;
  }

  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  async cargarComunicado() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.comunicado.img = this.imgg;

    if (this.programar === true) {
      this.comunicado.date = this.datePipe.transform(this.fechaSelect, 'yyyy-MM-dd-HH:mm:ss');
      this.comunicado.fechaCheck = parseISO(this.fechaSelect);
      this.comunicado.fecha = format(new Date(this.fechaSelect), 'dd - MMMM - yyyy', { locale: es });
      const numId = Math.random() * 1000;
      this.comunicado.notId = this.comunicado.date + '--' + this.userInfo.code + '--' + numId;
      this.notificationCom.notId = this.comunicado.notId;
    } else {
      this.comunicado.date = this.datePipe.transform(this.fecha, 'yyyy-MM-dd-HH:mm:ss');
      this.comunicado.fechaCheck = this.fecha;
      this.comunicado.fecha = format(new Date(this.fecha), 'dd - MMMM - yyyy', { locale: es });
      const numId = Math.random() * 1000;
      this.comunicado.notId = this.comunicado.date + '--' + this.userInfo.code + '--' + numId;
      this.notificationCom.notId = this.comunicado.notId;
    }

    await this.cardService.createEvent(this.userInfo.code, this.comunicado);

    this.notificationCom.titulo = this.comunicado.titulo;
    this.notificationCom.contenido = this.comunicado.contenido;
    this.notificationCom.fecha = this.comunicado.fechaCheck;
    this.notificationCom.empresa = this.userInfo.code;

    this.comunicado.grupos.forEach(async g => {
      this.notificationCom.grupos = this.userInfo.code + g;
      await this.scheduleNotification('notificacionesPendientes', this.notificationCom);
    });
    // this.kuponInfo = this.kuponInfo2;
    await loading.dismiss();
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

  // notification(titulo, texto, grupos) {
  //   try {
  //     this.pushService.sendNotification(titulo, texto, grupos);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const loading = await this.loadingController.create();
      await loading.present();
      const path = `${this.userInfo.code}/${this.date2}/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('URL: ', url);
      this.imgg = url;
      await loading.dismiss();
    }
  }

  async scheduleNotification(col, data) {
    this.cardService.scheduleNotification(col, data);
  }
}
