require("dotenv").config();
const https = require("https");
const crypto = require("crypto");

const accessKey = process.env.RAPYD_ACCESS_KEY;
const secretKey = process.env.RAPYD_SECRET_KEY;

async function makeRequest(method, urlPath, body = null) {
  try {
    const httpMethod = method.toUpperCase();
    const httpBaseURL = "sandboxapi.rapyd.net";
    const salt = generateRandomString(8);
    const idempotency = new Date().getTime().toString();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = sign(httpMethod, urlPath, salt, timestamp, body);

    const options = {
      hostname: httpBaseURL,
      port: 443,
      path: urlPath,
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        salt: salt,
        timestamp: timestamp,
        signature: signature,
        access_key: accessKey,
        idempotency: idempotency,
      },
    };

    return await httpRequest(options, body);
  } catch (error) {
    console.error("Error generating request options", error);
    throw error;
  }
}

function sign(method, urlPath, salt, timestamp, body) {
  try {
    let bodyString = body ? JSON.stringify(body) : "";
    let toSign =
      method.toLowerCase() + urlPath + salt + timestamp + accessKey + secretKey + bodyString;

    let hash = crypto.createHmac("sha256", secretKey);
    hash.update(toSign);
    return Buffer.from(hash.digest("hex")).toString("base64");
  } catch (error) {
    console.error("Error generating signature", error);
    throw error;
  }
}

function generateRandomString(size) {
  return crypto.randomBytes(size).toString("hex");
}

async function httpRequest(options, body) {
  return new Promise((resolve, reject) => {
    try {
      let bodyString = body ? JSON.stringify(body) : "";

      const req = https.request(options, (res) => {
        let response = { statusCode: res.statusCode, headers: res.headers, body: "" };

        res.on("data", (data) => {
          response.body += data;
        });

        res.on("end", () => {
          response.body = response.body ? JSON.parse(response.body) : {};
          if (response.statusCode !== 200) return reject(response);
          return resolve(response);
        });
      });

      req.on("error", (error) => reject(error));

      req.write(bodyString);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { makeRequest };
