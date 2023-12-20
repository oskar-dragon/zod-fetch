import { createZodFetcher, defaultFetcher } from './createZodFetcher';
import { getHelloErrorPath, getHelloPath } from './mocks/handlers';
import { server } from './mocks/node';
import 'isomorphic-fetch';
import { ZodError, z } from 'zod';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('defaultFetcher()', () => {
  it("should return data if there's no error", async () => {
    const data = await defaultFetcher(getHelloPath);

    const expected = { name: 'John' };
    expect(data).toEqual(expected);
  });

  it('should throw an error if response is not ok', async () => {
    await expect(defaultFetcher(getHelloErrorPath)).rejects.toMatchSnapshot(
      '[Error: Request failed with status 403]',
    );
  });
});

const schema = z.object({
  name: z.string(),
});

const incorrectSchema = z.object({
  name: z.number(),
});

// It should work with custom fetcher
// it should throw a zod error if schema doesn't match

describe('createZodFetcher()', () => {
  it('should return a fetcher function', async () => {
    const zodFeacher = createZodFetcher();
    const data = await zodFeacher(schema, getHelloPath);

    expect(data).toEqual({ name: 'John' });
  });

  it.skip('should throw a zod error if schema does not match', async () => {
    const zodFetcher = createZodFetcher();

    const data = await zodFetcher(incorrectSchema, getHelloPath);

    expect(
      await zodFetcher(incorrectSchema, getHelloPath),
    ).rejects.toMatchObject({
      issues: ZodError.create([
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          path: ['name'],
          message: 'Expected number, received string',
        },
      ]),
    });
  });
});
