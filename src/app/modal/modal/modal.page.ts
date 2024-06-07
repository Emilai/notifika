/* eslint-disable @typescript-eslint/type-annotation-spacing */
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController } from '@ionic/angular';
import { OrderPipe } from 'ngx-order-pipe';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  userInfo: any;
  cardInfo: any;
  content = true;
  controlLecturas = false;
  lectura = {
    nombre: '',
    id: '',
    cedula: '',
    fecha: ''
  };
  order = true;
  date = new Date();
  date2: any;
  lecturas: any;
  docIsRead = undefined;
  fecha: any;


  constructor(private modalCtrl: ModalController,
    private datePipe: DatePipe,
    private cardService: CardService,
    private orderPipe: OrderPipe,
    private firestore: AngularFirestore,
    private loadingController: LoadingController,
    private authService: AuthService) { }

  async ngOnInit() {
    this.cardInfo = this.cardService.cardInfo;
    this.date2 = await this.datePipe.transform(this.date, 'yyyy-MM-dd | HH:mm');

    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;

      //Check if document has been read by user
      try {
        // eslint-disable-next-line max-len
        await this.firestore.collection(this.userInfo.code).doc('datos').collection('comunicados').doc(this.cardInfo.id).collection('lecturas').doc(this.userInfo.id).get().subscribe((doc) => {
          if (doc.exists) {
            this.docIsRead = true;
            // console.log('Document data:', doc.data());
          } else {
            this.docIsRead = false;
            this.setRead();
            console.log('Lectura de documento Grabado');
          }
        });
      } catch (error) {
        console.log('error:', error);
        this.docIsRead = false;
      }
      });

    return;

  }

  salir() {
    this.modalCtrl.dismiss();
  }

  link() {
    window.open(this.cardInfo.link, '_system');
  }

async controlLect() {
  if (!this.lecturas) {
    if (this.userInfo.superadmin === true) {
      const loading = await this.loadingController.create();
      await loading.present();
      await this.cardService.getReadCom(this.userInfo.code, this.cardInfo.id).then(cards => {
        cards.subscribe(async card => {
          this.lecturas = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.lecturas = this.orderPipe.transform(this.lecturas, 'fecha', false);
          await loading.dismiss();
        });
      });
    } else {
      console.log('No admin User, no lectures display');
    }
  }
  this.content = !this.content;
  this.controlLecturas = !this.controlLecturas;
}

  toModal() {
    this.controlLecturas = !this.controlLecturas;
    this.content = !this.content;
  }

  async setRead() {
      this.lectura.nombre = this.userInfo.nombre;
      this.lectura.id = this.cardInfo.id;
      this.lectura.cedula = this.userInfo.cedula;
      this.lectura.fecha = this.date2;
      this.cardService.markAsRead(this.userInfo.code, this.cardInfo.id, this.userInfo.id, this.lectura);
      console.log('grabando lectura');
}

  async checkRead() {
    await this.cardService.checkReadCom(this.userInfo.code, this.cardInfo.id, this.userInfo.id);
  }

  exportarLecturas() {
    const element = document.getElementById('excel-table');
    const name = this.cardInfo.id + '.xlsx';
    const ws:XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    console.log(this.lecturas);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, name);
  }

  orden() {
    this.order = !this.order;
    this.lecturas = this.orderPipe.transform(this.lecturas, 'fecha', !this.order);
  }
}

