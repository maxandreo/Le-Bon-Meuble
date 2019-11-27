import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { UserAccountComponent } from './pages/user-account/user-account.component';
import { AccueilComponent } from './pages/page-accueil/accueil/accueil.component';
import { AddCreateComponent } from './add/add-create/add-create.component';
import { AddListComponent } from './add/add-list/add-list.component';

const routes: Routes = [
  { path: '', component: AccueilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserAccountComponent },
  { path: 'deposer', component: AddCreateComponent, canActivate: [AuthGuard] },
  { path: 'rechercher', component: AddListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
