import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostModalComponent } from './boost-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Boost } from 'src/app/model/osrs/boost.model';

describe('BoostModalComponent', () => {
  let component: BoostModalComponent;
  let fixture: ComponentFixture<BoostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [BoostModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostModalComponent);
    component = fixture.componentInstance;
    component.selectedBoosts = new Set<Boost>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
