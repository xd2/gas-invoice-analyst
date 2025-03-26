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
  const context = this;
  const testResults = [];

  for (const key in context) {
    const maybeFn = context[key];
    if (typeof maybeFn === 'function' && /Test$/i.test(key)) {
      try {
        maybeFn();
        const msg = `✅ ${key} passed`;
        testResults.push(msg);
        console.log(msg);
      } catch (e) {
        const msg = `❌ ${key} failed: ${e.message}`;
        testResults.push(msg);
        console.error(msg);
      }
    }
  }

  return testResults;
}

function doGet() {
  const formatted = runAllTests().map(line => `${line}`).join('\n');
  return ContentService.createTextOutput(formatted)
    .setMimeType(ContentService.MimeType.TEXT);
}

