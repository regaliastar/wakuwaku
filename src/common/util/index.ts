export const getHash = (): string => {
  const hash = location.hash;
  const path = hash ? hash.substring(1) : '/';
  return path;
};
