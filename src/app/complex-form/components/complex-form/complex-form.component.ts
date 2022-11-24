import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith, tap} from "rxjs";
import {ComplexFormService} from "../../services/complex-form.service";

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss']
})
export class ComplexFormComponent implements OnInit {
  // Pour montrer et cacher le spinner, ainsi que pour activer et désactiver le bouton d'enregistrement
  //  dans le template, de lier l'apparition du spinner et l'activation du bouton à son état
  loading = false;
  messageError! : string;
  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;

  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;

  phoneCtrl!: FormControl;

  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  // <!-- Les Observables étant très puissants, vous allez vous en servir pour afficher et cacher les MatCards "Email" et "Telephone" selon la sélection de l'utilisateur.-->
  showEmailCtrl$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private complexFormService: ComplexFormService) { }

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm
    });
  }
  // La différence principale est qu'une méthode private ne peut pas être appelée depuis le template.
  private initFormControls(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.contactPreferenceCtrl = this.formBuilder.control('email');

    // initialiser les FormControls avant de générer le FormGroup à partir de ces FormControls
    this.emailCtrl = this.formBuilder.control('');
    this.confirmEmailCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group({
      email: this.emailCtrl,
      confirm: this.confirmEmailCtrl
    });

    this.phoneCtrl = this.formBuilder.control('');

    // initialiser les FormControls avant de générer le FormGroup à partir de ces FormControls
    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control('', Validators.required);
    this.loginInfoForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    })
  }
  // Vos deux Observables dépendent des changements du contrôle contactPreferenceCtrl, donc générez-les à partir de ses valueChanges
  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      // générer une "fausse" émission, au chargement de la page, qui correspond à la valeur initiale du champ !
      startWith(this.contactPreferenceCtrl.value), // startWith(true)
      map(preference => preference === 'email'),
      // map(preference => {
      // if(preference === 'email') {return true;}
      // else {return false;}
      // });
      tap(showEmailCtrl => {
        this.setEmailCtrlValidators(showEmailCtrl);
      })
    );
    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value), // startWith(true)
      map(preference => preference === 'phone'),
      // Il s'agit d'un effet secondaire, un side effect – vous réagissez aux émissions de l'Observable sans y toucher – donc il faut privilégier l'opérateur tap.
      tap(showPhoneCtrl => {
        this.setPhoneCtrlValidators(showPhoneCtrl);
      })
    );
  }

  private setEmailCtrlValidators(showEmailCtrl: boolean) {
    if (showEmailCtrl) {
      this.emailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
      this.confirmEmailCtrl.addValidators([
        Validators.required,
        Validators.email
      ]);
    } else {
      this.emailCtrl.clearValidators();
      this.confirmEmailCtrl.clearValidators();
    }
    this.emailCtrl.updateValueAndValidity();
    this.confirmEmailCtrl.updateValueAndValidity();
  }

  // utiliser Validators.pattern pour vous assurer du format exact du numéro de téléphone avec une RegEx !
  private setPhoneCtrlValidators(showPhoneCtrl: boolean) {
    if (showPhoneCtrl) {
      this.phoneCtrl.addValidators([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10)
      ]);
    } else {
      this.phoneCtrl.clearValidators();
    }
    this.phoneCtrl.updateValueAndValidity();
  }

  onSubmitForm() {
    this.loading = true;
    this.complexFormService.saveUserInfo(this.mainForm.value).pipe(
      tap(isSaved => {
        // lorsque le serveur répond, dans tous les cas il faut passer loading à false
        this.loading = false;
        if(isSaved) {
          // user saved successfully
          this.restForm();
        } else {
          // user not saved: error case
          this.messageError = "Une error s'est produit pendant l'enregistrement";
          console.error('Échec de l\'enregistrement !');
        }
      })
    ).subscribe();
    //console.log(this.mainForm.value);
  }

  private restForm() {
    this.mainForm.reset();
    // retrouver le vrai état initial du formulaire
    // La méthode patchValue, par défaut,
    // fait émettre l'Observable valueChanges du FormControl – la MatCard s'affichera,
    // donc et la validation sera ajustée correctement.
    this.contactPreferenceCtrl.patchValue('email'); // 'email', { emitEvent: false }
  }

// Une méthode qui permet de générer un texte d'erreur à partir de l'erreur spécifique du FormControl.
  // AbstractControl permet de passer des FormControls ou des FormGroups à cette méthode
  showFormCtrlErrorText (ctrl: AbstractControl) {
    // la méthode hasError du FormControl pour vérifier si le contrôle a généré une erreur précise
    if (ctrl.hasError ('required')) {
      return 'Ce champs est requis!';
    } else if (ctrl.hasError('email')) {
      return 'Merci d\'entrer une adresse email valide !';
      // Attention au piège ! Les codes d'erreur pour Validators.minLength et Validators.maxLength sont 'minlength' et 'maxlength' avec des l minuscules !
    } else if (ctrl.hasError('minlength')) {
      return 'Ce numéro de téléphone ne contient pas assez de chiffres !';
    } else if (ctrl.hasError('maxlength')) {
      return 'Ce numéro de téléphone ne contient pas trop de chiffres !';
    }
    else {
      return 'Ce champs contient une error !';
    }
  }
}
