import { Injectable, OnInit, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService implements OnInit {
  myNewSubject = new Subject<any>();

  constructor() {}

  ngOnInit() {}

  informDataChanges(passyourobject) {
    this.myNewSubject.next(passyourobject);
  }
}
