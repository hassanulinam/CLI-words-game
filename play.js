const readline = require('readline-sync');
const randWord = require('./randomW');
const relwords1 = require('./ant_syn');
const def1 = require('./def');
const example1 = require('./example');



async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function print(str, stime) {
    for (let i = 0; i < str.length; i++) {
        process.stdout.write(`${str[i]}`);
        await sleep(stime);
    }
}

function picker(lim) {                                  // Pick a random number from given range
    return Math.floor(Math.random() * lim);
}

function hinter(arr) {
    let hint, rand, p = 1, label = "";
    let heading = ['Definition :- ', "Synonym :- ", "Antonym :- ", "Example :- "], i = 0;

    while (hint == undefined) {
        try {
            p = picker(3);                        // p is a random number for choosing items[] sub-array
            if (i > 10)                          // When the hint is not found even after 10 iterations, 
                throw new Error;                // As all the data is over, break the infinite loop
            i++;
            rand = picker(arr[p].length);     //  pick a random number in the range of array length
            if (p == 2 && rand == 0)
                p = 0;
            hint = arr[p][rand];           // hint = items[radom sub-array][random-item]
            arr[p].splice(rand, 1);       //  Delete the random-item which is chosen by hint in items[][]
        } catch (err) {
            return "$HINT-ERROR";       // Notify that hinter() is crashed due to infinite loop
        }
    }
    i = 0;
    while (i < 4) {
        if (p == i)
            label = heading[i];     // Assign a label for Hint
        i++;
    }
    return (label + hint);
}


async function getData() {
    let word = await randWord();
    items[3] = word;                            // Appending the chosen word to items[][]
    let defs = await def1(word);
    let i = 0;

    defs.forEach(element => {
        definitions[i] = element.text;
        backup[0][i++] = element.text;
    });

    let relArray = await relwords1(word), syns = [], ants = [];
    if (relArray[0].relationshipType == 'synonym')
        syns = relArray[0].words;
    else {
        syns = relArray[1].words;
        ants = relArray[0].words;
    }
    i = 0;
    syns.forEach(element => {
        synonyms[i] = element;
        backup[1][i++] = element;
    });
    i = 0;
    ants.forEach(element => {
        antonyms[i] = element;
        backup[2][i++] = element;
    });
    i = 0;

    return items;
}                   // items[][] = [ [def], [syn], [ant], [exm], WORD ]  will be the data related to chosen word


let SCORE = 0;
const synonyms = [], antonyms = [], definitions = [], examples = [];
const items = [definitions, synonyms, antonyms];
let backup = [[], [], []], repeater = ['abcd'];






module.exports = async function () {

    let data, hint = "", gword, choice = 1, i = 1, repeatCount = 0, wordsCount = 1;

    do {
        // Load the data if and only if there is no word chosen (or) it is cleared already
        if (data == undefined || data[3] == undefined) {
            await print("\n\n\n\n=============================================================================================================================================================================================\n", 1);
            print("L o a d i n g   W o r d - " + (i++) + " .....", 30);
            data = await getData();
            
            // if redirecting occurs more than 5 times or no.of words loaded is more than 40, then terminate the game.
            if(repeatCount > 6) {
                choice = 4;
                await print("\n\n ---------- you have completed the game ----------------\n", 30)
            }
            else {
                // if any word is repeated, load new word.....
                if (repeater.find(element => element == data[3])) {
                    await print("\nRedirecting ....\t", 10);
                    data = undefined;
                    choice = 1;
                    i--;
                    repeatCount++;
                    continue;
                }
            }
        }   //  randomly CHOSEN-WORD is located in data[3], As data=[ [def], [syn], [ant], [exm], WORD ]

        repeater.push(data[3]);
        repeatCount = 0;
        
        switch (choice) {

            case 1: {
                hint = hinter(data);
                while (hint == "$HINT-ERROR" || hint == data[3]) {      // As all the data is over, hint the word by shuffling it
                    hint = data[3].split('').sort(function () { return 0.5 - Math.random() }).join('');
                    hint = "Shuffled :- " + hint;
                }
                await print("\nTESTER REF : " + data[3] + "  or  " + data[1] + " ", 3);
                await print(`\n[HINT] ${hint}\n`, 5);
            }

            case 2: {
                gword = readline.question("\n\nGuess the word :- ");
                gword = gword.toLocaleLowerCase();

                if (gword == data[3] || data[1].find(item => item == gword)) {
                    await print("\n======== Correct ========", 10);
                    SCORE += 10;               // Accept word (or) it's synonyms
                    data[3] = undefined;      // Clear the word to load NEW word
                    hint = "";               //  Clear hint to load NEW word's hint
                    choice = 1;             //  As the guess is correct, Ask next word
                    await print(`\t~~~~ Your Score : ${SCORE} ~~~~\n`, 10);
                    await print("=============================================================================================================================================================================================\n", 2);
                    continue;
                }
                else {
                    await print("\n===== Wrong ======", 10);
                    SCORE -= 2;
                    await print(`\t~~~~ Your Score : ${SCORE} ~~~~\n\n`, 10);
                }
                break;
            }
        }
        if (hint.startsWith("Shuffled")) {
            await print("You took all the hints...   You lost this word \n", 10);
            data[3] = undefined;
            hint = '';
            choice = 1;
            await print(`\n~~~~~~~~~~ Your Score : ${SCORE} ~~~~~~~~~~`, 10);
            await print("\n==================================================================\n", 15);
            continue;
        }

        if(choice != 4) {
            await print("\n \t\t Options :  1) Hint    2) Try again    3)Skip    4) Exit        { Negative points:    Wrong : 2    Hint : 3    Skip : 4 }");
            choice = parseInt(readline.question("\n -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  > Option : "));
        }
        if (choice == 1) SCORE -= 3;

        if (repeater.length >= 40) {         // To terminate after 42 words
            await print(">>----------> You played all the words >>--------->");
            choice = 4;
        }

        if (choice == 4) {
            await print(`\n>>>>>>>>>>>    Final Score : ${SCORE}    <<<<<<<<<<<\n`, 20);
            return;
        }
        if (choice == 3) {
            SCORE -= 4;
            await print(`\n\nWord :- ${data[3]}\n\n`, 40);
            await print(`\nDefinitions : \n\n`, 40);
            backup[0].forEach(element => {
                console.log(element + "\n");
            });
            await print(`\n\n\nSynonyms : \n\n`, 40);
            backup[1].forEach(element => {
                console.log(element + "\n");
            });
            await print(`\n\nAntonyms : \n\n`, 40);
            if (backup[2].length > 0)
                backup[2].forEach(element => {
                    console.log(element + "\n");
                });
            else console.log("----- No Antonyms -------\n\n")
            print(`\n\nExamples : \n\n`, 22);
            let exm = await example1(data[3]);
            exm.forEach(element => {
                console.log(element.text + "\n");
            });
            data[3] = undefined;         // As the word is skipped, clear the word to load NEW word.
            choice = 1;                 //  Hint the next new word
            await print(`\n~~~~~~~~~~ Your Score : ${SCORE} ~~~~~~~~~~\n`, 10);
            await print("=============================================================================================================================================================================================\n", 2);
        }

    } while (true);

}
