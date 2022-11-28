import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, delay, map, Observable, switchMap, take, tap } from "rxjs";
import {Candidate} from "../models/candidate.model";
import {environment} from "../../../environments/environment";
/*
* Le pattern Subject-as-a-service est basé sur des BehaviorSubjects qui "stockent" et émettent les dernières versions des données.
* */
@Injectable()
export class CandidatesService {
  constructor(private http: HttpClient) {
  }
  // Le state management réactif, une fois implémenté,
  // facilite largement l'implémentation de nouvelles fonctionnalités,
  // car les components affichent simplement ce que le service leur envoie.
  // _loading$ – qui émettra true ou false selon qu'un chargement est en cours ou non ;
  // un pattern private + getter  :
  private _loading$ = new BehaviorSubject<boolean>(false);
  // Il s'agit d'une approche permettant une lisibilité de code différente que par l'utilisation d'une méthode getLoading()
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }
  /* getLoading(): Observable<boolean> {
   return this._loading$.asObservable();
 }*/

  // candidates$ – qui émettra des tableaux de Candidate. un pattern private + getter  :
  private _candidates$ = new BehaviorSubject<Candidate[]>([]);
  get candidates$(): Observable<Candidate[]> {
    return this._candidates$.asObservable();
  }

  // stocker un timestamp du dernier chargement
  private lastCandidatesLoaded = 0;

  private setLoadingStatus(loading: boolean) {
    // Appeler next sur l'un des BehaviorSubjects du service,
    // c'est s'assurer que tous les components qui sont souscrits à leurs Observables recevront cette nouvelle donnée.
    this._loading$.next(loading);
  }
  // Parce que même si on souscrit après l'émission, le BehaviorSubject nous réémet sa dernière émission.
  getCandidatesFromServer() {
    if(Date.now() - this.lastCandidatesLoaded <= 300000) {
      return;
    }
    // Le fait que les dernières données récupérées soient réémises par le BehaviorSubject nous permet cette facilité d'implémentation,
    // tout en conservant la stratégie OnPush !
    this.setLoadingStatus(true);
    this.http.get<Candidate[]>(`${environment.apiUrl}/candidates`).pipe(
      delay(1000),
      tap(candidates => {
        this.lastCandidatesLoaded = Date.now();
        this._candidates$.next(candidates);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getCandidateById(id: number): Observable<Candidate> {
    /*
    * Le tout fonctionne ensemble car tout dépend toujours de ces mêmes BehaviorSubjects,
    * donc le spinner s'affiche correctement, et dès que les candidats sont reçus par l'application,
    * l'Observable émet et le candidat s'affiche.
    * */

    // si on arrive directement sur SingleCandidateComponent (et donc lastCandidatesLoaded = 0),
    // on demandera le chargement des utilisateurs.
    if(!this.lastCandidatesLoaded) {
      this.getCandidatesFromServer();
    }
    return this.candidates$.pipe(
      // prendre le premier élément de tableau filtré
      map(candidates => candidates.filter(candidate => candidate.id === id)[0])
    );
  }
  /*
   * la méthode refuseCandidate() ne retournera pas un Observable.
   * Appeler la méthode va simplement déclencher la suppression du candidat et le montage de state management réactif s'occupera du reste !
   * la requête réussit, vous transférez l'Observable vers les candidates$ à l'instant t
   */
  refuseCandidate(candidateId: number ): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/candidates/${candidateId}`).pipe(
      delay(1000),
      switchMap(() => this.candidates$),
      // si vous ne mettez pas le take(1), vous finirez dans un infinite loop ! Tout ce qui vient après ce switchMap ne doit être exécuté qu'une seule fois par suppression ;
      take(1),
      // map pour modifier le tableau, retournant un tableau qui contient tous les candidats sauf celui qui comporte l'id passé en argument;
      map(candidates => candidates.filter(candidate => candidate.id !== candidateId)),
      tap( candidatesFiltered => {
        // émettre la nouvelle liste de candidats et l'état de chargement
        // le reste de l'application n'a pas besoin de suivre l'avancée de la requête de suppression.
        this._candidates$.next(candidatesFiltered);
        this.setLoadingStatus(false);
      })
    ).subscribe(); // Les components qui sont souscrits aux Observables du service vont simplement afficher les nouvelles données qui sont émises !
  }
  /*
  * la modification optimiste, d'abord mettre à jour les données de l'application avant même d'envoyer la requête au serveur
  * transformer puis faire émettre le tableau des candidats à jour, ensuite envoyer une requête PATCH avec le candidat mis à jour
   */
  hireCandidate(candidateId: number): void {
    this.candidates$.pipe(
      take(1),
      map(candidates =>
        candidates.map(candidate => candidate.id === candidateId ? {...candidate, company: 'SnapFace Ltd'} : candidate)),
      tap(updatedCandidates => this._candidates$.next(updatedCandidates)),
      delay(1000),
      switchMap(updatedCandidates =>
        this.http.patch(`${environment.apiUrl}/candidates/${candidateId}`,
          updatedCandidates.find(candidate => candidate.id === candidateId))
      )
    ).subscribe();
  }

}
