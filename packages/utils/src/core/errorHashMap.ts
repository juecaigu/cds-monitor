const ErrorHashMap = () => {
  const errorMap: Map<string, boolean> = new Map();
  const getHash = (hash: string) => {
    return errorMap.get(hash);
  };
  const setHash = (hash: string) => {
    errorMap.set(hash, true);
  };
  const hashExist = (hash: string) => {
    const exist = getHash(hash);
    if (!exist) {
      setHash(hash);
    }
    return exist;
  };
  return {
    getHash,
    setHash,
    hashExist,
  };
};

const errorHashMap = ErrorHashMap();

export { errorHashMap };
