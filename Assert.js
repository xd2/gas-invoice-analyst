class Assert {

  static equals(expected, actual, message) {
    if (expected !== actual) {
      message = message ? message + ' ' : '';
      message = `${message}\nExpected: ${expected}\n     got: ${actual}`;
      throw new Error(message);
    }
  }

  static objectEquals(expected, actual, message) {
    const sort = (obj) => (
      Object.fromEntries(
        Object.keys(obj).sort().map(key => [key, obj[key]])
      )
    )

    return Assert.equals(
      JSON.stringify(sort(expected)),
      JSON.stringify(sort(actual)),
      message);
  }
}

function runAllTests() {
  const context = globalThis || this
  const testResults = [];
  let failed = 0;

  for (const key in context) {
    const maybeFn = context[key];
    if (typeof maybeFn === "function" && /Test$/i.test(key)) {
      try {
        maybeFn(); // exécute la fonction de test
        testResults.push(`✅ ${key} passed`);
      } catch (e) {
        testResults.push(`❌ ${key} failed: ${e.message}`);
        failed++;
      }
    }
  }

  Logger.log(testResults.join('\n'));

  if (failed > 0) {
    throw new Error(`${failed} test(s) failed`);
  }
}

