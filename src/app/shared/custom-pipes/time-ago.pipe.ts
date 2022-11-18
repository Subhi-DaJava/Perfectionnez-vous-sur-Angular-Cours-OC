import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform{
  timeDiffs = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    year: 365 * 24 * 60 * 60 * 1000
  }
  transform(value: string | Date): string {
    const now = Date.now(); // milliseconds from 01/01/1970, l'époque UNIX
    const then = new Date(value).getTime();
    const diff = now - then;

    if(diff < this.timeDiffs.minute) {
      return `Il y a ${Math.floor(diff / 1000)} secondes…`;
    } else if(diff < this.timeDiffs.hour) {
      return `Il y a  ${Math.floor(diff / (1000 * 60))} minutes…`;
    } else if(diff < this.timeDiffs.day) {
      return `Il y a ${Math.floor(diff / (1000 * 60 * 60))} heures…`;
    } else if(diff < this.timeDiffs.week) {
      return `Il y a  ${Math.floor(diff / (1000 * 60 * 60 * 24))} jours…`;
    } else if(diff < this.timeDiffs.month) {
      return `Il y a ${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))} semaines…`;
    } else if(diff < this.timeDiffs.year) {
      return `Il y a  ${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} mois…`;
    } else {
      return `Il y a plus de ${Math.floor( diff / (1000 * 60 * 60 * 24 * 365))} an`;
    }
  }
}
