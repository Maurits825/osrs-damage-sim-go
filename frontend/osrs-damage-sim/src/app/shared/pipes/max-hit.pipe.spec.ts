import { MaxHitPipe } from './max-hit.pipe';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MaxHitPipe', () => {
  it('create an instance', () => {
    const pipe = new MaxHitPipe();
    expect(pipe).toBeTruthy();
  });
});
