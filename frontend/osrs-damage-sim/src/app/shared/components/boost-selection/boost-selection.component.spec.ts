import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostSelectionComponent } from './boost-selection.component';
import { Boost } from 'src/app/model/osrs/boost.model';

describe('BoostSelectionComponent', () => {
  let component: BoostSelectionComponent;
  let fixture: ComponentFixture<BoostSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostSelectionComponent);
    component = fixture.componentInstance;
    component.selectedBoosts = new Set<Boost>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
