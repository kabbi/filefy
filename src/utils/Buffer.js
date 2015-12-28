export const makeBuffer = (obj) => {
  if (Buffer.isBuffer(obj)) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return Buffer.concat(obj.map(o => makeBuffer(o)));
  }
  if (typeof obj === 'string') {
    return new Buffer(obj);
  }
  if (typeof obj === 'number') {
    return new Buffer([obj]);
  }
  return new Buffer(JSON.stringify(obj));
};
