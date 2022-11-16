import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostListComponent} from "./components/post-list/post-list.component";
import {PostsResolver} from "./resolvers/posts.resolver";

// Un resolver est un outil de routing qui est appelé lorsqu'un utilisateur cherche à accéder à la route où il est placé.
// Le resolver récupère des données avant d'afficher la route souhaitée via sa méthode resolve().
// Le resolver est enregistré au niveau de la configuration de routing, et est associé à une clé d'objet.
const routes: Routes = [
  { path: '', component: PostListComponent, resolve: { posts: PostsResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
