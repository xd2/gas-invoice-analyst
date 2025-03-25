function parseInvoice_shouldReturnInvoiceDetails_whenGivenPdfInvoice_test() {
    //Given 
    const givenFileId = '1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei'
    
    // When
    const actualInvoiceDetails = parseInvoice(givenFileId)
    
    // Then
    Assert.objectEquals({
      "company":"Sliced Invoices",
      "currency":"$","date": new Date("2016-01-25T12:00:00Z"),
      "gross":93.5,
      "net":85,
      "number":"INV-3337",
      "vat":8.5}
    , actualInvoiceDetails)
}