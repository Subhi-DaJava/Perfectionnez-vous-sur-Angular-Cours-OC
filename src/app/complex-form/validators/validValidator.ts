import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
/*
* une fonction qui retourne un ValidatorFn.
* Un ValidatorFn prend un AbstractControl comme paramètre et retourne soit null, soit un objet de type ValidationErrors :
*
* la valeur du contrôle contient le texte 'VALID', Si oui, le Validator retourne null. Un Validator retourne null lorsqu'il juge que le contrôle est valide
 */
export function validValidator(): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    if(ctrl.value.includes('VALID')) {
      return null;
    } else {
      // le Validator retourne un objet. La clé de l'objet est le nom que vous voulez associer à l'erreur (qui sera retrouvée via hasError, par exemple). la valeur du champ
      return {
        validValidator: ctrl.value
      };
    }
  }
}
