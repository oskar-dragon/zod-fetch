import { Schema, z, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export type AnyFetcher = (...args: any[]) => any;

export type DefaultFetcher = (
  ...args: Parameters<typeof fetch>
) => Promise<Response>;

export const defaultFetcher: DefaultFetcher = async (...args) => {
  const response = await fetch(...args);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
};

export type ZodFetcher<TFetcher extends AnyFetcher> = <TData>(
  schema: Schema<TData>,
  ...args: Parameters<TFetcher>
) => Promise<TData>;

export function createZodFetcher<TFetcher extends AnyFetcher>(
  fetcher: AnyFetcher = defaultFetcher,
): ZodFetcher<TFetcher> {
  return async (schema, ...args) => {
    const data = await fetcher(...args);
    return schema.parse(data);
  };
}
