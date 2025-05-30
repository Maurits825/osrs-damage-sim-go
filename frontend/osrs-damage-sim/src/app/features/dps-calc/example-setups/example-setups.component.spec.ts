import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSetupsComponent } from './example-setups.component';
import { provideHttpClient } from '@angular/common/http';

describe('ExampleSetupsComponent', () => {
  let component: ExampleSetupsComponent;
  let fixture: ComponentFixture<ExampleSetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleSetupsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
