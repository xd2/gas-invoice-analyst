function analyse_shouldReturnInvoiceDetails_forAllInvoices_test() {
  Assert.objectEquals({
    "company": "StudioShodwe",
    "date": new Date("2022-06-25T12:00:00.000Z"),
    "number": "12345",
    "vat": 795,
    "gross": 8245,
    "net": 7950,
    "currency": "$"
  }, analyzeInvoice('1MOhDbNDCL57kTgOA0vDZXv5h2ZxIlR5t'))
}

function analyze_shouldReturnInvoiceDetails() {
  Assert.objectEquals({
    "company": "TimmermanIndustries",
    "currency": "$",
    "date": new Date("2023-12-15T12:00:00.000Z"),
    "gross": 170,
    "net": 170,
    "number": "",
    "vat": 0
  }, analyzeInvoice('1MPL6iAeocoMV0KDcqgXP6VhO54vjODU_'))

  Assert.objectEquals({
    "company": "CpbSoftware",
    "currency": "€",
    "date": new Date("2024-03-01T12:00:00.000Z"),
    "gross": 453.53,
    "net": 381.12,
    "number": "123100401",
    "vat": 72.41
  }
    , analyzeInvoice('1MA5lS3L_L8H1beSZlUpxANwPe9FOL0_w'))

  Assert.objectEquals({
    "company": "DemoSlicedInvoices",
    "currency": "$",
    "date": new Date("2016-01-25T12:00:00Z"),
    "gross": 93.5,
    "net": 85,
    "number": "INV-3337",
    "vat": 8.5
  }
    , analyzeInvoice('1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei'))

  Assert.objectEquals({
    "company": "Wardiere",
    "date": new Date("2028-08-15T12:00:00.000Z"),
    "currency": "$",
    "gross": 2100,
    "net": 2100,
    "vat": 0,
    "number": "2000-15",
  }, analyzeInvoice('1MWsgzSMJC8JbzsCnMABm0u27feILDfBJ'))
}

function analyseInvoice_shouldReturnInvoiceDetails_whenGivenPdfInvoice_test() {
  //Given 
  const givenFileId = '1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei'

  // When
  const actualInvoiceDetails = analyzeInvoice(givenFileId)

  // Then
  Assert.objectEquals({
    "company": "Sliced Invoices",
    "currency": "$",
    "date": new Date("2016-01-25T12:00:00Z"),
    "gross": 93.5,
    "net": 85,
    "number": "INV-3337",
    "vat": 8.5
  }
    , actualInvoiceDetails)
}