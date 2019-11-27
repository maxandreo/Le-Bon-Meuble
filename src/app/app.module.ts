import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material';
import { HeaderComponent } from './header/header.component';
import 'materialize-css';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { AccueilImgComponent } from './pages/page-accueil/accueil-img/accueil-img.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { UserAccountComponent } from './pages/user-account/user-account.component';
import { AccueilComponent } from './pages/page-accueil/accueil/accueil.component';
import { AddCreateComponent } from './add/add-create/add-create.component';
import { AuthGuard } from './auth.guard';
import { AddListComponent } from './add/add-list/add-list.component';
import { CardComponent } from './add/card/card.component';

// Imports Angular MAterial
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { MapComponent } from './google-maps/map/map.component';
import { AccueilRegisterComponent } from './pages/page-accueil/accueil-register/accueil-register.component';
import { FooterComponent } from './pages/footer/footer.component';
import { GooglePlacesDirective } from './google-maps/google-places.directive';
import { GoogleCityPostalCodeDirective } from './google-maps/google-city-postal-code.directive';
import { SuccessSignupComponent } from './success-signup/success-signup.component';
import { AddCardComponent } from './add/add-card/add-card.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {
  MatIconModule,
  MatInputModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [
    AccueilComponent,
    AppComponent,
    HeaderComponent,
    AccueilImgComponent,
    SignupComponent,
    LoginComponent,
    UserAccountComponent,
    AccueilComponent,
    AddCreateComponent,
    AddListComponent,
    CardComponent,
    MapComponent,
    AccueilRegisterComponent,
    FooterComponent,
    GooglePlacesDirective,
    GoogleCityPostalCodeDirective,
    SuccessSignupComponent,
    AddCardComponent,
    SearchBarComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC5sIMFkWbde-Y1muILoVXgVL1RdQb15-s',
      libraries: ['places']
    }),
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [SuccessSignupComponent],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
      deps: [Injector]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
