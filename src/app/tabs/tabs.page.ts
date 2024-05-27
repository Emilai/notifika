import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';
import { CardService } from '../services/card.service';
import { Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { AlertController, ModalController } from '@ionic/angular';
import { RecibosPage } from '../modal/recibos/recibos.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {
  userInfo: any;

  token: any;
  instituto: any;
  comCount: any;
  galCount: any;
  eveCount: any;
  totalCount: any;
  private subscription: Subscription;
  private subscription2: Subscription;
  private subscription3: Subscription;


  constructor(
    private pushService: PushService,
    private authService: AuthService,
    private cardService: CardService,
    public modalCtrl: ModalController,
    private alertController: AlertController
    ) {
    this.userInfo = {
      admin: false
    };
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
  }

  async ngOnInit() {
    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      // await this.pushService.configuracionInicialPush();
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(async kupones => {
          this.instituto = kupones.data();
          // console.log('Instituto: ', this.instituto.grupos);
          await this.instituto.grupos.forEach(grupo => this.pushService.topicUnSubscribe(this.userInfo.code + grupo));
          //Hascer el unsuscribe from previous topics
          await this.pushService.topicSubscribe(this.userInfo.code);
          await this.userInfo.grupos.forEach(grupo => this.pushService.topicSubscribe(this.userInfo.code + grupo));
        });
      });
    });

    // this.subscription = this.cardService.myVariable$.subscribe(value => {
    //   this.comCount = value;
    // });
    // this.subscription2 = this.cardService.myVariable2$.subscribe(value => {
    //   this.galCount = value;
    // });
    // this.subscription3 = this.cardService.myVariable3$.subscribe(value => {
    //   this.eveCount = value;
    // });
    this.subscription = combineLatest([
      this.cardService.myVariable$,
      this.cardService.myVariable2$,
      this.cardService.myVariable3$
    ]).subscribe(([value1, value2, value3]) => {
      this.comCount = value1;
      this.galCount = value2;
      this.eveCount = value3;

      // Calculate the total count as the sum of the three values
      this.totalCount = this.comCount + this.galCount + this.eveCount;
    });
    return;
  }

  async mostrarRecibos(cedula, fym, code) {
    const modal = await this.modalCtrl.create({
      component: RecibosPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    this.authService.cedula = cedula;
    this.authService.fym = fym;
    this.authService.code = code;
    await modal.present();
  }

  recibosError() {
    this.showAlert('Sin Documentos Disponibles','No se han encontrado documentos compartidos por la empresa en su cuenta.');
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
