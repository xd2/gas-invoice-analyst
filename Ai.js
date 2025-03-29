class Ai {

  static inferInvoice(invoiceAsText) {
    const instructions = `
      You are an invoice expert extracting financial amounts (VAT amount, Net total, Gross total) and other accounting labels from raw text.
      Identify the following fields:
      currency: the currency symbol
      number: the invoice number or reference, as a string.
      date: the invoice date in ISO format (YYYY-MM-DDT12:00:00.000Z), always with the time set to 12:00 UTC.
      company: the name of the company that issued the invoice. Simplify the name by removing any non numeric or alphabetical character, removing legal suffixes (e.g. SAS, Limited, Ltd, GmbH, Inc), removing country name(Google cloud France => GoogleCloud) and format the company name using PascalCase (capitalize each word, no spaces).
      gross: the Gross total amount (including VAT)
      net: the Net total amount (excluding VAT)
      vat: the VAT amount

      All amounts must be positive numbers.
      Truncate all values to 2 decimal places (not rounded).      
      To validate the amounts, apply the following checks:
      vat + net = gross
      Example: for a 10% tax rate → 10.00 + 100.00 = 110.00
      (vat / net) - (gross / net - 1) < 0.01
      Example: ( 20 / 100) - ( 120 / 100 -1 ) < 0.01  

      If totals are inconsistent, look for other values so the equations hold.
      
      Special case: If a discount (reduction, rebate, rabais, off) is applied "before" the grand total  :
      use the document total {gross} as the gross value
      compute by yourself the tax {rate} based on net values (thoses before discount, prefixed before.) using: {rate} = {before.vat} / {before.net}
      compute by yourself {vat} = {gross} - {gross} / (1 + {rate})
      compute by yourself {net} = {gross} - {vat}
      Example with document containing 'sous-total': 10000€, 'TVA(20%)': 2000€, 'remise': 1000€, 'total': 11000€. {rate} = 2000 / 10000 = 0.2; {vat} = 11000 - 11000 / (1 + {rate}) = 11000 - 11000 / 1.2 = 1833.33; {net} = 11000 - {vat} = 11000 - 1833.33 = 9166.67

      In every case, the expected output is a valid JSON object with the following structure:
      {"company": "OpenAi", "date": "2024-02-26T12:00:00.000Z", "number": "INV-12345678", "vat": 1833.33, "gross": 11000.0, "net": 9166.67, "currency": "€"}
      Your response must be only the JSON object, with no additional text, no formatting, no explanation, and no backticks. The output must be directly parsable by JSON.parse().`

    const completionString = Ai.openaiResponses(instructions, invoiceAsText, "gpt-4o", {temperature :0.1})
    // const completionString = Ai.gemini(instructions, invoiceAsText, 'gemini-2.5-pro-exp-03-25', { response_mime_type: 'application/json' })
    const data = Text.jsonParse(completionString)
    if (data.gross !== Number((data.net + data.vat).toFixed(2))) {
      throw new Error("gross != net + vat \n" + JSON.stringify(data))
    }
    if (Math.abs((data.vat / data.net) - (data.gross / data.net - 1)) > 0.01) {
      console.error(`vat/net=${data.vat / data.net}`)
      console.error(`gross/net-1=${data.gross / data.net - 1}`)
      throw new Error("vat / net  !=  gross / net - 1 \n" + JSON.stringify(data))
    }
    return data
  }

  /**
   * https://platform.openai.com/docs/guides/text?api-mode=responses
   */
  static openaiResponses(instructions, input, model = 'gpt-4o', config = { temperature: 1 }) {
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
        ...config
      }),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());

    Logger.log('Tokens total, prompt, candidates %s,%s,%s',
        responseData.usage.total_tokens,
        responseData.usage.input_tokens,
        responseData.usage.output_tokens
    );

    return responseData.output[0].content[0].text
  }

  // gemini-2.0-flash gemini-2.0-flash-lite gemini-2.5-pro-exp-03-25
  static gemini(instructions, input, model = 'gemini-2.0-flash' || 'gemini-2.0-flash-lite', config = { temperature: 1 }) {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

    const payload = {
      contents: [{
        parts: [{
          text: instructions + "\n" + input
        }]
      }],
      generationConfig: config
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      headers: {
        'x-goog-api-key': apiKey
      },
      muteHttpExceptions: false
    };

    const response = UrlFetchApp.fetch(apiUrl, options);
    const json = JSON.parse(response.getContentText());
    Logger.log('Tokens total, prompt, candidates %s,%s,%s',
        json.usageMetadata.totalTokenCount,
        json.usageMetadata.promptTokenCount,
        json.usageMetadata.candidatesTokenCount
    );

    return json.candidates[0].content.parts[0].text;
  }
}


