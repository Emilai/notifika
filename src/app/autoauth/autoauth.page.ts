/* eslint-disable object-shorthand */
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-autoauth',
  templateUrl: './autoauth.page.html',
  styleUrls: ['./autoauth.page.scss'],
})
export class AutoauthPage implements OnInit {

  userInfo = {
    nombre: '',
    code: undefined,
    cedula: '',
  };

  credentials = {
    uid: '',
    email: '',
    password: undefined
  };

  usersToLoad: any;
  cantidad = 0;

  infoUrl = 'assets/loadusers.json';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    public cardService: CardService
  ) {
    this.getUsers().subscribe(async data => {
      console.log('Datos: ',data);
      if (typeof data === 'object' && data !== null) {
        this.usersToLoad = Object.values(data);;
        this.cantidad = Object.keys(data).length;
        this.performTaskBasedOnCantidad();
      } else {
        console.error('Los datos no son un objeto:', data);
      }
    });
   }

  async ngOnInit() {
  }

  getUsers(): Observable<any> {
    return this.http.get(this.infoUrl);
  }

  checkUsers() {
    console.log(this.usersToLoad);
  }

  performTaskBasedOnCantidad() {
    console.log('La cantidad de usuarios a cargar es:', this.cantidad);
  }


  async register() {
    const usuarios = this.usersToLoad;

    if (Array.isArray(usuarios)) {
      console.log('Es un array');

      for (const usuario of usuarios) {
        if (usuario) {
          console.log(usuario.name); // Lógica de registro y creación del objeto en la base de datos por cada usuario.
          this.credentials.email = usuario.mail;
          this.credentials.password = usuario.password;

          const user = await this.authService.register(this.credentials);

          if (user) {
            console.log('Usuario registrado: ', usuario.mail);
            await this.registerInDB(user.user.uid, usuario.name, usuario.mail, usuario.code, usuario.cedula);
          }
        }
      }
    } else {
      console.log('No es un Array');
    }
  }

  async registerInDB(uid, name, mail, code, cedula) {
    const usuarioFinal = {
      id: uid,
      nombre: name,
      email: mail,
      code: code,
      cedula: cedula,
      grupos: ['General'],
      admin: false,
      superadmin: false
    };

    const path = 'Usuarios';

    try {
      await this.authService.createUser(usuarioFinal, path, uid);
    } catch (e) {
      console.log('Error: ', e);
    }
  }


}
