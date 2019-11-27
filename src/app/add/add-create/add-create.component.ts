import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AddData } from '../../models/add-data.model';
import { AddService } from '../../services/add.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { FormattedAdress } from 'src/app/models/google-places.model';
import { MapComponent } from 'src/app/google-maps/map/map.component';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-add-create',
  templateUrl: './add-create.component.html',
  styleUrls: ['./add-create.component.scss']
})
export class AddCreateComponent implements OnInit, OnDestroy {
  public latitude: number;
  public longitude: number;
  public geoloc = false;
  public addr: object;

  public shareAdress;
  public patchValue = false;
  public adressVilleData;
  public adressData;

  @ViewChild('mapComponent') mapComponent: MapComponent;

  error_messages = {
    categorie: [{ type: 'required', message: 'Catégorie requise' }],
    titre: [
      { type: 'required', message: 'Titre requis' },
      { type: 'minlength', message: '3 caractères minimum' },
      { type: 'maxlength', message: '20 caractères maximum' }
    ],
    description: [
      { type: 'required', message: 'Description requise' },
      { type: 'minlength', message: '3 caractères minimum' },
      { type: 'maxlength', message: '200 caractères maximum' }
    ],
    etat: [{ type: 'required', message: `Etat de l'article requis` }],
    hauteur: [
      { type: 'required', message: `Hauteur requise` },
      { type: 'min', message: 'Minimum 0' },
      { type: 'maxlength', message: '3 caractères maximum' }
    ],
    largeur: [
      { type: 'required', message: `Largeur requise` },
      { type: 'min', message: 'Minimum 0' },
      { type: 'maxlength', message: '3 caractères maximum' }
    ],
    quantite: [
      { type: 'required', message: `Quantité requise` },
      {
        type: 'min',
        message: 'Veuillez entrer une quantité valide (minimum 1)'
      }
    ],
    prix: [
      { type: 'required', message: `Prix requis` },
      { type: 'min', message: 'Veuillez entrer un prix valide (minimum 0)' }
    ],
    adressVille: [{ type: 'required', message: `Ville ou code postal requis` }]
  };

  form: FormGroup;
  add: AddData;

  public urls = [];
  public imagePreview: string;
  public okEnvoi: boolean = false;
  public okRetraitdomicile: boolean = true;

  private mode = 'create';

  public categories: any = [];
  private categoriesSub: Subscription;
  public etats: any = [];
  private etatsSub: Subscription;
  public materiaux: any = [];
  private materiauxSub: Subscription;

  private authStatusSub: Subscription;

