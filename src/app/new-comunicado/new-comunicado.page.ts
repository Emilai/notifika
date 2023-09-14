import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PushService } from '../services/push.service';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Component({
  selector: 'app-new-comunicado',
  templateUrl: './new-comunicado.page.html',
  styleUrls: ['./new-comunicado.page.scss'],
})
export class NewComunicadoPage implements OnInit {

  public editor = ClassicEditor;

  comunicado = {
    titulo: '',
    fecha: undefined,
    date: undefined,
    contenido: '',
    img: '',
    link: '',
    grupos: [],
    id: ''
  };
  fecha = new Date();

  userInfo: any;
  instituto: any;
  grupos: any;
  imgg: any;

  date = new Date();
  date2: any;
  id: any;

  constructor(private router: Router,
    private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private fireStorage: AngularFireStorage,
    private datePipe: DatePipe,
    private pushService: PushService) {
    this.comunicado.date = this.datePipe.transform(this.fecha, 'yyyy-MM-dd-HH:mm:ss');
    }

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
      this.id = this.userInfo.code + '-' + this.datePipe.transform(this.date, 'yyyy-MM-dd-HH-mm-ss');
    });
    this.date2 = this.datePipe.transform(this.date, 'yyyy-MM-dd-HH-mm-ss');

    return;
  }

  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  async cargarComunicado(){
    const loading = await this.loadingController.create();
    await loading.present();
    this.comunicado.img = this.imgg;
    this.comunicado.id = this.id;
    this.comunicado.fecha = format(parseISO(this.comunicado.fecha), 'dd - MMMM - yyyy', { locale: es });
    await this.cardService.createCom(this.userInfo.code, this.comunicado, this.id);
    this.comunicado.grupos.forEach(g => this.notification(this.comunicado.titulo, 'Hay un nuevo Comunicado!', this.userInfo.code + g));
    await loading.dismiss();
    this.showAlert('Comunicado Ingresado', 'Exito');
    this.router.navigateByUrl('/tabs/tab1', {
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
    console.log(this.comunicado.fecha);
  }

  checkValue(event){
    const result = event.detail.value;
    this.comunicado.grupos = result;
    console.log(this.comunicado.grupos);
  }

  notification(titulo, texto, grupos) {
    try {
      this.pushService.sendNotification(titulo, texto, grupos);
    } catch (err) {
      console.log(err);
    }
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const loading = await this.loadingController.create();
      await loading.present();
      const path = `${this.userInfo.code}/${this.date2}/${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('URL: ',url);
      this.imgg = url;
      await loading.dismiss();
    }
  }
}
