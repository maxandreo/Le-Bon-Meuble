import { Component, OnInit, Input } from '@angular/core';
import { AddData } from 'src/app/models/add-data.model';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  @Input() adds: AddData[];
  public add: AddData;
  constructor() {}

  ngOnInit() {
    // this.getAdd();
  }

  // public getAdd() {
  //   console.log('add-card', this.adds);
  //   for (let i = 0; i < this.adds.length; i++) {
  //     this.add = this.adds[i];
  //     break;
  //   }
  // }
}
