import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSetupsComponent } from './example-setups.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { StaticDataService } from 'src/app/services/static-data.service';

describe('ExampleSetupsComponent', () => {
  let component: ExampleSetupsComponent;
  let fixture: ComponentFixture<ExampleSetupsComponent>;
  let staticDataService: StaticDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleSetupsComponent],
      providers: [provideHttpClient(), StaticDataService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load example setups', async () => {
    await fixture.whenStable();
    staticDataService = TestBed.inject(StaticDataService);
    //we have to wait for json to load...
    await firstValueFrom(staticDataService.allGearSlotItems$);

    for (const exampleSetup of component.exampleSetups) {
      component.selectedSetupChange(exampleSetup);
      //todo what can we check...
    }
  });
});
