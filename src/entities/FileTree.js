import PathUtils from 'path';

import FilefyException from './FilefyException';
import EntryType from './EntryType';

export default class FileTree {
  constructor(options = {}) {
    this.root = {
      children: {}
    };
    this.ensureDirectory('/');
    this.addFiles(options);
  }

  // TODO: write better addFile and removeFile (use file paths)

  addFile(path, file) {
    this.getEntryByPath(path).children[file.name] = {
      ...file,
      type: EntryType.File
    };
  }

  removeFile(path, file) {
    delete this.getEntryByPath(path).children[file.name];
  }

  addFiles(files, target = '/') {
    for (const path of Object.keys(files)) {
      const dirPath = PathUtils.join(target, PathUtils.dirname(path));
      const fileName = PathUtils.basename(path);
      const file = {
        name: fileName,
        ...files[path],
        children: {}
      };
      this.ensureDirectory(dirPath);
      this.addFile(dirPath, file);
      const children = files[path].children;
      if (children) {
        this.addFiles(children, dirPath);
      }
    }
  }

  ensureDirectory(path) {
    let root = this.root;
    const entries = FileTree.splitPath(path);
    for (const entry of entries) {
      if (!root.children[entry]) {
        root.children[entry] = {
          type: EntryType.Directory,
          children: {},
          name: entry
        };
      }
      root = root.children[entry];
    }
    return root;
  }

  getEntryByPath(path) {
    let root = this.root;
    const entries = FileTree.splitPath(path);
    for (const entry of entries) {
      if (!root.children[entry]) {
        throw new FilefyException('File not found: ' + path);
      }
      root = root.children[entry];
    }
    return root;
  }

  static splitPath(path) {
    if (path === '/') {
      return [''];
    }
    return path.split(PathUtils.sep);
  }
}
