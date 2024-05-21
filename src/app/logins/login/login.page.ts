import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  forgetEmail = '';
  forgetBox = false;
  cedula: any;
  userDoc: any;
  mail = '';
  credentials2 = {
    email: '',
    password: ''
  };
  toggleMail = false;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async getUser(cedula) {
    const docNumber = cedula.toString();
    try {
      const userDocs: any[] = await this.authService.getUserByDoc(docNumber);
      if (userDocs && userDocs.length === 1) {
        userDocs.forEach(user => {
          const userEmail = user.email;
          console.log(userEmail);
          this.credentials2.email = userEmail;
          console.log(this.credentials2);
          this.login2();
        });
      } else {
        this.showAlert('No se encuentra numero de Docuemento', 'Por favor intente denuevo o escriba a Soporte');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async register() {
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } else {
      this.showAlert('Cuenta Invalida', 'Por favor intente denuevo');
    }
  }

  async login2() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials2);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } else {
      this.showAlert('Cuenta Invalida', 'Por favor intente denuevo');
    }
  }

  passwordReset() {
    this.forgetBox = !this.forgetBox;
  }

  wppReset() {
    this.showAlert2('Solicitará la recuperación de su cuenta por Whatsapp', 'Desea hacerlo?');
  }

  soporte() {
    this.showAlert2('Solicitará ayuda de Soporte por Whatsapp', 'Desea hacerlo?');
  }

  async forgotPassword(email) {
    try {
      await this.authService.forgotPass(email);
      this.showAlert('Mail de reseteo de Password enviado', 'Checkea tu email');
      this.forgetBox = !this.forgetBox;

    } catch (err) {
      console.log('error> ', err);
      this.showAlert('Usuario Incorrecto', 'Checkea tu email');
    }
  }


  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showAlert2(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          window.location.href = `https://api.whatsapp.com/send?phone=+59891998256&text=Necesito%20ayuda%20del%20soporte%20de%20Notifika.`;;
          // this.authService.deleteAuthData();
        }
      }]
    });
    await alert.present();
  }

  toggleShow() {
    this.hide = !this.hide;
  }
}
