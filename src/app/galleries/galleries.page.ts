import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PushService } from '../services/push.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-galleries',
  templateUrl: './galleries.page.html',
  styleUrls: ['./galleries.page.scss'],
})
export class GalleriesPage implements OnInit {

  comunicado = {
    titulo: '',
    fecha: undefined,
    date: undefined,
    img: '',
    link: '',
    grupos: [],
  };

  userInfo: any;
  instituto: any;
  grupos: any;

  imgg: any;
  imgPrincipal: any;

  date = new Date();
  date2: any;

  constructor(private router: Router, private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private fireStorage: AngularFireStorage,
    private datePipe: DatePipe,
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
    return;
  }

  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  async cargarGaleria() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.comunicado.date = this.comunicado.fecha;
    this.comunicado.img = this.imgPrincipal;
    this.comunicado.link = this.imgg;
    this.comunicado.fecha = format(parseISO(this.comunicado.fecha), 'dd - MMMM - yyyy', { locale: es });
    await this.cardService.createGalery(this.userInfo.code, this.comunicado);
    await console.log(this.comunicado);
    // eslint-disable-next-line max-len
    this.comunicado.grupos.forEach(g => this.notification(this.comunicado.titulo, 'Hay una nueva Gallería disponible!', this.userInfo.code + g));
    await loading.dismiss();
    // this.kuponInfo = this.kuponInfo2;
    this.showAlert('Galeria Ingresada', 'Exito');
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

  notification(titulo, texto, grupos) {
    try {
      this.pushService.sendNotification(titulo, texto, grupos);
    } catch (err) {
      console.log(err);
    }
  }

  async onFileChangePrincipal(event: any) {
    const file = event.target.files[0];

    if (file) {
      const loading = await this.loadingController.create();
      await loading.present();
      const path = `${this.userInfo.code}/${this.date2}/principal-${file.name}`;
      const uploadTask = await this.fireStorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('URL: ', url);
      this.imgPrincipal = url;
      await loading.dismiss();
    }
  }

  async onFileChange(event: any) {
    const files = event.target.files;

    if (files) {
      const imagesUrlArray = [];
      const loading = await this.loadingController.create();
      await loading.present();
      console.log(files);

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < files.length; i++) {
        // const id = uuidv4();
        // const metadata = {
        //   contentType: 'image/jpeg'
        // };
        const path = `${this.userInfo.code}/${this.date2}/${files[i].name}`;
        const uploadTask = await this.fireStorage.upload(path, files[i]);
        const url = await uploadTask.ref.getDownloadURL();
        imagesUrlArray.push(url);
      }

      // console.log(imagesUrlArray);
      this.imgg = imagesUrlArray;
      await loading.dismiss();
    }
  }
}
