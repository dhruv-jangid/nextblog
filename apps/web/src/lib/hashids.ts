import "server-only";
import Hashids from "hashids";

const hashIdSalt = process.env.HASHIDS_SALT;
if (!hashIdSalt) {
  throw new Error("HASHIDS_SALT is not defined in environment variables");
}

const hashids = new Hashids(hashIdSalt, 8);

export const encodeId = (id: string) => {
  return hashids.encode(BigInt(id));
};

export const decodeId = (hash: string) => {
  const isValid = hashids.isValidId(hash);
  if (!isValid) {
    return null;
  }

  const result = hashids.decode(hash);
  if (!result.length) {
    return null;
  }

  return result[0].toString();
};
