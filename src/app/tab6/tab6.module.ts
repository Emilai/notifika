import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab6PageRoutingModule } from './tab6-routing.module';

import { Tab6Page } from './tab6.page';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
    declarations: [Tab6Page],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        Tab6PageRoutingModule,
        ComponentsModule,
        PipesModule
    ]
})
export class Tab6PageModule {}
