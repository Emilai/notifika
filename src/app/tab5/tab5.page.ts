import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  comunicado() {
    this.router.navigateByUrl('/comunicado', {
      replaceUrl: true
    }
    );
  }

  galery() {
    this.router.navigateByUrl('/galleries', {
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
