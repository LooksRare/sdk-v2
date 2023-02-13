import { keccak256, BytesLike } from "ethers/lib/utils";

const makeArray = <T>(len: number, getValue: (i: number) => T) =>
  Array(len)
    .fill(0)
    .map((_, i) => getValue(i));

export const chunk = <T>(array: T[], size: number) => {
  return makeArray(Math.ceil(array.length / size), (i) => array.slice(i * size, (i + 1) * size));
};

export const hexToBuffer = (value: string) => Buffer.from(value.slice(2), "hex");

export const bufferKeccak = (value: BytesLike) => hexToBuffer(keccak256(value));

export const fillArray = <T>(arr: T[], length: number, value: T) => {
  if (length > arr.length) {
    arr.push(...Array(length - arr.length).fill(value));
  }
  return arr;
};
