import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddData } from '../models/add-data.model';
import { Subject, Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AddService {
  private addsUpdated = new Subject();
  public dataLoaded = new Subject();

  public categories: any = [];
  public etats: any = [];
  public materiaux: any = [];

  public addsData: AddData[];
  // SearchBar
  public searchOption = [];
  public filteredAddsList: AddData[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  getChampsAdd(): Observable<any> {
    // if (!this.categories || !this.etats || !this.materiaux) {
    return this.getCategories().pipe(
      switchMap(() =>
        this.getEtats().pipe(switchMap(() => this.getMateriaux()))
      )
    );
    // }
  }

  getCategories() {
    return this.http
      .get<{ categories: any }>('http://localhost:3000/api' + '/categories')
      .pipe(tap(data => (this.categories = data)));
  }

  getEtats() {
    return this.http
      .get<{ etats: any }>('http://localhost:3000/api' + '/etats')
      .pipe(tap(data => (this.etats = data)));
  }

  getMateriaux() {
    return this.http
      .get<{ materiaux: any }>('http://localhost:3000/api' + '/materiaux')
      .pipe(tap(data => (this.materiaux = data)));
  }

  getPosts() {
    return this.http.get<AddData[]>('http://localhost:3000/api' + '/annonces');
  }

  filteredListOptions() {
    let adds = this.addsData;
    for (let add of adds) {
      for (let options of this.searchOption) {
        if (options.titre === add.titre) {
          this.filteredAddsList.push(add);
        }
      }
    }
    console.log(this.filteredAddsList);
    return this.filteredAddsList;
  }
  // filteredListCategorie() {
  //   this.addsData.map(add => add)

  // }

  getAddsUpdateListener() {
    return this.addsUpdated.asObservable();
  }

  // Add Post
  addPost(
    image: File,
    categorie: string,
    titre: string,
    description: string,
    etat: string,
    materiau: string,
    hauteur: string,
    largeur: string,
    profondeur: string,
    okEnvoi: string,
    okRetraitdomicile: string,
    quantite: string,
    prix: string,
    adress: string,
    adressVille: string
  ) {
    // const post: Post = {id: null, title, content};
    const addData = new FormData(); // combiner text values et file values
    addData.append('image', image); // `image` correspond dans le back à router.post("", multer({storage: storage}).single("image"),
    addData.append('categorie', categorie);
    addData.append('titre', titre);
    addData.append('description', description);
    addData.append('etat', etat);
    addData.append('materiau', materiau);
    addData.append('hauteur', hauteur);
    addData.append('largeur', largeur);
    addData.append('profondeur', profondeur);
    addData.append('okEnvoi', okEnvoi);
    addData.append('okRetraitdomicile', okRetraitdomicile);
    addData.append('quantite', quantite);
    addData.append('prix', prix);
    addData.append('adress', adress);
    addData.append('adressVille', adressVille);
    this.http
      .post<{ message: string; add: AddData }>(
        'http://localhost:3000/api' + '/annonce',
        addData
      )
      .subscribe(responseData => {
        // const post: Post = {
        //   id: responseData.post.id,
        //   title,
        //   content,
        //   imagePath: responseData.post.imagePath
        // };
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        // Add a loading spinner quand un Post est ajouté
        this.router.navigate(['/']);
      });
  }

  deletePost(addId: string) {
    console.log('addService', addId);
    return this.http.delete('http://localhost:3000/api' + '/annonce/' + addId);
  }
}
