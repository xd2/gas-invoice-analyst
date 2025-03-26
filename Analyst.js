function analyzeInvoice(fileId = '1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei') {
  const text = Text.recognize(fileId);
  Logger.log(text)
  const invoice = Ai.inferInvoice(text)
  Logger.log(invoice)
  return invoice
}

function normalizeInvoiceFolder(folderId = '1M6ujPNDHAQd8FkxD5Zb5d36aSNlEFPfZ'){
    const inputFolder = DriveApp.getFolderById(folderId)
    const outputFolder = inputFolder.createFolder(Date.now())

    const files = DriveApp.searchFiles(`'${folderId}' in parents and (mimeType = 'application/pdf' or mimeType = 'image/jpeg')`)
    while (files.hasNext()) {
        Logger.log(`Processing ${file.getName()}`)
        const file = files.next()
        const fileId = file.getId()

        const text = Text.recognize(fileId);
        const invoice = Ai.inferInvoice(text)

        const date = Utilities.formatDate(invoice.date, 'GMT', 'yyyyMMdd');
        const extension = file.getName().match(/\.([a-zA-Z]+)$/)[1]
        const normalizedFilename = `${date} ${invoice.company} ${invoice.gross}${invoice.currency} ${invoice.gross}${invoice.currency}.${extension}`

        const normalizedFile = file.makeCopy(outputFolder);
        normalizedFile.setName(normalizedFilename)
    }
}