import { Component, OnInit } from '@angular/core';
import { CardService } from '../services/card.service';
import { AuthService } from '../services/auth.service';
import { OrderModule, OrderPipe } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-programmed',
  templateUrl: './programmed.page.html',
  styleUrls: ['./programmed.page.scss'],
})
export class ProgrammedPage implements OnInit {

  programmed: any;
  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;

  constructor(
    public cardService: CardService,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe,
    public datePipe: DatePipe
  ) {
   }

  async ngOnInit() {
    this.user = this.authService.auth.currentUser;
    await (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.userGroups = this.userInfo.grupos;
      this.cardService.getProgrammedComunic(this.userInfo.code, this.userInfo.grupos).then(cards => {
        cards.subscribe(card => {
          this.cards = card.map(cardRef => {
            const data = cardRef.payload.doc.data();
            return data;
          });
          this.cards = this.orderPipe.transform(this.cards, 'date', true);

        });
      });
      return userInfo;
    });
  }

}
