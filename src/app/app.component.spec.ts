import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule, By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { Friend } from './friends.model';
import { friendsReducer } from './friends.reducer';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule,
        MatChipsModule,
        MatButtonModule,
        StoreModule.forRoot({ friends: friendsReducer }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Visualize your Social Network Graph');
  });

  it('should add a friend to friendsList', () => {
    const input = fixture.debugElement.query(By.css('.friends-list input'));
    expect(component.friendsList).toEqual([]);
    input.triggerEventHandler('matChipInputTokenEnd', { value: 'John Doe' });
    expect(component.friendsList).toEqual(['John Doe']);
  });

  it('should remove a friend from friendsList', () => {
    component.friendsList = ['Samantha Midge', 'John Doe'];
    component.remove('John Doe');
    expect(component.friendsList).toEqual(['Samantha Midge']);
  });

  it('should update application state onSubmit', () => {
    const formDirective = new FormGroupDirective([], []);
    spyOn(formDirective, 'resetForm').and.returnValue();
    const payload: Friend = {
      name: 'John Doe',
      friends: ['David Tenzing', 'Marva Youta'],
      age: 34,
      weight: 75
    };
    component.myForm.setValue(payload);
    component.onSubmit(component.myForm, formDirective);
    component.friends$.subscribe(friends => {
      expect(friends.find(friend => payload.name === friend.name)).toBeTruthy();
    });
  });

});
