import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  isLoading = false;
  isAuthenticated = false;
  nomUser: string;

  private authStatusSub: Subscription;

  loginForm: FormGroup;

  error_messages = {
    email: [
      { type: 'required', message: 'Email requis' },
      { type: 'pattern', message: 'Veuillez entrer un email valide' }
    ],
    password: [
      { type: 'required', message: 'Mot de passe requis' },
      { type: 'minlength', message: '6 caractères minimum' },
      { type: 'maxlength', message: '30 caractères maximum' }
    ]
  };

  constructor(
    public authService: AuthService,
    public dialogLogin: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    public formBuilder: FormBuilder
  ) {
    this.nomUser = this.authService.getnomUser();
    this.loginForm = this.formBuilder.group({
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
      )
    });
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  openSignup() {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '400px'
    });
    this.dialogLogin.close();
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(
      this.authService.getnomUser(),
      this.loginForm.value.email,
      this.loginForm.value.password
    );
    this.isAuthenticated = true;
    if (this.isAuthenticated) {
      this.dialogLogin.close();
    }
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
