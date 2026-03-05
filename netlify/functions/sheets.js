const fetch = require("node-fetch");

exports.handler = async (event) => {
  const tab = event.queryStringParameters?.tab || "Funds";
  const sheetId = "1eNhrEEFofx95O4_Cyo8nHgDNkZFxMl5ZPwGRsFB_8OE";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};
