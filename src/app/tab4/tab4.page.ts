import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  userInfo: any;
  instituto: any;

  constructor(
    public authService: AuthService,
    public cardService: CardService,
    private router: Router,
  ) { }


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

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', {
      replaceUrl: true
    });
  }


  comunicado() {
    this.router.navigateByUrl('/comunicado', {
      replaceUrl: true}
      );
  }

  galery() {
    this.router.navigateByUrl('/galleries', {
      replaceUrl: true
    }
    );
  }

  galeryload() {
    this.router.navigateByUrl('/galleryload', {
      replaceUrl: true
    }
    );
  }

  evento() {
    this.router.navigateByUrl('/evento', {
      replaceUrl: true
    }
    );
  }

}
