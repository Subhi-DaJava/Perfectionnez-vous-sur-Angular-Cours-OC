import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, Observable} from "rxjs";
import {Post} from "../../models/post.model";
import {PostsService} from "../../sevices/posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Post[]>;
  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService) { }

  ngOnInit(): void {
    // Un resolver est un outil de routing qui est appelé lorsqu'un utilisateur cherche à accéder à la route où il est placé.
    // Le resolver récupère des données avant d'afficher la route souhaitée via sa méthode resolve().
    // Le component cible de la route utilise ensuite l'Observable data de ActivatedRoute pour récupérer les données via cette même clé.
    this.posts$ = this.route.data.pipe(

      map(data => data['posts'])

    );
  }

  onPostCommented (postCommented: { comment: string, postId: number }) {
    this.postsService.addNewComment(postCommented);
  }
}
