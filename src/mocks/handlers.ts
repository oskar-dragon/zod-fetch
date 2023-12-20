import { http, HttpResponse } from 'msw';

const baseURL = 'https://example.com';

export const getHelloPath = baseURL + '/user';
export const getHello = http.get(getHelloPath, () => {
  return HttpResponse.json({ name: 'John' });
});

export const getHelloErrorPath = getHelloPath + '/error';
export const getHelloError = http.get(getHelloErrorPath, () => {
  return new HttpResponse(null, {
    status: 404,
    statusText: 'User not found',
  });
});

export default [getHello];
