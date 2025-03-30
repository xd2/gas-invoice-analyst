function analyzeInvoice(fileId = '1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei') {
    const file = DriveApp.getFileById(fileId)
    const blob = file.getMimeType() === 'application/pdf' ?
        UrlFetchApp.fetch(`https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`).getBlob() :
        file.getBlob()
    const invoice = Ai.inferInvoice(blob)
    Logger.log(invoice)
    return invoice
}

function normalizeInvoiceFolder(folderId = '1M6ujPNDHAQd8FkxD5Zb5d36aSNlEFPfZ') {
    const inputFolder = DriveApp.getFolderById(folderId)
    const outputFolder = inputFolder.createFolder(Date.now())

    const spreadsheet = SpreadsheetApp.create('Invoices report')
    DriveApp.getFileById(spreadsheet.getId()).moveTo(outputFolder);
    spreadsheet.getActiveSheet().appendRow(['File', 'Company', 'Gross', 'Currency', 'Date'])

    const files = DriveApp.searchFiles(`'${folderId}' in parents and (mimeType = 'application/pdf' or mimeType = 'image/jpeg')`)
    while (files.hasNext()) {
        const file = files.next()
        Logger.log(`Processing ${file.getName()}`)

        const blob = file.getMimeType() === 'application/pdf' ?
            UrlFetchApp.fetch(`https://drive.google.com/thumbnail?id=${file.getId()}&sz=w1000`).getBlob() :
            file.getBlob()
        const invoice = Ai.inferInvoice(blob)

        const date = Utilities.formatDate(invoice.date, 'GMT', 'yyyyMMdd');
        const extension = file.getName().match(/\.([a-zA-Z]+)$/)[1]
        const normalizedFilename = `${date} ${invoice.company} ${invoice.gross}${invoice.currency} ${invoice.vat}${invoice.currency}.${extension}`

        const normalizedFile = file.makeCopy(outputFolder);
        normalizedFile.setName(normalizedFilename)

        const link = `=HYPERLINK("${file.getUrl()}"; "${normalizedFilename}")`
        spreadsheet.getActiveSheet().appendRow([link, invoice.company, invoice.gross, invoice.currency, invoice.date])
    }
}
