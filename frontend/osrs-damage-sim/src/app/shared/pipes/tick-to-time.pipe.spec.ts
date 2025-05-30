import { TickToTimePipe } from './tick-to-time.pipe';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TickToTimePipe', () => {
  it('create an instance', () => {
    const pipe = new TickToTimePipe();
    expect(pipe).toBeTruthy();
  });
});
