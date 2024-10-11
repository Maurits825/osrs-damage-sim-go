import { InjectionToken } from '@angular/core';
import { InputGearSetup } from '../dps-calc/input-setup.model';

export const INPUT_GEAR_SETUP_TOKEN = new InjectionToken<InputGearSetup>('InputGearSetup');
export const GEAR_SETUP_TOKEN = new InjectionToken<InputGearSetup>('GearSetup');
