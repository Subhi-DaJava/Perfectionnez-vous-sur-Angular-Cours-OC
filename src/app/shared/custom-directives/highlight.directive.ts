import {AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2} from "@angular/core";

// directive en tant qu'attribut HTML
@Directive({
  selector: '[highlight]'
})
/*
* Directive (le décorateur @Directive)
* à n'importe quel élément HTML et transformer sa couleur de fond en jaune par défaut, survole lightgreen, quitte couleur par défaut, clique orange !
* La Directive est une arme essentielle dans l'arsenal des développeurs Angular,
* donc pensez-y lorsque vous aurez besoin d'apporter du comportement à des éléments HTML de votre application.
* */

export class HighlightDirective implements AfterViewInit {
  // Une Directive peut comporter des  @Input  pour accepter des paramètres.
  @Input() color = 'yellow';

  // ElementRef est la référence à l'élément du DOM
  // Renderer2 est un outil qui vous permet d'interagir avec le DOM de manière testable
  constructor(
    private el: ElementRef,
    private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setBackgroundColor(this.color);
  }
  // Une Directive peut injecter l'élément HTML sur lequel elle est placée avec ElementRef, et interagir avec cet élément avec Renderer2.
  setBackgroundColor(color: string) {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', color);
  }

  // Une Directive peut écouter les événements émanant de son élément grâce au décorateur @HostListener.
  @HostListener('mouseenter')
  onMouseEnter() {
    this.setBackgroundColor('lightgreen');
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setBackgroundColor(this.color);
  }

  @HostListener('click')
  onMouseClick() {
    this.color = 'orange';
  }
}
