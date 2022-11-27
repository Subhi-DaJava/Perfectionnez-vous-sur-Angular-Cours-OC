import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {combineLatest, map, Observable, startWith} from "rxjs";
import {CandidatesService} from "../../services/candidates.service";
import {Candidate} from "../../models/candidate.model";
import {FormBuilder, FormControl} from "@angular/forms";
import {CandidateSearchType} from "../../enum/candidate-search-type.enum";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateListComponent implements OnInit {
  loading$!: Observable<boolean>;
  candidates$!: Observable<Candidate[]>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  // Cet objet associe des valeurs valides pour la recherche à un label pour l'affichage dans le dropdown.
  searchTypeOptions!: {
    value: CandidateSearchType,
    label: string
  }[];
  constructor(
    private candidateService: CandidatesService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
   this.initObservables();
   this.candidateService.getCandidatesFromServer();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control('');
    this.searchTypeCtrl = this.formBuilder.control(CandidateSearchType.LASTNAME);
    this.searchTypeOptions = [
      { value: CandidateSearchType.LASTNAME, label: 'Last Name' },
      { value: CandidateSearchType.FIRSTNAME, label: 'First Name'},
      { value: CandidateSearchType.COMPANY, label: 'Company' },
      { value: CandidateSearchType.JOB, label: 'Job' }
    ];
  }
  private initObservables() {
    this.loading$ = this.candidateService.loading$;
    const search$ = this.searchCtrl.valueChanges.pipe(
      // un opérateur startWith pour faire émettre les Observables au moment de la souscription – ils émettront la valeur par défaut des champs.
      startWith(this.searchCtrl.value),
      // la transformation en minuscules va permettre de créer une recherche qui n'est pas sensible à la casse
      map(value => value.toLowerCase())
    );
    // Il est essentiel ici de spécifier le type qui sera émis par searchType$
    const searchType$: Observable<CandidateSearchType> = this.searchTypeCtrl.valueChanges.pipe(
      startWith(this.searchTypeCtrl.value)
    );
    // L'opérateur combineLatest prend un tableau d'Observables en argument.
    // combineLatest émet les dernières émissions de tous ses Observables sous forme de tuple à chaque fois que l'un d'entre eux émet.
    this.candidates$ = combineLatest([
      // Il attend que chaque Observable ait émis au moins une fois et puis, à chaque émission d'un des Observables,
      // émet les dernières émissions de tous les Observables sous forme de tuple.
      search$,
      searchType$,
      this.candidateService.candidates$
      // Ici, vous aurez d'abord un tuple de cette forme : ['', 'lastName', [ tableau de tous les candidats]]
    ]).pipe(
      // Array.filter, // maVoiture.modèle  === maVoiture["modèle"], candidate[searchType], candidate.lastName si searchType === 'lastName' by default
      map(([search, searchType, candidates]) => candidates.filter(candidate => candidate[searchType]
        .toLowerCase() // le(search) passer en minuscules pour que la recherche ne soit pas sensible à la casse
        .includes(search as string))) // vérifier si l'attribut sélectionné contient la chaîne de caractères passée dans le champ de recherche.
      // Le cast search as string empêche TypeScript de râler parce qu'il n'arrive pas à identifier le type exact de search.
    );
  }

}
