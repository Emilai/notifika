import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-recibos',
  templateUrl: './recibos.page.html',
  styleUrls: ['./recibos.page.scss'],
})
export class RecibosPage implements OnInit {

  cedula: any;
  recibos: any[] = [];
  empresa: any;
  dataEmpresa: any;
  documentos: object;
  fym: any;
  selectedSegment = 'recibos';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private cardService: CardService
  ) { }

  async ngOnInit() {
    this.cedula = this.authService.cedula;
    this.empresa = this.authService.code;
    this.fym = this.authService.fym;

    try {
      const promises = this.fym.map(async element => {
        const path = `${this.empresa}/recibos/${element}/${this.cedula}.pdf`;
        const ref = this.fireStorage.ref(path);

        try {
          await ref.getMetadata().toPromise();

          const url = await ref.getDownloadURL().toPromise();

          this.recibos.push({ mes: element, link: url });
        } catch (error) {
          console.error('Error obteniendo el documento:', error);
        }
      });

      await Promise.all(promises);
      this.recibos.sort((a, b) => new Date(b.mes).getTime() - new Date(a.mes).getTime());
    } catch (error) {
      console.error('Error:', error);
    }

    try{
      const empresa: any = await this.cardService.getInstitution(this.empresa).then(inst => {
        inst.subscribe(kupones => {
          this.dataEmpresa = kupones.data();
          if (this.dataEmpresa.documentos !== undefined) {
            this.documentos = this.dataEmpresa.documentos;
          }
          console.log(this.documentos);
        });
      });;
    } catch(e) {
      console.log(e);
    }
  }


  salir() {
    this.modalCtrl.dismiss();
  }

  onClick(url) {
    window.open(url);
  }

}
