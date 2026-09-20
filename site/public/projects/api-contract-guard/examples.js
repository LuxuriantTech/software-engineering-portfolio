export function examplePair(name) {
  const baseline = { openapi: '3.0.3', paths: { '/orders': { get: { responses: { '200': { description: 'Orders' } } } } } };
  let candidate = structuredClone(baseline);
  if (name === 'removed') candidate.paths = {};
  if (name === 'parameter') candidate.paths['/orders'].get.parameters = [{ name: 'region', in: 'query', required: true, schema: { type: 'string' } }];
  if (name === 'request') {
    baseline.paths['/orders'].get.requestBody = { content: { 'application/json': { schema: { type: 'object', properties: { region: { type: 'string' } }, required: [] } } } };
    candidate = structuredClone(baseline);
    candidate.paths['/orders'].get.requestBody.content['application/json'].schema.required = ['region'];
  }
  if (name === 'response') {
    baseline.paths['/orders'].get.responses['200'].content = { 'application/json': { schema: { type: 'object', required: ['email'], properties: { email: { type: 'string' } } } } };
    candidate = structuredClone(baseline);
    candidate.paths['/orders'].get.responses['200'].content['application/json'].schema.required = [];
  }
  if (name === 'enum') {
    baseline.paths['/orders'].get.parameters = [{ name: 'region', in: 'query', schema: { type: 'string', enum: ['BE', 'FR'] } }];
    candidate = structuredClone(baseline);
    candidate.paths['/orders'].get.parameters[0].schema.enum = ['BE'];
  }
  return { baseline: JSON.stringify(baseline, null, 2), candidate: JSON.stringify(candidate, null, 2) };
}
