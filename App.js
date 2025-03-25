function parseInvoice(fileId = '1MBwnGStwNPLzxyUGI_JFSYcn2dUFz_Ei') {
  const text = Text.recognize(fileId);
  Logger.log(text)
  const invoice = Ai.inferInvoice(text)
  Logger.log(invoice)
  return invoice
}
