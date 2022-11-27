/** Create an array from async generator. */
export const arrayFromAsyncGenerator = async <T>(
  generator: AsyncGenerator<T>
): Promise<T[]> => {
  const result: T[] = [];
  for await (const val of generator) {
    result.push(val);
  }
  return result;
};
