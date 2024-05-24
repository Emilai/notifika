import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UpbarComponent } from './upbar/upbar.component';
import { CardComponent } from './card/card.component';
import { ChartactiveusersComponent } from './chartactiveusers/chartactiveusers.component';
import { NgApexchartsModule } from 'ng-apexcharts';



@NgModule({
    declarations: [
        UpbarComponent,
        CardComponent,
        ChartactiveusersComponent
    ],

    exports: [
        UpbarComponent,
        CardComponent,
        ChartactiveusersComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        NgApexchartsModule
    ]

})

export class ComponentsModule { }
