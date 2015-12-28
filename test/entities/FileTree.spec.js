import { expect } from 'chai';
import FileTree from '../../src/entities/FileTree';

describe('entities - FileTree', () => {
  it('should export valid class', () => {
    expect(FileTree).to.be.a('function');
  });

  it('should add and remove a file', () => {
    const tree = new FileTree();
    tree.addFile('/', {
      name: 'file',
      content: 'hello'
    });
    const file = tree.getEntryByPath('/file');
    expect(file).to.be.ok;
    expect(file.name).to.equal('file');
    expect(file.content).to.equal('hello');
    tree.removeFile('/', {
      name: 'file'
    });
    expect(() => {
      tree.getEntryByPath('/file');
    }).to.throw(/file not found/i);
  });

  it('should add several files at once', () => {
    const tree = new FileTree();
    tree.addFiles({
      '/file1': {
        data: 42
      },
      '/some/another/file': {
        realtime: true
      }
    });
    const root = tree.getEntryByPath('/');
    expect(root).to.be.ok;
    expect(root.children).to.be.an('object');
    expect(root.children['file1'].data).to.equal(42);
    expect(root.children['some'].type).to.equal('Directory');
  });
});
