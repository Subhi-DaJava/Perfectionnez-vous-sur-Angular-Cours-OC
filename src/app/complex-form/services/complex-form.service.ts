import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, delay, map, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {ComplexFormValue} from "../models/complex-form-value.model";
/*
* catchError est un opérateur extrêmement utile pour la gestion d'erreur.
* Il permet de faire en sorte que l'Observable retourne quand même une valeur au lieu d'émettre une erreur.
* Attention, il faut que catchError retourne un Observable.
* */
@Injectable()
export class ComplexFormService {
  constructor(private http: HttpClient) {}

  //utilise mapTo ou map pour transformer toute réponse du serveur (et donc émission de l'Observable) en true, peu importe la valeur de la réponse;
  saveUserInfo(formValue: ComplexFormValue): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiUrl}/users`, formValue).pipe(
      map( () => true), // mapTo(true) decrypted
      delay(1000), // retarde cette réponse d'une seconde pour simuler un délai de réseau;
      catchError(() => of(false).pipe(
        delay(1000)
      ))
    );
  }
}
