import { EventEmitter } from 'events';
import multiplex from 'multiplex';
import concat from 'concat-stream';
import dnode from 'dnode';

export default class FilesystemClient extends EventEmitter {

  constructor() {
    super();
  }

  connect(stream) {
    if (this.stream) {
      throw new Error('Already connected');
    }
    this.stream = stream;
    this.streams = {};
    this.plex = multiplex((newStream, id) => {
      this.streams[id] = newStream;
      newStream.on('end', () => {
        delete this.streams[id];
      });
    });
    this.apiStream = this.plex.receiveStream('api');
    this.api = dnode();
    this.apiStream.pipe(this.api).pipe(this.apiStream);
    this.remoteApi = new Promise(resolve => {
      this.api.on('remote', resolve);
    });
    stream.pipe(this.plex).pipe(stream);
  }

  disconnect() {
    if (!this.stream) {
      throw new Error('Not connected');
    }
    this.stream.end();
    delete this.stream;
  }

  ping(callback) {
    this.remoteApi.then(remote => {
      remote.ping(callback);
    });
  }

  readdir(path, callback) {
    this.remoteApi.then(remote => {
      remote.readdir(path, callback);
    });
  }

  readFile(path, callback) {
    this.remoteApi.then(remote => {
      remote.readFile(path, (err, streamId) => {
        if (err) {
          return callback(err);
        }
        const stream = this.streams[streamId];
        stream.pipe(concat(buffer => callback(null, buffer)));
      });
    });
  }
}
