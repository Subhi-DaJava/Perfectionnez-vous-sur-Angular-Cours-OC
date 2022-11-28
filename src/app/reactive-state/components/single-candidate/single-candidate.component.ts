import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CandidatesService} from "../../services/candidates.service";
import {Observable, switchMap, take, tap} from "rxjs";
import {Candidate} from "../../models/candidate.model";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-single-candidate',
  templateUrl: './single-candidate.component.html',
  styleUrls: ['./single-candidate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleCandidateComponent implements OnInit {
  loading$!: Observable<boolean>;
  candidate$!: Observable<Candidate>;

  constructor(
    private candidatesService: CandidatesService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.initObservables();
  }

  private initObservables() {
    this.loading$ = this.candidatesService.loading$;
    this.candidate$ = this.route.params.pipe(
      // Il faut cast le paramètre en  number (avec + ),
      // car tout paramètre de route est automatiquement une string,
      // même si on sait qu'il contiendra un nombre dans ce cas.
      switchMap(params => this.candidatesService.getCandidateById(+params['id']))
    );
  }
  // cliquer sur EMBAUCHER, la modification dans l'application est instantanée,
  // et le serait même si le serveur tardait à répondre : c'est l'avantage de la modification optimiste.
  onHire() {
    this.candidate$.pipe(
      take(1),
      tap(candidate => {
          this.candidatesService.hireCandidate(candidate.id);
          this.onGoBack();
        })
    ).subscribe();
  }

  onRefuse() {
    this.candidate$.pipe(
      // utiliser take(1) car la logique ici ne doit être exécutée qu'une seule fois par appel.
      take(1),
      tap(candidate => {
        // Déclencher la suppression et se rediriger immédiatement l'utilisateur.
        // L'utilisateur se retrouve sur la list-view avec un spinner pendant une seconde, puis la liste des candidats se met à jour correctement !
        this.candidatesService.refuseCandidate(candidate.id);
        this.onGoBack();
      })
    ).subscribe();

  }
  onGoBack() {
    this.router.navigateByUrl('/reactive-state/candidates').then();
  }
}
