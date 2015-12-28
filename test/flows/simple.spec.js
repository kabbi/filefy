import { expect } from 'chai';
import { FilesystemServer, FilesystemClient } from '../../src';

import multiplex from 'multiplex';

describe('flows - simple', () => {
  let server;
  let client;
  let plex;

  it('should prepare the streams', () => {
    plex = multiplex();
  });

  it('should start the server', () => {
    server = new FilesystemServer({
      '/some/long/path/file': {
        content: 'the content'
      },
      '/folder/file': {
        content: 'another content'
      },
      '/rootFile': {
        read: Math.random
      },
      '/folder/anotherFile': {
        content: 'overlapping dir'
      }
    });
    server.share(plex);
  });

  it('should start the client', () => {
    const clientStream = plex.createStream('test-client');
    client = new FilesystemClient();
    client.connect(clientStream);
  });

  it('should ping each other', done => {
    client.ping(answer => {
      expect(answer).to.equal('hello, client test-client');
      done();
    });
  });

  it('should get the list of root files', done => {
    client.readdir('/', (err, files) => {
      if (err) {
        return done(err);
      }
      expect(files).to.deep.equal([
        'some',
        'folder',
        'rootFile'
      ]);
      done();
    });
  });

  it('should read a file', done => {
    client.readFile('/some/long/path/file', (err, buffer) => {
      if (err) {
        return done(err);
      }
      expect(buffer).to.be.an.instanceOf(Buffer);
      expect(buffer.toString()).to.equal('the content');
      done();
    });
  });

  it('should gracefully shutdown', () => {
    client.disconnect();
    plex.end();
  });
});
