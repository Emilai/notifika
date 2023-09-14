import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildActivationStart, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentials: FormGroup;
  userInfo = {
    nombre: '',
    code: undefined,
    cedula: ''
  };
  codes: any;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private lowerCase: LowerCasePipe
  ) { }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  async ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
    await(await this.authService.codes()).subscribe(userData => {
      const codeInfo = userData.data();
      this.codes = codeInfo;
  });
}

  async check() {

    const codigo = this.userInfo.code.toLowerCase();
    if( this.codes.codigo.includes(codigo) ) {
      this.register();
    } else {
      this.showAlert('Codigo erroneo', 'Por favor intente denuevo');
    }
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    const codeToLowerCase = this.userInfo.code.toLowerCase();

    const usuario = {
      id: user.user.uid,
      nombre: this.userInfo.nombre,
      email: user.user.email,
      code: codeToLowerCase,
      cedula: this.userInfo.cedula,
      grupos: ['General'],
      admin: false,
      superadmin: false
    };

    const path = 'Usuarios';
    const id = user.user.uid;
    await this.authService.createUser(usuario, path, id);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      this.showAlert('Bienvenid@ a Notifika', 'Cuenta creada con exito.');
    } else {
      this.showAlert('Registro fallido', 'Por favor intente denuevo');
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

  back() {
    this.router.navigateByUrl('/tlogin', { replaceUrl: true });
  }



}

