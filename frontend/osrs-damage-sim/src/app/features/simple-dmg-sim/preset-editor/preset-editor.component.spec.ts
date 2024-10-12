import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresetEditorComponent } from './preset-editor.component';

describe('PresetEditorComponent', () => {
  let component: PresetEditorComponent;
  let fixture: ComponentFixture<PresetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PresetEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
