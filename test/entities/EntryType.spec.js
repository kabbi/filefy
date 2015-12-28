import { expect } from 'chai';
import EntryType from '../../src/entities/EntryType';

describe('entities - EntryType', () => {
  it('should export all entry types', () => {
    expect(EntryType).to.be.an('object');
    expect(Object.keys(EntryType).length).to.be.at.least(2);
  });
});
