import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutoauthPage } from './autoauth.page';
import { ComponentsModule } from '../components/components.module';
import { AutoauthPageRoutingModule } from './autoauth-routing.module';

@NgModule({
    declarations: [AutoauthPage],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ComponentsModule,
        AutoauthPageRoutingModule
    ]
})
export class AutoauthPageModule {}
