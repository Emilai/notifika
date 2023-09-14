import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrodoc'
})
export class FiltrodocPipe implements PipeTransform {

  transform(arreglo: any[], texto: string = ''): any[] {

    if (texto === '') {
      return arreglo;
    }

    if (!arreglo) {
      return arreglo;
    }

    texto = texto.toLowerCase();

    return arreglo.filter(
      item => item.cedula.toLowerCase().includes(texto)
    );

  }

}
