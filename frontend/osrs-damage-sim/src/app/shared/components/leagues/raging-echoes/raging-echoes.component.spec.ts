import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagingEchoesComponent } from './raging-echoes.component';

describe('RagingEchoesComponent', () => {
  let component: RagingEchoesComponent;
  let fixture: ComponentFixture<RagingEchoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RagingEchoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RagingEchoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
