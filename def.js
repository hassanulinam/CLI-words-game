const fetch = require('node-fetch');
const HOST = require('./domain')[0];
const KEY = require('./domain')[1];

module.exports = async (word) => {
    let url = `${HOST}/word/${word}/definitions?api_key=${KEY}`;
    let res = await fetch(url);
    let result = await res.json();

    let k = Object.keys(result);
    if (k[0] == 'error') {
        console.log("\n\n--------  Requested word is not found in API -----------------\n\n");
        process.exit(0);
    }

    return result;
}