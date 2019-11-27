export interface AddData {
  _id: string;
  idUser: string;
  nomUser: string;
  categorie: string;
  idCat?: string;
  idMat?: string;
  idEtat?: string;
  titre: string;
  description: string;
  etat: string;
  materiau: string;
  hauteur: number;
  largeur: number;
  profondeur: number;
  okEnvoi: boolean;
  okRetraitdomicile: boolean;
  quantite: number;
  prix: number;
  lat: number;
  lng: number;
  image: string;
}
