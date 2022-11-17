import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../models/post.model";

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {
  @Input() post!: Post;

  // Le @Output va donc émettre un objet contenant le commentaire et l'id du Post commenté.
  // Un EventEmitter est un objet qui émet des événements personnalisés.
  // Un EventEmitter doté du décorateur @Output devient "écoutable" depuis le component parent avec l'event binding.
  @Output() postCommented = new EventEmitter<{ comment: string, postId: number }>();

  constructor() {}

  ngOnInit(): void {
  }
 /*
 * Cela vous permet de bien constater que l'événement de l'enfant (CommentsComponent) est capté par le parent (PostListItemComponent),
 * sans avoir eu besoin de passer par un service.
 * CommentsComponent est donc réutilisable : son component parent lui injecte les données et réagit à ses événements.
 */
  onNewComment(comment: string) {
    this.postCommented.emit({comment, postId: this.post.id}); // equals to comment: comment
  }
}
