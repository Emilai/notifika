import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';


import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { parseISO } from 'date-fns';

@Component({
  selector: 'app-editprogrammed',
  templateUrl: './editprogrammed.page.html',
  styleUrls: ['./editprogrammed.page.scss'],
})
export class EditprogrammedPage implements OnInit {

  public editor = ClassicEditor;

  titulo: '';
  fecha: undefined;
  fechaCheck: undefined;
  date: undefined;
  contenido: '';
  img: '';
  link: '';
  grupos: [];
  id: '';
  notId: '';

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

  fechaSelect = undefined;

  userInfo: any;
  instituto: any;
  imgg: any;
  programar = false;

  date2: any;
  disableDate = undefined;

  constructor(private router: Router,
    private modalCtrl: ModalController,
    private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  async ngOnInit() {

    this.titulo = this.cardService.programmed.titulo;
    this.fecha = this.cardService.programmed.fecha;
    this.fechaCheck = this.cardService.programmed.fechaCheck;
    this.date = this.cardService.programmed.date;
    this.contenido = this.cardService.programmed.contenido;
    this.img = this.cardService.programmed.img;
    this.link = this.cardService.programmed.link;
    this.grupos = this.cardService.programmed.grupos;
    this.id = this.cardService.programmed.id;
    this.notId = this.cardService.programmed.notId;


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
    this.modalCtrl.dismiss();
  }

  async cargarComunicado() {

    this.comunicado.titulo = this.titulo;
    this.comunicado.fecha = this.fecha;
    this.comunicado.fechaCheck = this.fechaCheck;
    this.comunicado.date = this.date;
    this.comunicado.contenido = this.contenido;
    this.comunicado.img = this.img;
    this.comunicado.link = this.link;
    this.comunicado.grupos = this.grupos;
    this.comunicado.id = this.id;
    this.comunicado.notId = this.notId;

    const loading = await this.loadingController.create();
    await loading.present();

    this.cardService.createCom(this.userInfo.code, this.comunicado, this.comunicado.id);

    await loading.dismiss();
    this.showAlert('Comunicado Actualizado', 'Exito');
    this.back();

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
