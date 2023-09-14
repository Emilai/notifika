import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PushService } from '../services/push.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  userInfo: any;

  token: any;

  constructor(private pushService: PushService, private authService: AuthService) {
    this.userInfo = {
      admin: false
    };
  }

  async ngOnInit() {
    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      // await this.pushService.configuracionInicialPush();
      await this.pushService.topicSubscribe(this.userInfo.code);
      await this.userInfo.grupos.forEach(grupo => this.pushService.topicSubscribe(this.userInfo.code + grupo));
    });
    return;

  }

}
