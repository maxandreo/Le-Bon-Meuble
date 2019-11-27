export interface GooglePlaces {
  address_components: AdressComponents[];
  formatted_address: string;
}

export interface AdressComponents {
  long_name: any;
  short_name: any;
  types: string[];
}

export interface FormattedAdress {
  formatted_address: any;
  locality?: any;
  postal_code?: any;
  political?: any;
  administrative_area_level_2?: any;
  admin_area_l1?: any;
  country?: any;
  street_number?: any;
  route?: any;
}
