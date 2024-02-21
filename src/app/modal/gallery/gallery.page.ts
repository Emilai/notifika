import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage implements OnInit {

  galleryInfo: any;
  cardImgs: any;
  imagenes: any;
  userInfo: any;
  cardInfo: any;
  date = new Date();
  date2: any;
  lecturas: any;
  docIsRead = undefined;
  fecha: any;

  lectura = {
    nombre: '',
    id: '',
    cedula: '',
    fecha: ''
  };

  constructor(
    private modalCtrl: ModalController,
    private cardService: CardService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private orderPipe: OrderPipe) { }

  // async ngOnInit() {
  //   this.galleryInfo = this.cardService.gallery;
  // }

  async ngOnInit() {
    this.galleryInfo = this.cardService.gallery;
    this.cardInfo = this.cardService.gallery;
    this.date2 = await this.datePipe.transform(this.date, 'yyyy-MM-dd | HH:mm');

    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;

      //Check if document has been read by user
      try {
        // eslint-disable-next-line max-len
        await this.firestore.collection(this.userInfo.code).doc('datos').collection('galerias').doc(this.cardInfo.id).collection('lecturas').doc(this.userInfo.id).get().subscribe((doc) => {
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

  async setRead() {
    this.lectura.nombre = this.userInfo.nombre;
    this.lectura.id = this.cardInfo.id;
    this.lectura.cedula = this.userInfo.cedula;
    this.lectura.fecha = this.date2;
    this.cardService.markAsReadGal(this.userInfo.code, this.cardInfo.id, this.userInfo.id, this.lectura);
    console.log('grabando lectura');
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  openImg(link) {
    window.open(link, '_system');
  }
}
