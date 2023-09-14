import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroPipe } from './filtro.pipe';
import { FiltrodocPipe } from './filtrodoc.pipe';
import { FiltromailPipe } from './filtromail.pipe';



@NgModule({
    declarations: [
        FiltroPipe,
        FiltrodocPipe,
        FiltromailPipe
    ],
    exports: [
        FiltroPipe,
        FiltrodocPipe,
        FiltromailPipe
    ],
    imports: [
        CommonModule
    ]
})
export class PipesModule {}
