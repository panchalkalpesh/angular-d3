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
  friendsList: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  myForm: FormGroup;
  friends$: Observable<Friend[]>;

  constructor(fb: FormBuilder, private store: Store<{ friends: Friend[] }>) {
    this.myForm = fb.group({
      name: ['', Validators.required],
      friends: [this.friendsList, Validators.required],
      age: [null, Validators.required],
      weight: [null, Validators.required]
    });
    this.friends$ = store.select('friends');
  }


  /**
   * Handler for Submitting the Form, Adds Valid Inputs to Friends[]
   * @param form FormGroup
   * @param formDirective FormGroupDirective
   * @returns void
   */
  onSubmit(form: FormGroup, formDirective: FormGroupDirective): void {
    if (form.invalid || formDirective.invalid) { return; }
    const { name, friends, age, weight } = form.value;
    this.store.dispatch(ADD_FRIEND({ name, friends, age, weight }));
    this.friendsList = [];
    formDirective.resetForm(); // Angula Material checks the validity of FormGroupDirective and not the FormGroup
  }


  /**
   * Adds a chip to friendsList / friendsChipList and resets the input
   * @param event MatChipInputEvent containing a Friend's Name of type string
   */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.friendsList.push(value.trim());
      this.myForm.get('friends')?.setValue(this.friendsList);
    }

    if (input) { input.value = ''; }
  }


  /**
   * Removes a Friend from friendsList / friendsChipList, Invokes on backspace / delete
   * @param friend Friend's Name to be removed
   */
  remove(friend: string): void {
    this.friendsList = this.friendsList.filter(f => f !== friend);
  }
}
