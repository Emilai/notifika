import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  instituto: any;
  userInfo: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    public cardService: CardService
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
      this.userInfo = userInfo;
      this.getTotalUserCount(this.userInfo.code);
    });

    return;
  }

  back() {
    this.router.navigateByUrl('/tabs/tab5', {
      replaceUrl: true
    }
    );
  }

  async getTotalUserCount(code){
  const count = await this.cardService.getCompanyUsersCount(code);
  }

  getActiveUserCount(){
    console.log();
  }
}
