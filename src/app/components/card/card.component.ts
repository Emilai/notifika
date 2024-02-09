import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CardService } from 'src/app/services/card.service';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DatePipe } from '@angular/common';
import { ModalPage } from 'src/app/modal/modal/modal.page';
import { map, switchMap, take } from 'rxjs/operators';
import { from, of, forkJoin } from 'rxjs';
import { mergeMap, catchError, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  cards: any[] = [];
  userInfo: any;
  unreadCount = 0;

  constructor(
    public cardService: CardService,
    public modalCtrl: ModalController,
    public authService: AuthService,
    private firestore: AngularFirestore,
    public datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
  ) { }

  // async ngOnInit() {
  //   (await this.authService.userData()).subscribe(async userData => {
  //     if (userData && 'data' in userData) {
  //       this.userInfo = userData.data();
  //       console.log('User Info:', this.userInfo);

  //       (await this.cardService.getComunic(this.userInfo.code, this.userInfo.grupos)).subscribe(cardsSnapshot => {
  //         const cards = cardsSnapshot.map(cardRef => cardRef.payload.doc.data());
  //         console.log('Cards:', cards);

  //         this.checkComCount$(cards).subscribe(updatedCards => {
  //           const mergedCards = cards.map(card => {
  //             const updatedCard = updatedCards.find(updated => updated.id === card.id);
  //             return updatedCard || card;
  //           });

  //           this.cards = mergedCards.sort((a, b) => b.date - a.date);
  //           console.log('Processed cards:', this.cards);
  //         });
  //       });
  //     } else {
  //       console.error('User data is undefined or null.');
  //     }
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
      component: ModalPage,
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
            .collection('comunicados')
            .doc(element.id)
            .collection('lecturas')
            .doc(this.userInfo.id)
            .get()
            .toPromise();

          if (!doc.exists) {
            console.log(element.id, 'No Existe');
            element.read = false;
          } else {
            console.log(element);
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

        this.cardService.getComunic(this.userInfo.code, this.userInfo.grupos)
          .subscribe(async (cardsSnapshot) => {
            const cards = cardsSnapshot.map(card => ({ id: card.id, ...card.data() }));

            console.log('Cards before update:', cards);

            const updatedCards = await this.checkComCount$(cards).toPromise();
            this.unreadCount = updatedCards.filter(card => !card.read).length;
            console.log('No leidos: ', this.unreadCount);
            this.cardService.setVariable(this.unreadCount);

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

