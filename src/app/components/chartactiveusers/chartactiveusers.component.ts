/* eslint-disable arrow-body-style */
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CardService } from 'src/app/services/card.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexGrid,
  ApexTooltip,
  ApexMarkers,
  ApexTitleSubtitle,
  ApexLegend
} from 'ng-apexcharts';
import { series } from './datos';
import { LoadingController } from '@ionic/angular';
import { take } from 'rxjs/operators';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: any[];
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chartactiveusers',
  templateUrl: './chartactiveusers.component.html',
  styleUrls: ['./chartactiveusers.component.scss'],
})
export class ChartactiveusersComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public options: Partial<ChartOptions>;
  public barOptions: Partial<ChartOptions>;
  public barOptions2: Partial<ChartOptions>;
  public barOptions3: Partial<ChartOptions>;

  instituto: any;
  userInfo: any;
  usersPerDay: any;
  activeUsers: any;
  totalUsers: any;
  activeUsersCount: any;
  totalUsersCount: any;
  activeUsersSeries: any;
  cards: any;
  lecturasPorComunicado = {
    comunicados: [],
    ids: [],
    lecturas: []
  };
  lecturasPorHorario ={
    comunicados: [],
    ids: [],
    franja1: [],
    franja2:[],
    franja3: [],
    franja4: []
  };
  lecturasChart = false;
  usuariosPorDia = {
    count: [],
    date: []
  };

  constructor(
    private authService: AuthService,
    public cardService: CardService,
    private loadingController: LoadingController
  ) {
  }

  spackLine() {
    this.options = {
      chart: {
        type: 'line',
        height: 100,
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      series: [
        {
          name: 'Nuevos Usuarios Activos',
          data: this.activeUsersSeries.cantidad
        }
      ],
      xaxis: {
        categories: this.activeUsersSeries.fecha
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      markers: {
        size: 0,
      },
      grid: {
        padding: {
          top: 20,
          left: 110,
          bottom: 10,
        },
      },
      colors: ['#fff'],
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
        },
        y: {
          title: {
            // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
            formatter: function formatter(val) {
              return ''; // remove title in tooltip
            },
          },
        },
      },
    };
  }

  barChart() {
    this.barOptions = {
      chart: {
        type: 'bar',
        height: 180,
        width: '100%',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: 'Lecturas',
          data: this.lecturasPorComunicado.lecturas,
        }
      ],
      labels: this.lecturasPorComunicado.comunicados,
      grid: {
        borderColor: '#343E59',
        padding: {
          right: 0,
          left: 0,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#78909c',
          },
        },
      },
      title: {
        text: 'Lecturas por Comunicado',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#78909c',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        labels: {
          colors: '#78909c',
        },
      },
    };
  }

  barChart2() {
    this.barOptions2 = {
      chart: {
        type: 'area',
        height: 180,
        width: '100%',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: '00:00 a 05:59hs',
          data: this.lecturasPorHorario.franja1,
        },
        {
          name: '06:00 a 11:59hs',
          data: this.lecturasPorHorario.franja2,
        },
        {
          name: '12:00 a 17:59hs',
          data: this.lecturasPorHorario.franja3,
        },
        {
          name: '18:00 a 23:59hs',
          data: this.lecturasPorHorario.franja4,
        }
      ],
      labels: this.lecturasPorHorario.comunicados,
      grid: {
        borderColor: '#343E59',
        padding: {
          right: 0,
          left: 0,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#78909c',
          },
        },
      },
      title: {
        text: 'Horarios de Lectura',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#78909c',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        labels: {
          colors: '#78909c',
        },
      },
    };
  }

  barChart3() {
    this.barOptions3 = {
      chart: {
        type: 'area',
        height: 180,
        stacked: false,
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
        width: '100%',
        toolbar: {
          show: false,
        },
      },
      series: [
        {
          name: 'Visitas diarias a la App',
          data: this.usuariosPorDia.count,
        }
      ],
      labels: this.usuariosPorDia.date,
      grid: {
        borderColor: '#343E59',
        padding: {
          right: 0,
          left: 0,
        },
      },
      xaxis: {
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      stroke: {
        width: 5,
        curve: 'smooth',
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#78909c',
          },
        },
      },
      title: {
        text: 'Visitas diarias a la App',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#78909c',
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        labels: {
          colors: '#78909c',
        },
      },
    };
  }

