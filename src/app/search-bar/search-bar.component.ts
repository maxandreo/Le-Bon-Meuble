import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { AddService } from '../services/add.service';
import { AddData } from '../models/add-data.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  adds: AddData[];
  autoCompleteList: any[];

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() selectedOption = new EventEmitter();

  constructor(public addService: AddService) {}

  ngOnInit() {
    // get all the post
    this.addService.getPosts().subscribe(posts => {
      this.adds = posts;
    });

    // when user types something in input, the value changes will come through this
    this.myControl.valueChanges.subscribe(userInput => {
      this.autoCompleteExpenseList(userInput);
    });
  }

  private autoCompleteExpenseList(input) {
    const categoryList = this.filterCategoryList(input);
    this.autoCompleteList = categoryList;
  }

  // this is where filtering the data happens according to you typed value
  filterCategoryList(val) {
    let categoryList = [];
    if (typeof val !== 'string') {
      return [];
    }
    if (val === '' || val === null) {
      return [];
    }
    return val
      ? this.adds.filter(
          s => s.titre.toLowerCase().indexOf(val.toLowerCase()) != -1
        )
      : this.adds;
  }

  // after you clicked an autosuggest option, this function will show the field you want to show in input
  displayFn(post: AddData) {
    const k = post ? post.titre : post;
    return k;
  }

  filterPostList(event) {
    const posts = event.source.value;
    if (!posts) {
      this.addService.searchOption = [];
    } else {
      this.addService.searchOption.push(posts);
      this.selectedOption.emit(this.addService.searchOption);
    }
    this.focusOnPlaceInput();
  }

  removeOption(option) {
    const index = this.addService.searchOption.indexOf(option);
    if (index >= 0) {
      this.addService.searchOption.splice(index, 1);
    }
    this.focusOnPlaceInput();

    this.selectedOption.emit(this.addService.searchOption);
  }

  // focus the input field and remove any unwanted text.
  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }
}
