import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';
import { FormattedAdress } from 'src/app/models/google-places.model';
import { SuccessSignupComponent } from 'src/app/success-signup/success-signup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-accueil-img',
  templateUrl: './accueil-img.component.html',
  styleUrls: ['./accueil-img.component.scss']
})
export class AccueilImgComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  isRegistered = false;
  submitted = false;

  private authStatusSub: Subscription;
  private authStatusListener = new Subject<boolean>();

  signupForm: FormGroup;

  // tslint:disable-next-line: variable-name
  error_messages = {
    nomUser: [
      { type: 'required', message: `Nom d'utilisateur requis` },
      { type: 'minlength', message: '3 caractères minimum' },
      { type: 'maxlength', message: '10 caractères maximum' }
    ],
    email: [
      { type: 'required', message: 'Email requis' },
      { type: 'pattern', message: 'Veuillez entrer un email valide' }
    ],
    password: [
      { type: 'required', message: 'Mot de passe requis' },
      { type: 'minlength', message: '6 caractères minimum' },
      { type: 'maxlength', message: '30 caractères maximum' }
    ],
    ville: [{ type: 'required', message: 'Localisation requise' }]
  };

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public dialog: MatDialog,
    private zone: NgZone
  ) {
    this.signupForm = this.formBuilder.group({
      nomUser: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])
      ),
      ville: new FormControl('', Validators.compose([Validators.required]))
    });
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  setAddressCity(addrObj: FormattedAdress) {
    this.zone.run(() => {
      this.signupForm.patchValue({ ville: addrObj.formatted_address });
    });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.submitted = true;
      return;
    }
    if (this.authService.getIsAuth()) {
      this.authService.logout();
    }
    console.log(this.submitted);
    this.authService
      .createUser(
        this.signupForm.value.nomUser,
        this.signupForm.value.email,
        this.signupForm.value.password,
        this.signupForm.value.ville
      )
      .subscribe(
        () => {
          const dialogRef = this.dialog.open(SuccessSignupComponent, {
            width: '400px'
          });
        },
        error => {
          this.authStatusListener.next(false);
          console.log('err');
        }
      );
    this.isRegistered = true;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
