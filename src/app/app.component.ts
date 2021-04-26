import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ADD_FRIEND } from './friends.actions';
import { Friend } from './friends.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-d3';
  friendsList: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  myForm: FormGroup;
  friends$: Observable<Friend[]>;

  constructor(fb: FormBuilder, private store: Store<{ friends: Friend[] }>) {
    this.myForm = fb.group({
      'name': ['', Validators.required],
      'friends': [this.friendsList, Validators.required],
      'age': [null, Validators.required],
      'weight': [null, Validators.required]
    });
    this.friends$ = store.select('friends');
  }

  onSubmit(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.invalid || formDirective.invalid) { return; }
    const { name, friends, age, weight } = form.value;
    this.store.dispatch(ADD_FRIEND({ name, friends, age, weight }));
    this.friendsList = [];
    formDirective.resetForm(); // Angula Material checks the validity of FormGroupDirective and not the FormGroup
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.friendsList.push(value.trim());
      this.myForm.get('friends')?.setValue(this.friendsList);
    }

    if (input) { input.value = ''; }
  }

  remove(friend: string): void {
    this.friendsList = this.friendsList.filter(f => f !== friend);
  }
}
