import { expect } from 'chai';
import filefy from '../src/index';

describe('filefy', () => {
  it('should re-export several classes', () => {
    expect(filefy.FilesystemServer).to.be.ok;
    expect(filefy.FilesystemServer).to.be.ok;
  });

  it('should export several API methods');
});
