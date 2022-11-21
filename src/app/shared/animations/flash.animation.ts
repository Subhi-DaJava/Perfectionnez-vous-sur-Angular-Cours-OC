// Pour créer une animation réutilisable, vous allez utiliser la méthode animation.
// Pour créer un paramètre dans une animation, on utilise la string interpolation, mais à l'intérieur des strings :
import {animate, animation, sequence, style} from "@angular/animations";

export const flashAnimation = animation([
  sequence([
    animate('{{ time }}', style({
      'background-color': '{{ flashColor }}'
    })),
    animate('{{ time }}', style({
      'background-color': 'white'
    }))
  ])
]);
