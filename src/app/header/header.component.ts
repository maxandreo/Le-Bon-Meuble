import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  nomUser: string;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.nomUser = this.authService.getnomUser();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.nomUser = this.authService.getnomUser();
      });
  }

  goToRechercher() {
    this.router.navigateByUrl('/rechercher').then(() => {
      if (!this.authService.currentUser) {
        this.authService.getCurrentUser();
      }
    });
  }
  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px'
    });
  }

  openSignup() {
    const dialogRef = this.dialog.open(SignupComponent, {
      width: '400px'
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
