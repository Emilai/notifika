import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UpbarComponent } from './upbar/upbar.component';
import { CardComponent } from './card/card.component';
import { ChartactiveusersComponent } from './chartactiveusers/chartactiveusers.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { GaleriesComponent } from './galeries/galeries.component';
import { EventsComponent } from './events/events.component';



@NgModule({
    declarations: [
        UpbarComponent,
        CardComponent,
        ChartactiveusersComponent,
        GaleriesComponent,
        EventsComponent
    ],

    exports: [
        UpbarComponent,
        CardComponent,
        ChartactiveusersComponent,
        GaleriesComponent,
        EventsComponent
    ],
    imports: [
        CommonModule,
        IonicModule,
        NgApexchartsModule
    ]

})

export class ComponentsModule { }
