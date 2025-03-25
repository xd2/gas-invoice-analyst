# gas-invoice-crawler

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)


Developed with [clasp](https://github.com/google/clasp) for Google App Script.

### Common commands

```bash
clasp login
```
```bash
clasp push
```
```bash
clasp push --watch
```
```bash
clasp run parseInvoice_shouldReturnInvoiceDetails_whenGivenPdfInvoice_test
```

### git hooks
I use git hooks to automate the deployment process : here I use pre-push hook to push the code to google app script.  

The following iterate over each file in .hooks directory and create a relative symlink in .git/hooks
```bash
for file in .hooks/*; do ln -s -f ../../$file .git/hooks/; done
```