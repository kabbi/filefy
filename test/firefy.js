import { expect } from 'chai';
import filefy from '../src/index';

describe('filefy', () => {
  it('should export all API methods', () => {
    expect(filefy.createFilesystem).to.be.ok;
    expect(filefy.connect).to.be.ok;
  });
});
