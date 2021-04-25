import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

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

  constructor(fb: FormBuilder) {
    this.myForm = fb.group({
      'name': ['', Validators.required],
      'friends': [this.friendsList, Validators.required],
      'age': [null, Validators.required],
      'weight': [null, Validators.required]
    });
  }

  onSubmit(form: FormGroup, formDirective: FormGroupDirective) {
    if (form.invalid || formDirective.invalid) { return; }
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

  remove(friend: string) {
    this.friendsList = this.friendsList.filter(friend => friend !== friend);
  }
}
