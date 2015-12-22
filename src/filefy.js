import FilesystemServer from './FilesystemServer';
import FilesystemClient from './FilesystemClient';
import Connection from './Connection';

export const createFilesystem = options => {
  return new FilesystemServer(options);
};

export const connect = (address, options) => {
  const connection = new Connection(address, options);
  return new FilesystemClient(connection);
};
