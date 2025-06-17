import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostModalComponent } from './boost-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Boost } from 'src/app/model/osrs/boost.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BoostModalComponent', () => {
  let component: BoostModalComponent;
  let fixture: ComponentFixture<BoostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [BoostModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
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