/////////////////////// Functions on Component //////////////////////

  async ngOnInit() {
    (await this.authService.userData()).subscribe(async userData => {
      const userInfo = userData.data();
      this.userInfo = userInfo;
      this.cardService.getInstitution(this.userInfo.code).then(inst => {
        inst.subscribe(kupones => {
          this.instituto = kupones.data();
        });
      });
      this.userInfo = userInfo;
      await this.getActiveUsersCount(this.userInfo.code);
      await this.getTotalUsersCount(this.userInfo.code);
      await this.getComunicadosData(this.userInfo.code);
      await this.dailyUsers(this.userInfo.code);
    });
    return;
  }

  async getActiveUsersCount(code) {
    const count = (await this.cardService.getActiveUsersCount(code)).subscribe(result => {
      this.activeUsers = result;
      this.activeUsersCount = result.length.toString();
      this.countDates(this.activeUsers);
      this.spackLine();
    });;
    return count;
  }

  async getTotalUsersCount(code) {
    try {
      const countDocPromise = this.cardService.getCompanyUsersCount(code); // Promise<Observable<DocumentSnapshot<unknown>>>

      const countDocObservable = await countDocPromise; // Esperar a que se resuelva la promesa y obtener el observable

      countDocObservable.subscribe(countDoc => {
        if (countDoc.exists) {
          this.totalUsersCount = countDoc.data();
          this.totalUsersCount = this.totalUsersCount.count.toString();
        } else {
          this.totalUsersCount = '0';
        }
      });
    } catch (error) {
      console.error('Error getting user count:', error);
      this.totalUsersCount = '0';
    }
  }




  async getComunicadosData(code) {
    const data = this.cardService.getComunicData(code).subscribe(async (cardsSnapshot) => {
      const cards = cardsSnapshot.map(card => ({ id: card.id, ...card.data() }));

      const mergedCards = cards.map(card => card);

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
      console.log('Comunicados', this.cards);

      if (this.cards) {
        for (const element of this.cards) {
          if (!this.lecturasPorComunicado.ids.includes(element.id)) {
            this.lecturasPorComunicado.ids.push(element.id);
            await this.getComunicadoLecturas(this.userInfo.code, element.id, element.date);
          }
        }
        this.constructLecturasPorComunicado();
      }
    });
  }


  async getComunicadoLecturas(code, id, date) {
    console.log(`getComunicadoLecturas for id ${id}`);
    try {
      const cardsSnapshot = await this.cardService.getComunicLectures(code, id).pipe(take(1)).toPromise();
      const cards = cardsSnapshot.map(card => ({ id: card.id, ...card.data() }));
      const cantidadLecturas = cards.length;

      console.log('Lecturas for id', id, 'quantity', cantidadLecturas);

      const formattedDate = date.split('-').slice(0, 3).join('-');

      this.lecturasPorComunicado.comunicados.push(formattedDate);
      this.lecturasPorComunicado.lecturas.push(cantidadLecturas);

      let franja1 = 0;
      let franja2 = 0;
      let franja3 = 0;
      let franja4 = 0;

      cards.forEach(card => {
        const hour = parseInt(card.fecha.split(' | ')[1].split(':')[0], 10);
        if (!isNaN(hour)) {
          if (hour >= 0 && hour < 6) {
            franja1++;
          } else if (hour >= 6 && hour < 12) {
            franja2++;
          } else if (hour >= 12 && hour < 18) {
            franja3++;
          } else if (hour >= 18 && hour < 24) {
            franja4++;
          }
        }
      });

      this.lecturasPorHorario.comunicados.push(formattedDate);
      this.lecturasPorHorario.franja1.push(franja1);
      this.lecturasPorHorario.franja2.push(franja2);
      this.lecturasPorHorario.franja3.push(franja3);
      this.lecturasPorHorario.franja4.push(franja4);

    } catch (error) {
      console.error(`Error fetching lecturas for id ${id}:`, error);
    }
  }

  constructLecturasPorComunicado() {
    console.log('constructLecturasPorComunicado start');

    const combined = this.lecturasPorComunicado.comunicados.map((date, index) => ({
      date,
      lecturas: this.lecturasPorComunicado.lecturas[index],
      franja1: this.lecturasPorHorario.franja1[index],
      franja2: this.lecturasPorHorario.franja2[index],
      franja3: this.lecturasPorHorario.franja3[index],
      franja4: this.lecturasPorHorario.franja4[index],
      id: this.lecturasPorComunicado.ids[index]
    }));

    combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const uniqueCombined = combined.filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );

    this.lecturasPorComunicado.comunicados = uniqueCombined.map(item => item.date);
    this.lecturasPorComunicado.lecturas = uniqueCombined.map(item => item.lecturas);
    this.lecturasPorComunicado.ids = uniqueCombined.map(item => item.id);

    this.lecturasPorHorario.comunicados = uniqueCombined.map(item => item.date);
    this.lecturasPorHorario.franja1 = uniqueCombined.map(item => item.franja1);
    this.lecturasPorHorario.franja2 = uniqueCombined.map(item => item.franja2);
    this.lecturasPorHorario.franja3 = uniqueCombined.map(item => item.franja3);
    this.lecturasPorHorario.franja4 = uniqueCombined.map(item => item.franja4);
    this.lecturasPorHorario.ids = uniqueCombined.map(item => item.id);

    console.log('lecturasPorComunicado sorted', this.lecturasPorComunicado);
    console.log('lecturasPorHorario sorted', this.lecturasPorHorario);

    setTimeout(() => {
      this.barChart();
      this.barChart2();
      this.barChart3();
      this.lecturasChart = true;
      console.log('barChart rendered and lecturasChart set to true');
    }, 100);
  }

  ////////// Counteo de Fechas para Usuarios Activos ////////////
  async countDates(users) {
    const dateCounts = {};

    users.forEach(user => {
      const date = user.fecha.split(' | ')[0];

      if (dateCounts[date]) {
        dateCounts[date]++;
      } else {
        dateCounts[date] = 1;
      }
    });

    const sortedDates = Object.keys(dateCounts).sort();

    const result = {
      fecha: sortedDates,
      cantidad: sortedDates.map(date => dateCounts[date])
    };

    this.activeUsersSeries = result;
    console.log('result: ', result);
    return result;
  }

  async dailyUsers(code: string) {
    try {
      this.cardService.getDailyUsers(code).subscribe(cardsSnapshot => {
        const cards = cardsSnapshot.map(card => ({ ...card.data() }));

        // Clear previous values
        this.usuariosPorDia.count = [];
        this.usuariosPorDia.date = [];

        // Assign values to usuariosPorDia
        cards.forEach(card => {
          this.usuariosPorDia.count.push(card.count);
          this.usuariosPorDia.date.push(card.date);
        });

        console.log(this.usuariosPorDia);
      });
    } catch (error) {
      console.error('Error fetching daily users:', error);
    }
  }

}


