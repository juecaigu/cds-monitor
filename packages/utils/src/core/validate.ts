const ifExist = (value: unknown) => {
  return value !== undefined && value !== null;
};

const typeofValue = (obj: unknown) => {
  if (typeof obj !== "object") {
    return typeof obj;
  }
  return Object.prototype.toString
    .call(obj)
    .split(" ")[1]
    .slice(0, -1)
    .toLocaleLowerCase();
};

export { ifExist, typeofValue };
