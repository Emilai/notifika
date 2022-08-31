import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UpbarComponent } from './upbar/upbar.component';
import { CardComponent } from './card/card.component';



@NgModule({
    declarations: [
        UpbarComponent,
        CardComponent
    ],

    exports: [
        UpbarComponent,
        CardComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
    ]

})

export class ComponentsModule { }
