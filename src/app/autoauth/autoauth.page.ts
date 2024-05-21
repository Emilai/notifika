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

  lecturesToLoad: any;
  cantidadlecturas = 0;

  usersToDelete: any;
  cantidadUsersToDelete = 0;

  infoUrl = 'assets/loadusers.json';
  testingLectures = 'assets/lecturas.json';
  usersToDeleteList = 'assets/deleteusers.json';

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

    this.getLectures().subscribe(async data => {
      console.log('Datos: ', data);
      if (typeof data === 'object' && data !== null) {
        this.lecturesToLoad = Object.values(data);;
        this.cantidadlecturas = Object.keys(data).length;
        this.performTaskBasedOnCantidad2();
      } else {
        console.error('Los datos no son un objeto:', data);
      }
    });

    this.getUsersToDelete().subscribe(async data => {
      console.log('Datos: ', data);
      if (typeof data === 'object' && data !== null) {
        this.usersToDelete = Object.values(data);;
        console.log(this.usersToDelete);
        this.cantidadUsersToDelete = Object.keys(data).length;
        this.performTaskBasedOnCantidad3();
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

  getLectures(): Observable<any> {
    return this.http.get(this.testingLectures);
  }
  getUsersToDelete(): Observable<any> {
    return this.http.get(this.usersToDeleteList);
  }

  checkUsers() {
    console.log(this.usersToLoad);
  }

  performTaskBasedOnCantidad() {
    console.log('La cantidad de usuarios a cargar es:', this.cantidad);
  }
  performTaskBasedOnCantidad2() {
    console.log('La cantidad de lecturas a cargar es:', this.cantidadlecturas);
  }
  performTaskBasedOnCantidad3() {
    console.log('La cantidad de usuarios a eliminar es:', this.cantidadUsersToDelete);
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
            await this.registerInDB(user.user.uid, usuario.name, usuario.mail, usuario.code, usuario.cedula, usuario.grupos);
          }
        }
      }
    } else {
      console.log('No es un Array');
    }
  }

  async registerInDB(uid, name, mail, code, cedula, grupos) {

    const gruposArray = grupos.split(',').map(group => group.trim());
    const usuarioFinal = {
      id: uid,
      nombre: name,
      email: mail,
      code: code,
      cedula: cedula,
      grupos: gruposArray,
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

  async deleteUsers() {
    const users = this.usersToDelete;
    console.log(users);

    if (Array.isArray(users)) {
      console.log('Es un array');

      for (const user of users) {
        if (user) {
          const email = user.email;
          const userToDelete: any = (await this.authService.getUsersToDelete(email)).docs[0].data();
          console.log(userToDelete);
          await this.authService.deleteUser(userToDelete.id);
        }
      }
    } else {
      console.log('usersToDelete No es un Array');
    }
  }

  async registerLectureInDB(cedula, fecha, id, nombre) {

    const lectura = {
      id: id,
      nombre: nombre,
      fecha: fecha,
      cedula: cedula,
    };

    try {
      await this.cardService.markAsRead('test2023', id, cedula, lectura);
      console.log('Registrado: ', cedula);
    } catch (e) {
      console.log('Error: ', e);
    }
  }

  async registerLectures() {
    const lecturas = this.lecturesToLoad;

    if (Array.isArray(lecturas)) {
      console.log('Es un array');

      for (const lectura of lecturas) {
        if (lectura) {
          await this.registerLectureInDB(lectura.cedula, lectura.fecha, lectura.id, lectura.nombre);
        }
      }
    } else {
      console.log('No es un Array');
    }
  }

  async register2() {
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
            await this.registerInDB(user.user.uid, usuario.name, usuario.mail, usuario.code, usuario.cedula, usuario.grupos);
          } else {
            console.log('Usuario ya existe: ', usuario.mail);
            try{
              const user2: any = await this.authService.getUserByDoc(usuario.cedula);
              await this.registerInDB2(user2[0].id, usuario.grupos);
            } catch(e) {
              console.log(e);
            }
          }
        }
      }
    } else {
      console.log('No es un Array');
    }
  }

  async registerInDB2(uid, grupos) {

    const gruposArray = grupos.split(',').map(group => group.trim());
    const usuarioFinal = {
      id: uid,
      grupos: gruposArray,
    };

    const path = 'Usuarios';

    try {
      await this.authService.updateUser(path, uid, gruposArray);
    } catch (e) {
      console.log('Error: ', e);
    }
  }


}
