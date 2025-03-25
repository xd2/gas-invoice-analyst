class Text {
  /**
   * Recognize text with Google Drive OCR
   * @param {string} fileId
   * @returns {string} the recognized text from the document file
   */
  static recognize(fileId) {
    const file = DriveApp.getFileById(fileId);
    const blob = file.getBlob();
    const resource = {
      name: blob.getName() + '.ocr',
      mimeType: 'application/vnd.google-apps.document'
    };
    const options = {
      ocr: true,
      fields: 'id'
    };
    const docFile = Drive.Files.create(resource, blob, options);
    const doc = DocumentApp.openById(docFile.id);
    const text = doc.getBody().getText();
    Drive.Files.remove(docFile.id);
    return text;
  }

  static jsonParse(json) {
    return JSON.parse(json, (key, value) => {
      // Vérifier si la valeur ressemble à une date ISO
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  }
}
