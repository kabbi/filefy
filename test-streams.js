/* eslint-disable no-console */
const multiplex = require('multiplex');

const plex1 = multiplex();

const plex2 = multiplex((stream, id) => {
  stream.on('data', buffer => {
    console.log('plex2 got substream ' + id + ' data "' + buffer.toString() + '"');
  });
  console.log('plex2 -> ' + id);
  stream.write(new Buffer('answer from plex2 to ' + id));
});

plex1.pipe(plex2).pipe(plex1);

const stream1 = plex1.createStream('s1');
const stream2 = plex1.createStream('s2');

stream1.write(new Buffer('stream one!'));
stream1.on('data', buffer => {
  console.log('stream1 got data "' + buffer.toString() + '"');
});

stream2.write(new Buffer('stream two!'));
stream2.on('data', buffer => {
  console.log('stream2 got data "' + buffer.toString() + '"');
});
