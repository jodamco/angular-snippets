/** @format */

import { Component } from "@angular/core";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
@Component({
  selector: "debounced-input",
  standalone: true,
  template: `<input
    [(ngModel)]="searchKey"
    (ngModelChange)="searchBoxUpdateSubject.next($event)"
  />`,
  styleUrl: "",
})
export class DebouncedInputComponent {
  public searchBoxUpdateSubject = new Subject<string>();
  public searchKey: string = "";

  constructor() {
    this.searchBoxUpdateSubject
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.searchKey = value;
      });
  }
}
