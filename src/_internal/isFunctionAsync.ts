export const isFunctionAsync = (func: Function) =>
  func.constructor.name === 'AsyncFunction'
