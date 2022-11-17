import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Comment } from '../../../core/models/comment.model';
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
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
    this.newCommentByPostId.emit(this.commentControl.value);
    this.commentControl.reset();
  }
}

