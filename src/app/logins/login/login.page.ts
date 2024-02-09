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

  toggleShow() {
    this.hide = !this.hide;
  }
}
