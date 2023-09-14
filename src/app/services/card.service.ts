/* eslint-disable max-len */
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class CardService {
  comunica: any;
  gallery: any;
  events: any;
  instInfo: any;
  userInfo: any;
  cardInfo: any;
  code: any;
  myDate = new Date();
  currentDate: any;
  imgs: any;
  editGroups: any;
  lecturas: any;
  docExists = false;

  constructor(private http: HttpClient,
    private firestore: AngularFirestore,
    public authService: AuthService, private datePipe: DatePipe,
    private hhtp: HttpClient) {
    this.currentDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd-HH:mm:ss');
}


  getCards() {
    return this.http.get('../../assets/cards.json');
  }

  async getComunic(code, grupos) {
    // console.log(this.code);
    try {
      const comunicados = await this.firestore.collection(code).doc('datos').collection('comunicados', ref => ref.where('grupos', 'array-contains-any', grupos));
      this.comunica = comunicados;
      return comunicados.snapshotChanges();


    } catch (error) {
      console.log(error);
    }
  }

  async getInstitution(colection) {
    try {
      return await this.firestore.collection(colection).doc('datos').get();

    } catch (error) {
      console.log(error);
    }
  };

  async getEvent(code, grupos) {
    // console.log(this.code);
    try {
      const events = await this.firestore.collection(code).doc('datos').collection('eventos', ref => ref.where('grupos', 'array-contains-any', grupos));
      this.events = events;
      return events.snapshotChanges();


    } catch (error) {
      console.log(error);
    }
  }

  async getGalleries(colection, grupos) {
    try {
      const galerias = await this.firestore.collection(colection).doc('datos').collection('galerias', ref => ref.where('grupos', 'array-contains-any', grupos));
      this.gallery = galerias;
      return galerias.snapshotChanges();


    } catch (error) {
      console.log(error);
    }
  };

  async getGallery(id) {
    try {
      // eslint-disable-next-line max-len
      const galeria = await this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=8fe1c1df3f4a97466d5ef831f439a724&photoset_id=${id}&user_id=196349182%40N08&extras=url_m&format=json&nojsoncallback=1`);

      return galeria;


    } catch (error) {
      console.log(error);
    }
  }

  createCom(collection, data, id) {
    this.firestore.collection(collection).doc('datos').collection('comunicados').doc(id).set(data);
  }

  createEvent(collection, data) {
    this.firestore.collection(collection).doc('datos').collection('eventos').doc().set(data);
  }

  createGalery(collection, data) {
    this.firestore.collection(collection).doc('datos').collection('galerias').doc().set(data);
  }

  uploadGalery(collection, data) {
    this.firestore.collection(collection).doc('datos').collection('galleryToUpload').doc().set(data);
  }

  markAsRead(collection, id, user, data) {
    this.firestore.collection(collection).doc('datos').collection('comunicados').doc(id).collection('lecturas').doc(user).set(data);
  }

  async getCompanyUsers(code) {
    // console.log(this.code);
    try {
      const events = await this.firestore.collection('Usuarios', ref => ref.where('code', '==', code));
      this.events = events;
      return events.snapshotChanges();


    } catch (error) {
      console.log(error);
    }
  }

  async getReadCom(collection, id) {
    // console.log(this.code);
    try {
      const lecturas = await this.firestore.collection(collection).doc('datos').collection('comunicados').doc(id).collection('lecturas');
      this.lecturas = lecturas;
      return lecturas.snapshotChanges();


    } catch (error) {
      console.log(error);
    }
  }

  async checkReadCom(collection, id, userId) {
    try {
      this.firestore.collection(collection).doc('datos').collection('comunicados').doc(id).collection('lecturas').doc(userId).get().subscribe((doc) => {
        if (doc.exists) {
          this.docExists = true;
          // console.log('Document data:', doc.data());
          return doc.data();
        } else {
          // doc.data() will be undefined in this case
          this.docExists = false;
          // console.log('No such document!');
          return doc.data();

        }
      });
    } catch (error) {
      console.log('error:' ,error);
      this.docExists = false;
    }
  }
}
