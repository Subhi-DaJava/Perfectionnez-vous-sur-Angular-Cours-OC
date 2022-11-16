import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Post} from "../models/post.model";
import {PostsService} from "../sevices/posts.service";
import {Observable} from "rxjs";

@Injectable()
export class PostsResolver implements Resolve<Post[]> {

  constructor(private postsService: PostsService) {}
  // Un resolver est un outil de routing qui est appelé lorsqu'un utilisateur cherche à accéder à la route où il est placé.
  // Le resolver récupère des données avant d'afficher la route souhaitée via sa méthode resolve().
  // Le resolver est enregistré au niveau de la configuration de routing, et est associé à une clé d'objet.
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> {
    return this.postsService.getPosts();
  }
}
