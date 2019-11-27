import { Component, Input, OnDestroy, OnInit, NgZone } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormattedAdress } from 'src/app/models/google-places.model';
import { SuccessSignupComponent } from 'src/app/success-signup/success-signup.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  isRegistered = false;
  @Input() ngSwitch: any;

  private authStatusSub: Subscription;
  private authStatusListener = new Subject<boolean>();

  signupForm: FormGroup;

  error_messages = {
    nomUser: [
      { type: 'required', message: `Nom requis` },
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
    public dialogSignup: MatDialogRef<SignupComponent>,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public zone: NgZone
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
      return;
    }
    this.isLoading = true;
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
          this.closeDialog();
        },
        error => {
          this.authStatusListener.next(false);
          console.log('err');
        }
      );
    this.isRegistered = true;
  }

  closeDialog() {
    this.dialogSignup.close();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
