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
