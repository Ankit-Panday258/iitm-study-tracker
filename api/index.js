import { handleApiRequest } from '../server/apiHandler.js';

// Vercel rewrites preserve the requested API path in this query parameter.
export default function handler(req, res) {
  const parsed = new URL(req.url, 'http://localhost');
  const route = req.query?.route || parsed.searchParams.get('route');
  if (route) {
    parsed.searchParams.delete('route');
    req.url = '/api/' + route + (parsed.search ? parsed.search : '');
  }
  return handleApiRequest(req, res, () => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'API endpoint not found.' }));
  });
}
