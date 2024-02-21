import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EventPage } from '../modal/event/event.page';
import { AuthService } from '../services/auth.service';
import { CardService } from '../services/card.service';
import { OrderModule } from 'ngx-order-pipe';
import { OrderPipe } from 'ngx-order-pipe';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, of } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  cards: any;
  user: any;
  userInfo: any;
  userGroups: any;
  unreadCount = 0;


  constructor(public cardService: CardService, public modalCtrl: ModalController,
    public authService: AuthService,
    public orderBy: OrderModule,
    private orderPipe: OrderPipe,
    private cdr: ChangeDetectorRef,
    private firestore: AngularFirestore) { }


  // async ngOnInit() {
  //   this.user = this.authService.auth.currentUser;
  //   await (await this.authService.userData()).subscribe(userData => {
  //     const userInfo = userData.data();
  //     this.userInfo = userInfo;
  //     this.userGroups = this.userInfo.grupos;
  //     this.cardService.getEvent(this.userInfo.code, this.userInfo.grupos).then(cards => {
  //       cards.subscribe(card => {
  //         this.cards = card.map(cardRef => {
  //           const data = cardRef.payload.doc.data();
  //           return data;
  //         });
  //         this.cards = this.orderPipe.transform(this.cards, 'date' , true);
  //       });
  //     });
  //     return userInfo;
  //   });
  // }

  async ngOnInit() {
    try {
      await this.fetchAndProcessCards();
    } catch (error) {
      console.error('Error fetching or processing cards:', error);
    }
  }


  async mostrarModal(card) {

    const modal = await this.modalCtrl.create({
      component: EventPage,
      showBackdrop: true,
      canDismiss: true,
      animated: true,
      mode: 'ios',
    });
    modal.onWillDismiss().then((dataReturned) => {
      // Update the cards or perform any action when the modal is dismissed
      this.updateCards();
    });
    this.cardService.cardInfo = card;
    await modal.present();
  }

  updateCards() {
    // Fetch the updated data or perform any necessary actions here
    console.log('Modal dismissed. Updating cards...');
    // For example, you can refresh the cards by calling the necessary functions
    this.fetchAndProcessCards();
  }

  checkComCount$(cards: any[]) {
    if (!this.userInfo || !this.userInfo.code) {
      console.error('User info or user code is undefined.');
      return of(cards);
    }

    return from(cards).pipe(
      mergeMap(async element => {
        try {
          const doc = await this.firestore.collection(this.userInfo.code)
            .doc('datos')
            .collection('eventos')
            .doc(element.id)
            .collection('lecturas')
            .doc(this.userInfo.id)
            .get()
            .toPromise();

          if (!doc.exists) {
            console.log(element.id, 'No Existe');
            element.read = false;
          } else {
            console.log(element, 'Existe');
          }
        } catch (error) {
          console.log('error:', error);
        }

        return element;
      }),
      toArray()
    );
  }


  async fetchAndProcessCards() {
    try {
      const userData = await (await this.authService.userData()).toPromise();

      if (userData && userData.data()) {
        this.userInfo = userData.data();
        console.log('User Info:', this.userInfo);

        this.cardService.getEvent(this.userInfo.code, this.userInfo.grupos)
          .subscribe(async (cardsSnapshot) => {
            const cards = cardsSnapshot.map(card => ({ id: card.id, ...card.data() }));

            const updatedCards = await this.checkComCount$(cards).toPromise();
            this.unreadCount = updatedCards.filter(card => !card.read).length;
            console.log('No leidos: ', this.unreadCount);
            this.cardService.setVariable3(this.unreadCount);

            const mergedCards = cards.map(card => {
              const updatedCard = updatedCards.find(updated => updated.id === card.id);
              return { ...card, ...(updatedCard || {}) };
            });

            this.cards = mergedCards.sort((a, b) => {
              const dateA = a.date || 0; // Use 0 if date is undefined
              const dateB = b.date || 0; // Use 0 if date is undefined

              if (dateA > dateB) {
                return -1; // Return -1 to place 'a' before 'b'
              } else if (dateA < dateB) {
                return 1; // Return 1 to place 'a' after 'b'
              } else {
                return 0; // Return 0 if the dates are equal
              }
            });

            console.log('Processed cards:', this.cards);

            // Manually trigger change detection
            this.cdr.detectChanges();
          });
      } else {
        console.error('User data is undefined or null.');
      }
    } catch (error) {
      console.error('Error fetching or processing cards:', error);
    }
  }
}
