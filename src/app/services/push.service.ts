/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/quotes */
import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  tok: any;

  constructor(private httpClient: HttpClient ) {
  }


 async configuracionInicialPush() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    await PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        console.log('no hay permiso para notificaciones');
      }
    });

    // On success, we should be able to receive notifications
    await PushNotifications.addListener('registration',
      async (token: Token) => {
        await console.log('Push registration success, token: ' + token.value);
        this.tok = token.value;
      }
    );

    // Some issue with our setup and push will not work
    await PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    await PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert(JSON.stringify(notification.title + ' - ' + notification.body));
      }
    );

    // Method called when tapping on a notification
    await PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );

  }

  async topicSubscribe(top) {

    FCM.subscribeTo({ topic: top })
      .then((r) => console.log(`subscribed to topic: `+ top))
      .catch((err) => console.log(err));
  }

sendNotification(titulo, texto, grupos) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // eslint-disable-next-line max-len
  myHeaders.append("Authorization", "key=AAAAmi4uyEM:APA91bHisJaXzBC0q4QYJ4DA-H039IcNjwPHZ-huz0fo6sFH-lgm3PAo-ZsQR0J32b09JXKJxgXas_9D2Mxh3Q-i4uEcxFqNm2HZ19QYCdMHd_dfvKC1vFaBDhYaDeccJKOwxs39Y5FU");

  const raw = JSON.stringify({
      "notification": {
        "title": titulo,
        "body": texto
      },
      "condition": `'${grupos}' in topics`
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  };

  fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));


}


}

