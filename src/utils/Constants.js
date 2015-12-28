export const createConstants = (fields) => fields.reduce((obj, field) => {
  obj[field] = field;
  return obj;
}, {});
