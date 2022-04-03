const randomWord = require('./randomW');
const relwords1 = require('./ant_syn');
const def1 = require('./def');
const example = require('./example');
const player = require('./play');

async function def(word) {
    let definitions = await def1(word);
    console.log("\n\t........ Definitions : " + word + " .........\n");
    definitions.forEach(element => {
        console.log("\t" + element.text + "\n");
    });
}


let relArray1;
async function relWords(flag, word) {
    if (relArray1 == undefined)
        relArray1 = await relwords1(word), syns = [], ants = [];
    if (relArray1[0].relationshipType == 'synonym')
        syns = relArray1[0].words;
    else {
        syns = relArray1[1].words;
        ants = relArray1[0].words;
    }
    if (flag == 1) {
        console.log("\n\t........ Synonyms : " + word + " .........\n");
        syns.forEach(element => {
            console.log("\t" + element + "\n");
        });
    }
    else {
        console.log("\n\t........ Antonyms : " + word + " .........\n");
        if (ants.length > 0)
            ants.forEach(element => {
                console.log("\t" + element + "\n");
            });
        else
            console.log("-------- No Antonyms --------\n");
    }
}

async function ex(word) {
    let examples = await example(word);
    console.log("\n\t........ Examples : " + word + " .........\n");
    examples.forEach(element => {
        console.log(element.text + "\n");
    });
}



async function begin() {

    // store the command-line arguments......
    let choice = process.argv[2], word;
    if (process.argv.length == 3)
        word = process.argv[2];
    else if (process.argv.length == 4)
        word = process.argv[3];
    if ((process.argv[2] == 'play' && process.argv.length >= 4) || process.argv.length > 4) {
        console.log("\n--------- Invalid command ------------\n");
        return;
    }

    try {
        switch (choice) {

            case 'play': {
                await player();
                break;
            }

            case 'def': {
                await def(word);
                break;
            }
            case 'ant': {
                await relWords(2, word);
                break;
            }
            case 'syn': {
                await relWords(1, word);
                break;
            }
            case 'ex': {
                await ex(word);
                break;
            }
            case undefined: {
                word = await randomWord();
                console.log("\nWord of\nthe Day :- " + word + "  🌈 🎂");
                await def(word);
                await relWords(1, word);
                await relWords(2, word);
                await ex(word);
                break;
            }
            case word:
            case 'dict': {
                await def(word);
                await relWords(1, word);
                await relWords(2, word);
                await ex(word);
                break;
            }

        }
    } catch (err) {
        console.log("-------- Invalid Input ---------\n" + err);
    }
}

begin();
