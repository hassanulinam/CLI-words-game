const fetch = require('node-fetch');
const HOST = require('./domain')[0];
const KEY = require('./domain')[1];

module.exports = async () => {
    let url = `${HOST}/words/randomWord?api_key=${KEY}`;
    let res = await fetch(url);
    let result = await res.json();

    return result.word;
}

