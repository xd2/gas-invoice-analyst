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

