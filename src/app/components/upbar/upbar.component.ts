import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';

@Component({
  selector: 'app-upbar',
  templateUrl: './upbar.component.html',
  styleUrls: ['./upbar.component.scss'],
})
export class UpbarComponent implements OnInit {

  image: any;
  userInfo: any;
  instituto: any;

  constructor(public cardService: CardService,
    public authService: AuthService) {
    }

  async ngOnInit() {
    (await this.authService.userData()).subscribe(userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(kupones => {
          this.instituto = kupones.data();
          });
        });
      });
      return;
  }

}
