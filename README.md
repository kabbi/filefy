# filefy

Turn anything into a (realtime-collaborative) file or filesystem.

**WARNING:** the only useful content in this repo is this README file. Everything else is just a clean babel-webpack generated boilerplate. Nothing is implemented yet.

[![Travis build status](httpф://img.shields.io/travis/kabbi/filefy.svg?style=flat)](https://travis-ci.org/kabbi/filefy)

### 1. Description

Have you ever dreamed about everything being files? When you can use your favorite tools with any abstraction, not just physical bytes on your hard drive? Are you a Unix fan (almost everything is a file), or do you enjoy Inferno OS (~~almost~~ everthing is a file, i. e. you can debug processes there by doing `cat /prog/{PID}/stack` and close network connections by `echo close > /net/tcp/{CID}/ctrl`)? Or have you ever wanted to connect that slow [jsfiddle.net](https://jsfiddle.net) code editor to your own `Atom`, with eslint and cool color schemes?

Now you can do that! This project brings you the API to define virtual filesystems in JS, to share this filesystem with anyone you want, and to bring it live to any webpage, server or your local environment.

### 2. Usage examples

Here and below, ES2015 assumed.

**NOTE:** most of this is not implemented yet, just a glimpse on how the whole API may look like.

#### 2.1 Connect to webpage textarea tag

```js
import filefy from 'filefy';

const textarea = document.getElementById('#textarea');

const fs = filefy.createFilesystem({
  '/textarea.html': {
    read: () => textarea.value,
    write: data => textarea.value = data
  }
});

fs.share().then(url => {
  // Paste this url into atom-filefy to edit textarea content
  console.log('Connect here:', url);
});
```

#### 2.2 Expose [redux](https://github.com/rackt/redux) state

```js
import filefy from 'filefy';
import store from '../somewhere';

const fs = filefy.createFilesystem({
  '/state.json': {
    read: () => (
      JSON.stringify(store.getState())
    ),
    write: data => {
      store.dispatch({
        // TODO: you need to implement this action yourself
        type: 'SET_NEW_STATE',
        payload: JSON.parse(data)
      });
    }
  }
});

fs.share().then(url => {
  // Paste this url into atom-filefy to edit redux state
  console.log('Connect here:', url);
});
```

#### 2.3 Connect to some exported fs

```js
import filefy from 'filefy';

filefy.connect('https://share-url-here').then(fs => {
  // fs mimics nodejs fs methods
  fs.readFile('/state.json', (err, data) => {
    console.log('got some data', data);
  });
});
```

### 3. TODO

- collaborative text editing (using crdt from [scuttlebutt](https://github.com/dominictarr/scuttlebutt) and [r-edit](https://github.com/dominictarr/r-edit))
- various transports (mqtt, socket.io, sock.js, raw websockets, DDP, WebRTC, raw tcp, raw udp)
- more replication back-ends (sharejs, swarm.js, scuttlebutt)
- some sort of security / access rights separation (though extremely difficult to do in distributed systems)
- various connectors
  - atom-filefy: connect and edit files with [Atom](https://atom.io)
  - (s)ftp: export resulting filesystem on nodejs side as ftp server
  - online ide: implement some web-server that would export fs as online IDE, allowing CRUD on files and text editing (so you can open 'share url' in browser and actually see something useful)
  - fuse: connect as native linux / mac fs layer
  - code-mirror, ace: seamless connectors to popular web text editor components
  - browser plugin: connect gist, jsfiddle, or any text field anywhere to filefy
