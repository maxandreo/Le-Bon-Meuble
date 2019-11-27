import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import {} from 'googlemaps';
import { AddData } from '../../models/add-data.model';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input() adds: AddData[];
  @Input() latitude: number;
  @Input() longitude: number;
  @Input() latUser;
  @Input() lngUser;
  @Input() isPageSearch = false;

  public mapProperties;
  public infowindow;
  public geocoder;
  public formattedAdress;
  public marker;
  public latFr: number = 46.227638;
  public lngFr: number = 2.213749;

  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  constructor(private googleMapsService: GoogleMapsService) {}

  ngOnInit() {
    this.geocoder = new google.maps.Geocoder();
    this.mapProperties = {
      center: new google.maps.LatLng(
        this.latUser ? this.latUser : 46.20573549609438,
        this.lngUser ? this.lngUser : 2.6930654375000813
      ),
      zoom: this.latUser && this.lngUser ? 8 : 5,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      this.mapProperties
    );

    // Localisation annonces
    this.getAddsMarkers();

    // Géolocalisation utilisateur
    if (this.latitude && this.longitude) {
      this.showPosition(this.latitude, this.longitude);
    }

    if (this.isPageSearch) {
      this.getCenterFrance();
    }
  }

  public getAddsMarkers(latitude?, longitude?) {
    if (this.adds) {
      this.getAdress(latitude, longitude);
      console.log('dans le map', this.adds[0].lat);
      for (let i = 0; i < this.adds.length; i++) {
        const add = this.adds[i];
        this.marker = new google.maps.Marker({
          position: {
            lat: add.lat,
            lng: add.lng
          },
          map: this.map
        });
        this.map.setZoom(8);
      }
    }
  }

  public getCenterFrance() {
    this.geocoder.geocode({ address: 'France' }, (results, status) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        // this.map.fitBounds(results[0].geometry.viewport);
        const bounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(41.333, -5.225),
          new google.maps.LatLng(51.2, 9.55)
        );
        this.map.fitBounds(bounds);
        this.map.setZoom(5);
      }
    });
  }

  public getLatLngfromAdress(formatted_address, hasMarker?) {
    this.geocoder.geocode({ address: formatted_address }, (results, status) => {
      if (status === 'OK') {
        console.log('results', results[0]);
        if (hasMarker) {
          this.marker = new google.maps.Marker({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            map: this.map
          });
        }
        this.map.setCenter(results[0].geometry.location);
        if (results[0].types.includes('street_address')) {
          this.map.setZoom(14);
        } else if (
          results[0].types.includes('locality') ||
          results[0].types.includes('postal_code')
        ) {
          this.map.setZoom(11);
        } else if (results[0].types.includes('administrative_area_level_2')) {
          this.map.setZoom(8);
        } else if (
          results[0].types.includes('administrative_area_level_1') ||
          results[0].types.includes('colloquial_area')
        ) {
          this.map.setZoom(7);
        }
      }
    });
  }

  public showPosition(latitude, longitude, nomarker?) {
    const location = new google.maps.LatLng(latitude, longitude);
    this.map.panTo(location);
    this.map.setCenter(location);
    if (nomarker) {
      this.map.setZoom(11);
      this.getAdress(latitude, longitude);
    } else {
      this.map.setZoom(15);
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map
      });
      this.getAdress(latitude, longitude, this.marker);
    }
  }

  private getAdress(latitude, longitude, marker?) {
    const latlng = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
    this.geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log('results', results);
          this.infowindow = new google.maps.InfoWindow({
            content: results[0].formatted_address
          });
          if (marker) {
            marker.addListener('click', () => {
              this.infowindow.open(this.map, marker);
            });
          }
          this.googleMapsService.informDataChanges(
            results[0].formatted_address
          );
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

  clearMarkers() {
    this.marker.setMap(null);
    this.map.setZoom(7);
  }
}
