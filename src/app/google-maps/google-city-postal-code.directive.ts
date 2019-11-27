import {
  Directive,
  ElementRef,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import {} from 'googlemaps';
import { GooglePlaces, FormattedAdress } from '../models/google-places.model';

@Directive({
  selector: '[google-city-postal-code]'
})
export class GoogleCityPostalCodeDirective implements OnInit {
  @Output() select: EventEmitter<any> = new EventEmitter();
  private element: HTMLInputElement;

  constructor(elRef: ElementRef) {
    this.element = elRef.nativeElement;
  }

  getFormattedAddress(place) {
    console.log(place.address_components);
    //@params: place - Google Autocomplete place object
    //@returns: location - An address object in human readable format
    const location = {} as FormattedAdress;
    for (const item of place.address_components) {
      location.formatted_address = place.formatted_address;
      if (item.types.indexOf('locality') > -1) {
        location.locality = item.long_name;
      } else if (item.types.indexOf('administrative_area_level_1') > -1) {
        location.admin_area_l1 = item.short_name;
      } else if (item.types.indexOf('street_number') > -1) {
        location.street_number = item.short_name;
      } else if (item.types.indexOf('route') > -1) {
        location.route = item.long_name;
      } else if (item.types.indexOf('country') > -1) {
        location.country = item.long_name;
      } else if (item.types.indexOf('postal_code') > -1) {
        location.postal_code = item.short_name;
      }
    }
    return location;
  }

  ngOnInit() {
    const options = {
      types: ['(regions)'],
      componentRestrictions: { country: 'fr' }
    };
    const autocomplete = new google.maps.places.Autocomplete(
      this.element,
      options
    );
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      this.select.emit(this.getFormattedAddress(autocomplete.getPlace()));
    });
  }
}
