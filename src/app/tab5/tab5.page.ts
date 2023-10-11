import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgrammedPage } from '../programmed/programmed.page';
import { AlertController, ModalController } from '@ionic/angular';
import { CardService } from '../services/card.service';
import { AuthService } from '../services/auth.service';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {


  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;

  constructor(
    private router: Router,
    public cardService: CardService,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe,
    public datePipe: DatePipe
  ) { }

  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await(await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      return userInfo;
    });
  }

  comunicado() {
    this.router.navigateByUrl('/comunicado', {
      replaceUrl: true
    }
    );
  }

  galery() {
    this.router.navigateByUrl('/galleries', {
      replaceUrl: true
    }
    );
  }

  evento() {
    this.router.navigateByUrl('/evento', {
      replaceUrl: true
    }
    );
  }

  comunicadoProg() {
    this.router.navigateByUrl('/programmed', {
      replaceUrl: true
    }
    );
  }

  galeryProg() {
    this.router.navigateByUrl('/programmed-gallery', {
      replaceUrl: true
    }
    );
  }

  eventoProg() {
    this.router.navigateByUrl('/programmed-events', {
      replaceUrl: true
    }
    );
  }

  async mostrarModal() {

    const modal = await this.modalCtrl.create({
      component: ProgrammedPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    await modal.present();
  }
}
