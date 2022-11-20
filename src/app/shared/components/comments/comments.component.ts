import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
// On utilise trigger pour définir un regroupement d'états et de transitions à assigner aux différents éléments.
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('list', [
     transition(':enter', [
       // sélecteur HTML, 'mat-list-item', cibler tous les enfants dotés du trigger listItem
       query('@listItem', [
         // La valeur 50 correspond au nombre de millisecondes entre deux déclenchements !
         stagger(50, animateChild())])
     ])
    ]),

    trigger('listItem', [
      state('default', style({
          transform: 'scale(1)',
          'background-color': 'white',
          'z-index': 1
        })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'rgb(201, 157, 242)',
        'z-index' : 2
      })),
      transition('default => active', [
        animate('100ms ease-in-out')
      ]),
      transition('active => default', [
        animate('500ms ease-in-out')
      ]),
    transition(':enter', [  // void => *, * => void, :leave
      // la fonction query qui permet de cibler des enfants de l'élément qui comporte le trigger:
      // le texte est invisible dès le départ et son fade-in a lieu après l'arrivée du bloc du commentaire.
      // query peut cibler plusieurs éléments à la fois !
      query('.comment-text, .comment-date', [
        style({
          opacity: 0
        })
      ]),
      style({
      transform: 'translateX(-100%)',
      opacity: 0,
      'background-color': 'rgb(201, 157, 242)'
    }),
      animate('250ms ease-out',
        style({
        transform: 'translateX(0)',
        opacity: 1,
        'background-color': 'white'
        })),
        group([
          /*
          * Par exemple, si vous voulez faire "flasher" la couleur de fond du commentaire (l'animer vers une couleur puis tout de suite animer son retour au blanc),
          * et déclencher ce flash en même temps que les fade-in des textes ?*/
          sequence([
            animate('250ms', style({
              'background-color': 'rgba(229,231,216,0.9)'
            })),
            animate('250ms', style({
              'background-color': 'white'
            }))
            ]),
          query('.comment-text', [
            animate('250ms', style({
              opacity: 1
            }))
          ]),
          query('.comment-date', [
            animate('500ms', style({
              opacity: 1
            }))
          ])
        ])
       ])
    ])
  ]
})
export class CommentsComponent implements OnInit {
  /*
  Pour assigner un state à un trigger dans le template, vous allez utiliser l'attribute binding,
  avec une variable côté TypeScript qui contiendra soit 'default', soit 'active'
   */
  // listItemAnimationState: 'default' | 'active' = 'default'; in template  [@listItem]="listItemAnimationState" for all comments

  animationStates: { [key: number] : 'default' | 'active'  } = {} ; // un dictionnaire

  // CommentsComponent doit accepter une liste de commentaires injectée par son parent. Il lui faut donc un @Input()
  // L'attribut personnalisé avec le décorateur @Input
  @Input() comments!: Comment[];

  //  L'événement personnalisé avec le décorateur @Output, permet d'y lier une méthode depuis le parent à l'aide de l'event binding.
  // Un EventEmitter est un objet sur lequel on peut appeler la méthode emit() et qui, comme son nom l'indique, émet la valeur qu'on lui passe sous forme d'événement.
  @Output() newCommentByPostId = new EventEmitter<string>();

  // Puisque ce formulaire est extrêmement simple, inutile de créer tout un FormGroup. Il est possible de créer simplement un FormControl
  commentControl!: FormControl

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.commentControl = this.formBuilder.control('', [Validators.required, Validators.minLength(10)]);
    // Puisque cet objet (animationStates) est vide par défaut, il faut le peupler dans ngOnInit: animationStates = {
    //     0: 'default',
    //     1: 'default',
    //     2: 'default'
    // };
    for(let index in this.comments) {
      this.animationStates[index] = 'default';
    }
  }
  /*
  * Comment faire pour rendre CommentsComponent réutilisable ?
  * Comment permettre au component parent – dans ce cas, PostListItemComponent – de réagir aux clics du bouton d'envoi ?
   */
  onLeaveComment(): void {
    // si l'utilisateur n'a pas entré un commentaire valable dans le champ de texte,
    // ignorez l'événement – avec l'affichage en rouge fourni par Material, il s'agit d'une alternative à la désactivation du bouton ;
    if(this.commentControl.invalid) {
      return;
    }
    // transformer le tableau de Comment en tableau de number avec la fonction map.
    // Math.max prend les arguments les uns à la suite des autres (et non dans un tableau), vous utilisez l'opérateur "spread..." pour éclater le tableau d'id.
    // Avec ce maxId, ajouter le nouveau commentaire au début du tableau comments avec la fonction "unshift".
    const maxId = Math.max(...this.comments.map(comment => comment.id));
    this.comments.unshift({
      id: maxId +1,
      comment: this.commentControl.value,
      createdDate: new Date().toISOString(),
      userId: 1
    })

    this.newCommentByPostId.emit(this.commentControl.value);
    this.commentControl.reset();
  }

  onListItemMouseEnter(index: number) {
    this.animationStates[index] = 'active';
  }
  onListItemMouseLeave(index: number) {
    this.animationStates[index] = 'default';
  }

}

