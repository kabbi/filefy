import expect from 'expect';
import Library from '../src/index';

describe('Library', () => {
  describe('foo', () => {
    it(`should return "foo bar" when its id is bar.`, () => {
      const lib = new Library({id: 'bar'});
      expect(lib.foo()).toBe(`foo bar`);
    });
  });
});
