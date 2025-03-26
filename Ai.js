class Ai {

  static inferInvoice(invoiceAsText) {
    const instructions = `Tu es un expert en factures qui extrait les montants financiers (montant de TVA, Total HT, Total TTC) et autre libellés comptables à partir d'un texte brut.
        Identifie le total HT (net), le Total TTC (gross), le montant de TVA (vat), le symbole de la devise (currency).
        Les montants attendus sont toujours positifs.
        Special case : If a discount is applied on total gross, use discounted total as gross, use vat rate to compute net and vat based on this total gross after discount. 
        To check reported amounts, please check :
        1) vat + net = gross, truncated at 2 decimals. i.e. for a 10% tax rate : 10.00 + 100.00 = 110.00
        2) net * (1 + tax rate) = gross. i.e. for a 10% tax rate : 100 * (1 + 0.1) = 110
        Identifie le nom de l'entreprise émmetrice (company) de la facture; simplifie le en retirant les suffixes (SAS, Limited, Ltd, etc.); use PascalCase as company naming convention.
        Identifie la date de la facture (date) au format ISO, en mettant une heure par défaut à 12:00 UTC.
        Identifie le numero de facture (number)
        Le format attendu JSON est tel que : {"company": "OpenAi", "date": "2024-02-26T12:00:00.000Z", "number":"INV-12345678", "vat": 10.0, "gross": 60, "net": 50, "currency": "€"}
        Ta réponse doit être uniquement un objet JSON valide, sans aucun texte supplémentaire, ni introduction, ni explication, ni balises de formatage, ni backticks (\`\`\`). La réponse doit être directement exploitable par JSON.parse().`


    const completionString = Ai.openaiResponses(instructions, invoiceAsText, "gpt-4o", 1)
    const meta = Text.jsonParse(completionString)
    if (meta.gross !== Number((meta.net + meta.vat).toFixed(2))) {
      throw new Error("gross != net + vat: " + JSON.stringify(meta))
    }
    return meta
  }

  /**
   * https://platform.openai.com/docs/guides/text?api-mode=responses
   */
  static openaiResponses(instructions, input, model = 'gpt-4o', temperature = 0.2) {
    const url = 'https://api.openai.com/v1/responses';
    const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');

    const options = {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + apiKey
      },
      payload: JSON.stringify({
        model,
        instructions,
        input,
        temperature
      }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    return responseData.output[0].content[0].text
  }

}