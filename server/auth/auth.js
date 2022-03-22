const jwt = require("jsonwebtoken");

//Use the ApiKey and APISecret from config.js
const payload = {
    iss: "fC53OJt8QnmEsALDahhFhA",
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, "cPPEFYPrxz14USflgm4jHJmUD6TTug0Z5pr7");

function addToken(req, res, next) {
    req.body["token"] = token;
    next();
}

module.exports = { addToken }