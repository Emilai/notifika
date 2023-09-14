import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtromail'
})
export class FiltromailPipe implements PipeTransform {

  transform(arreglo: any[], texto: string = ''): any[] {

    if (texto === '') {
      return arreglo;
    }

    if (!arreglo) {
      return arreglo;
    }

    texto = texto.toLowerCase();

    return arreglo.filter(
      item => item.email.toLowerCase().includes(texto)
    );

  }

}
