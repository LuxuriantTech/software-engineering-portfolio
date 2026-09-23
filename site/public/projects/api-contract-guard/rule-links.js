const base = 'https://github.com/LuxuriantTech/api-contract-guard/blob/6ee1e569bbe751748a96e52aa0eee86864f20d69';

export const RULE_LINKS = Object.freeze({
  OPERATION_REMOVED: { source: `${base}/src/engine.ts#L306`, test: `${base}/tests/rules.test.ts#L6` },
  REQUIRED_PARAMETER_ADDED: { source: `${base}/src/engine.ts#L312`, test: `${base}/tests/rules.test.ts#L10` },
  REQUEST_REQUIRED_PROPERTY_ADDED: { source: `${base}/src/engine.ts#L107`, test: `${base}/tests/rules.test.ts#L38` },
  RESPONSE_REQUIRED_PROPERTY_REMOVED: { source: `${base}/src/engine.ts#L108`, test: `${base}/tests/rules.test.ts#L43` },
  ENUM_VALUE_REMOVED: { source: `${base}/src/engine.ts#L97`, test: `${base}/tests/rules.test.ts#L47` },
});
