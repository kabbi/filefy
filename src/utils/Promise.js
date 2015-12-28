export const fallback = (callback = () => {}) => [
  result => {
    callback(null, result);
    return result;
  },
  error => {
    callback(error);
    return error;
  }
];

export const promisify = (resolve, reject) => (err, result) => {
  if (err) {
    reject(err);
  }
  resolve(result);
};
