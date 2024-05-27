import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { CardService } from '../services/card.service';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  userInfo: any;
  activeUser = {
    nombre: '',
    id: '',
    cedula: '',
    fecha: ''
  };

  date = new Date();
  date2: any;
  selectedSegment = 'comunicados';

  comCount = 0;
  galCount = 0;
  eveCount = 0;
  totalCount = 0;

  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private datePipe: DatePipe,
    private cardService: CardService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  async ngOnInit() {


    this.date2 = await this.datePipe.transform(this.date, 'yyyy-MM-dd | HH:mm');

    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;

      //Check if the user is registered as ACTIVE
      try {
        // eslint-disable-next-line max-len
        await this.firestore.collection(this.userInfo.code).doc('datos').collection('activeUsers').doc(this.userInfo.id).get().subscribe((doc) => {
          if (doc.exists) {
            console.log('User is Active in this Account');
          } else {
            this.setRead();
            console.log('Usuario Activo Grabado');
          }
        });
      } catch (error) {
        console.log('error:', error);
      }
    });
    this.subscription = this.cardService.myVariable$.subscribe(value => {
      this.comCount = value;
      this.updateTotalCount();
    });

    this.subscription2 = this.cardService.myVariable2$.subscribe(value => {
      this.galCount = value;
      this.updateTotalCount();
    });

    this.subscription3 = this.cardService.myVariable3$.subscribe(value => {
      this.eveCount = value;
      this.updateTotalCount();
    });
    return;
  }

  async setRead() {
    this.activeUser.nombre = this.userInfo.nombre;
    this.activeUser.id = this.userInfo.id;
    this.activeUser.cedula = this.userInfo.cedula;
    this.activeUser.fecha = this.date2;
    this.cardService.markActiveUser(this.userInfo.code, this.userInfo.id, this.activeUser);
    console.log('grabando lectura');
  }
  private updateTotalCount() {
    this.totalCount = this.comCount + this.galCount + this.eveCount;
  }


}
