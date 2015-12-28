import { EventEmitter } from 'events';
import multiplex from 'multiplex';
import dnode from 'dnode';

import EntryType from './entities/EntryType';
import FileTree from './entities/FileTree';
import FilefyException from './entities/FilefyException';

import { randomUUID } from './utils/Random';
import { makeBuffer } from './utils/Buffer';

const METHOD_PREFIX = 'handle';

export default class FilesystemServer extends EventEmitter {
  constructor(options = {}) {
    super();
    this.clients = {};
    this.api = this.populateApiObject();
    this.tree = new FileTree(options);
  }

  handleReadFile(clientId, path, callback) {
    try {
      const file = this.tree.getEntryByPath(path);
      if (file.type === EntryType.Directory) {
        return callback(new FilefyException('Is a directory'));
      }
      const streamId = randomUUID();
      const stream = this.clients[clientId].plex.createStream(streamId);
      stream.end(makeBuffer(file.content || file.data));
      callback(null, streamId);
    } catch (err) {
      callback(err);
    }
  }

  handleReaddir(clientId, path, callback) {
    try {
      const dir = this.tree.getEntryByPath(path);
      callback(null, Object.keys(dir.children));
    } catch (err) {
      callback(err);
    }
  }

  handlePing(clientId, callback) {
    callback('hello, client ' + clientId);
  }

  populateApiObject() {
    return Object.getOwnPropertyNames(
      FilesystemServer.prototype
    ).reduce((object, key) => {
      if (key.indexOf(METHOD_PREFIX) === 0) {
        let method = key.substr(METHOD_PREFIX.length);
        method = method[0].toLowerCase() + method.substr(1);
        object[method] = FilesystemServer.prototype[key];
      }
      return object;
    }, {});
  }

  bindApiForClient(clientId) {
    const api = {};
    for (const methodName of Object.keys(this.api)) {
      api[methodName] = this.api[methodName].bind(this, clientId);
    }
    return api;
  }

  onClientConnected(stream, id) {
    const plex = multiplex();
    const apiStream = plex.createStream('api');
    const api = dnode(this.bindApiForClient(id));
    apiStream.pipe(api).pipe(apiStream);
    stream.pipe(plex).pipe(stream);
    this.clients[id] = {
      id, stream, plex, api
    };
  }

  share(stream) {
    const plex = multiplex(::this.onClientConnected);
    stream.pipe(plex).pipe(stream);
  }
}
