class Ai {

  static inferInvoice(invoiceAsText) {
    const instructions = `Tu es un expert en factures qui extrait les montants financiers (montant de TVA, Total HT, Total TTC) et autre libellés comptables à partir d'un texte brut.
        Identifie et répond au format JSON.
        Identifie le total HT (net), le Total TTC (gross), le montant de TVA (vat), le symbole de la devise (currency).
        Les montants attendus sont toujours positifs.
        Une TVA à 20 est douteux, il pourrait s'agir du taux standard français de 20% que tu as interpretté comme un montant à tord.
        Pour vérifier cette TVA, Assure toi toujours que vat + net = gross a deux chiffres apres la virgule près.
        Identifie le nom de l'entreprise émmetrice (company) de la facture; simplifie le en retirant les suffixes (SAS, Limited, Ltd, etc.); il ne peut pas etre 'XD2' ni 'XAVIER DELESTRE DEVELOPPEMENT' ni 'Xavier DELESTRE'. 
        Un cas particulier: Si la facture contient 'BNPAFRPPREN' dans ses infos bancaires, alors considere que la société est 'VL EXPERTISE'.
        Identifie la date de la facture (date) au format ISO, en mettant une heure par défaut à 12:00 UTC.
        Identifie le numero de facture (number)
        Le format attendu est: {"company": "OpenAi", "date": "2024-02-26T12:00:00.000Z", "number":"INV-12345678", "vat": 10.0, "gross": 60, "net": 50, "currency": "€"}
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