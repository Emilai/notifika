import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  userInfo: any;

  token: any;
  instituto: any;

  constructor(
    private pushService: PushService,
    private authService: AuthService,
    public cardService: CardService
    ) {
    this.userInfo = {
      admin: false
    };
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
          await this.pushService.topicSubscribe(this.userInfo.code);
          await this.userInfo.grupos.forEach(grupo => this.pushService.topicSubscribe(this.userInfo.code + grupo));
        });
      });
    });

    return;

  }

}
