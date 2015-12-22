import { expect } from 'chai';
import { Util } from '../src/index';

describe('Util', () => {
  describe('add', () => {
    it(`should return 3 when input 1 and 2.`, () => {
      expect(Util.add(1, 2)).to.equal(3);
    });
  });
});
