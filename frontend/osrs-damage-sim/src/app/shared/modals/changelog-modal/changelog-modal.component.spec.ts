import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogModalComponent } from './changelog-modal.component';

describe('ChangelogComponent', () => {
  let component: ChangelogModalComponent;
  let fixture: ComponentFixture<ChangelogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangelogModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
