import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';
import 'add-to-calendar-button';
import { DatePipe } from '@angular/common';
import { OrderPipe } from 'ngx-order-pipe';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  cardInfo: any;
  userInfo: any;
  controlLecturas = false;
  lectura = {
    nombre: '',
    id: '',
    cedula: '',
    fecha: ''
  };

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
        await this.firestore.collection(this.userInfo.code).doc('datos').collection('eventos').doc(this.cardInfo.id).collection('lecturas').doc(this.userInfo.id).get().subscribe((doc) => {
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
      //get users that has read this comunication
      this.cardService.getReadCom(this.userInfo.code, this.cardInfo.id).then(cards => {
        cards.subscribe(card => {
          this.lecturas = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.lecturas = this.orderPipe.transform(this.lecturas, 'fecha', false);
        });
      });

    });

    return;
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  link() {
    window.open(this.cardInfo.link, '_system');
  }

  async setRead() {
    this.lectura.nombre = this.userInfo.nombre;
    this.lectura.id = this.cardInfo.id;
    this.lectura.cedula = this.userInfo.cedula;
    this.lectura.fecha = this.date2;
    this.cardService.markAsReadEve(this.userInfo.code, this.cardInfo.id, this.userInfo.id, this.lectura);
    console.log('grabando lectura');
  }
}
