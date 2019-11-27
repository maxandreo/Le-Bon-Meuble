import { Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapComponent } from 'src/app/google-maps/map/map.component';
import { addDimension } from 'src/app/models/addDimension.models';
import { FormattedAdress } from 'src/app/models/google-places.model';
import { UserData } from 'src/app/models/userData.model';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { AddData } from '../../models/add-data.model';
import { AddService } from '../../services/add.service';
import { AuthService } from '../../services/auth.service';
import { CategorieData } from 'src/app/models/categorie-data.model';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrls: ['./add-list.component.scss']
})
export class AddListComponent implements OnInit {
  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  public adds: AddData[] = [];
  private addsSub: Subscription;
  public users: UserData[] = [];
  public showMap = false;

  public categories: CategorieData[] = [];
  public etats: any = [];
  public materiaux: any = [];

  public dimensions = {} as addDimension;
  public selectedLocalisation = 'Toute la France';
  // SearchBar
  @Input() selectedOption;

  // Filter
  public touteCategories = 'Toutes les catégories';
  public selectedCategorie;
  public touteMateriaux = 'Tout les matériaux';
  public selectedMateriau;
  public touteEtats = 'Tous';
  public selectedEtat;

  public addsFitMat: AddData[] = [];
  public isFilteredMat = false;

  public addsFitCat: AddData[] = [];
  public isFilteredCat = false;

  public addsFitEtat: AddData[] = [];
  public isFilteredEtat = false;

  //Localisation
  public showSelectLoc = false;
  public latitudeSearch: number;
  public longitudeSearch: number;
  public geoloc = false;
  public addr: object;
  public adress;

  public shareAdress;
  public patchValue = false;
  public adressVilleData;
  public adressData;

  public isPageSearch = false;

  @ViewChild('mapComponent') mapComponent: MapComponent;

  get currentUser(): UserData {
    return this.authService.currentUser;
  }
  set currentUser(value) {
    this.authService.currentUser = value;
  }

  constructor(
    private addService: AddService,
    private authService: AuthService,
    public googleMapsService: GoogleMapsService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.loadUsers();
    this.addService.getChampsAdd().subscribe(() => {
      this.categories = this.addService.categories;
      this.materiaux = this.addService.materiaux;
      this.etats = this.addService.etats;
    });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.googleMapsService.myNewSubject.subscribe(data => {
      console.log('data', data);
      this.adressData = data.split(',')[0];
      this.adress = this.adressData;
      this.patchValue = true;
    });
    this.adress = 'Toute la France';
    if (this.adress) {
      this.isPageSearch = true;
    }
    // InitChamps
    this.initChamps();
  }

  public initChamps() {
    this.selectedCategorie = this.touteCategories;
    this.selectedMateriau = this.touteMateriaux;
    this.selectedEtat = this.touteEtats;
  }

  onSelectedFilter(e) {
    for (let i = 0; i < this.categories.length; i++) {
      const categorie = this.categories[i];
      if (categorie._id === e.value) {
        return this.filterByCategorie(e.value);
      }
    }
    for (let i = 0; i < this.materiaux.length; i++) {
      const materiau = this.materiaux[i];
      if (materiau._id === e.value) {
        return this.filterByMateriau(e.value);
      }
    }
    for (let i = 0; i < this.etats.length; i++) {
      const etat = this.etats[i];
      if (etat._id === e.value) {
        return this.filterByEtat(e.value);
      }
    }
    this.getFilteredExpenseList();
  }

  getFilteredExpenseList() {
    if (this.addService.searchOption.length > 0) {
      this.adds = this.addService.filteredListOptions();
    } else {
      this.adds = this.addService.addsData;
    }
  }

  filterByCategorie(idCat) {
    console.log('filtercat init', this.adds);
    if (this.selectedCategorie === this.touteCategories) {
      this.adds = this.addService.addsData;
    } else if (
      !this.isFilteredEtat ||
      !this.isFilteredMat ||
      !this.isFilteredEtat
    ) {
      this.adds = this.addService.addsData;
    } else {
      if (this.adds.length) {
        this.addsFitCat = this.adds.filter(add => add.idCat === idCat);
      }
    }

    console.log('filtercat end', this.adds);
  }
  filterByMateriau(idMat) {
    if (this.selectedMateriau === this.touteMateriaux) {
      this.adds = this.addService.addsData;
    }
    this.adds = this.addService.addsData;
    this.adds = this.adds.filter(add => add.idMat === idMat);
  }

  filterByEtat(idEtat) {
    if (this.selectedEtat === this.touteEtats) {
      this.adds = this.addService.addsData;
    }
    this.adds = this.addService.addsData;
    this.addsFitEtat = this.adds.filter(add => add.idEtat === idEtat);
    this.adds = this.addsFitCat;
    this.isFilteredEtat = true;
  }

  loadPosts() {
    this.addService.getPosts().subscribe(res => {
      this.adds = res;
      this.addService.addsData = res;
      console.log(this.adds);
    });
  }

  public loadUsers() {
    if (!this.currentUser) {
      this.currentUser = this.authService.currentUser;
      this.showMap = true;
      console.log('currentUser', this.currentUser);
    }
  }

  public deleteAdd(addId): void {
    this.addService.deletePost(addId).subscribe(() => this.loadPosts());
  }

  findme() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitudeSearch = position.coords.latitude;
        this.longitudeSearch = position.coords.longitude;
        console.log(position);
        const nomarker = true;
        this.mapComponent.showPosition(
          this.latitudeSearch,
          this.longitudeSearch,
          nomarker
        );
        console.log('avant', this.adds);

        this.adds.forEach(add => {
          this.adds = this.adds.filter(a =>
            this.mapComponent.map
              .getBounds()
              .contains({ lat: a.lat, lng: a.lng })
          );
        });
        console.log('apres', this.adds);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    if (this.patchValue) {
      this.adress = this.adressData;
    }
    this.showSelectLoc = false;
  }

  zoomFrance() {
    this.adress = 'Toute la France';
    this.mapComponent.getCenterFrance();
    this.showSelectLoc = false;
  }

  setAddress(addrObj: FormattedAdress) {
    this.zone.run(() => {
      this.mapComponent.getLatLngfromAdress(addrObj.formatted_address);
      this.adress = addrObj.formatted_address;
    });
    this.showSelectLoc = false;
  }

  clearValueLocalisation() {
    this.adress = '';
    this.mapComponent.getCenterFrance();
    this.adds = this.addService.addsData;
  }
}
