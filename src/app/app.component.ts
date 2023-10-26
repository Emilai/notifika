import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { initializeApp } from 'firebase/app';
import { indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { PushService } from './services/push.service';
import { Badge } from '@capawesome/capacitor-badge';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'angular';
  public editor = ClassicEditor;

  constructor( private pushService: PushService) {
    const app = initializeApp(environment.firebase);
    if (Capacitor.isNativePlatform) {
      initializeAuth(app, {
        persistence: indexedDBLocalPersistence
      });
    }
    this.pushService.configuracionInicialPush();

  }
}
