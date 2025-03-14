import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcLabelComponent } from './npc-label.component';

describe('NpcLabelComponent', () => {
  let component: NpcLabelComponent;
  let fixture: ComponentFixture<NpcLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpcLabelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NpcLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
