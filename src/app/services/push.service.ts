import { Injectable } from '@angular/core';
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor( private oneSignal: OneSignal) { }

  configuracionInicial() {

    this.oneSignal.startInit('15b03043-a635-404a-b8d6-b407964e8a4a', '662199781443');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe(() => {
      // do something when notification is received
    });

    this.oneSignal.handleNotificationOpened().subscribe(() => {
      // do something when a notification is opened
    });

    this.oneSignal.endInit();
  }
}