  constructor(
    public addService: AddService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public fb: FormBuilder,
    private zone: NgZone,
    private googleMapsService: GoogleMapsService
  ) {
    this.form = fb.group({
      image: new FormControl(null, { asyncValidators: [mimeType] }),
      categorie: new FormControl('', Validators.compose([Validators.required])),
      titre: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
        ])
      ),
      adress: new FormControl(''),
      adressVille: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200)
        ])
      ),
      etat: new FormControl('', Validators.compose([Validators.required])),
      materiau: new FormControl('', Validators.compose([Validators.required])),
      hauteur: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.maxLength(3)
        ])
      ),
      largeur: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.maxLength(3)
        ])
      ),
      profondeur: new FormControl(''),
      okEnvoi: new FormControl(false),
      okRetraitdomicile: new FormControl(true),
      quantite: new FormControl(
        1,
        Validators.compose([Validators.required, Validators.min(1)])
      ),
      prix: new FormControl(
        0,
        Validators.compose([Validators.required, Validators.min(0)])
      )
    });
    this.googleMapsService.myNewSubject.subscribe(data => {
      this.adressVilleData = data.split(',')[1].slice(1);
      this.adressData = data.split(',')[0];
      this.form.patchValue({ adressVille: this.adressVilleData });
      this.form.patchValue({ adress: this.adressData });
      this.patchValue = true;
    });
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {});
    this.addService.getChampsAdd().subscribe(() => {
      this.categories = this.addService.categories;
      this.materiaux = this.addService.materiaux;
      this.etats = this.addService.etats;
    });
  }

  findme() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(position);
        if (
          this.mapComponent.map
            .getBounds()
            .contains(this.mapComponent.marker.getPosition())
        ) {
          this.mapComponent.showPosition(this.latitude, this.longitude);
        }
        this.geoloc = true;
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    if (this.patchValue) {
      this.form.patchValue({ adressVille: this.adressVilleData });
      this.form.patchValue({ adress: this.adressData });
    }
  }

  setAddressCity(addrObj: FormattedAdress) {
    const hasMarker = true;
    this.zone.run(() => {
      this.mapComponent.getLatLngfromAdress(
        addrObj.formatted_address,
        hasMarker
      );
      this.form.patchValue({ adressVille: addrObj.formatted_address });
    });
  }

  setAddress(addrObj: FormattedAdress) {
    const hasMarker = true;
    this.zone.run(() => {
      console.log('addrObj', addrObj);
      this.mapComponent.getLatLngfromAdress(
        addrObj.formatted_address,
        hasMarker
      );
      this.form.patchValue({ adress: addrObj.formatted_address });
      if (!this.form.value.adressVille) {
        const villePostalCode = addrObj.formatted_address
          .split(',')[1]
          .slice(1);
        this.form.patchValue({ adressVille: villePostalCode });
      }
    });
  }

  clearValueLocalisation() {
    this.form.patchValue({ adress: '' });
    this.form.patchValue({ adressVille: '' });
    this.mapComponent.clearMarkers();
  }

  valueToggleEnvoi(value) {
    if (value.checked == true) {
      this.okEnvoi = true;
    } else {
      this.okEnvoi = false;
    }
  }

  valueToggleRetrait(value) {
    if (value.checked == true) {
      this.okRetraitdomicile = true;
    } else {
      this.okRetraitdomicile = false;
    }
  }

  // loadCategories() {
  //   this.categoriesSub = this.addService
  //     .getCategories()
  //     .subscribe(categorieData => {
  //       this.categories = categorieData;
  //     });
  // }

  // loadEtats() {
  //   this.etatsSub = this.addService.getEtats().subscribe(etatData => {
  //     this.etats = etatData;
  //   });
  // }

  // loadMateriaux() {
  //   this.materiauxSub = this.addService
  //     .getMateriaux()
  //     .subscribe(materiauxData => {
  //       this.materiaux = materiauxData;
  //     });
  // }

  getRedTitre(Titre: HTMLInputElement) {
    if (Titre.value.length > 50) {
      return 'red';
    }
  }

  getRedDesc(Desc: HTMLTextAreaElement) {
    if (Desc.value.length > 200) {
      return 'red';
    }
  }

  onImagePicked(event: Event) {
    let image;
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    // Cibler une seule value du form
    this.form.patchValue({ image: file });
    // Get access to the image et informer que file a changé,
    // le réevaluer et le valider
    this.form.get('image').updateValueAndValidity();
    // console.log(file);
    // console.log(this.form);
    // Créer URL de l'img, la preview de l'img
    const reader = new FileReader();
    reader.onload = () => {
      image = reader.result as string;
      this.urls.push(image);
      // console.log(image);
    };
    reader.readAsDataURL(file);
  }

  ajouterAdd() {
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.addService.addPost(
        this.form.value.image,
        this.form.value.categorie,
        this.form.value.titre,
        this.form.value.description,
        this.form.value.etat,
        this.form.value.materiau,
        this.form.value.hauteur,
        this.form.value.largeur,
        this.form.value.profondeur,
        this.form.value.okEnvoi,
        this.form.value.okRetraitdomicile,
        this.form.value.quantite,
        this.form.value.prix,
        this.form.value.adress,
        this.form.value.adressVille
      );
    }
    console.log(this.form.value.image);
    console.log('Submit :', this.form);
    //  else {
    //   this.postsService.updatePost(
    //     this.postId,
    //     this.form.value.title,
    //     this.form.value.content,
    //     this.form.value.image
    //   );
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
