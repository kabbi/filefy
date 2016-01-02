import { expect } from 'chai';
import { FilesystemServer, FilesystemClient, WebsocketTransport } from '../../src';

const BROKER_ADDR = 'http://localhost:9999/';

describe('flows - remote', () => {
  let server;
  let client;
  let session;

  it('should start server and session', () => {
    server = new FilesystemServer({
      '/welcome': {
        content: 'Hello, world!'
      }
    });
    session = WebsocketTransport.share(BROKER_ADDR, server);
    expect(session).to.be.a('string');
    expect(session.length).to.be.at.least(10);
  });

  it('should start a client and join a session', done => {
    client = new FilesystemClient();
    WebsocketTransport.join(session, client);
    client.stream.on('connect', done);
  });

  it('should read remote file', done => {
    client.readFile('/welcome', (err, buffer) => {
      if (err) {
        return done(err);
      }
      expect(buffer).to.be.an.instanceOf(Buffer);
      expect(buffer.toString()).to.equal('Hello, world!');
      done();
    });
  });
});
