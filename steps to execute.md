# NOTE : your system should be connected to internet to execute these commands successfully.

# commnad to install NodeJS & NPM in ubuntu :
    
    sudo apt install nodejs npm



# make sure that you have met module dependencies. (node-fetch, readline-sync, readline-async)

# commands to install modules :
    
    npm  install  node-fetch
    
    npm  install  readline-async
    
    npm  install  realine-sync
    
    

# Command-Line-Dictionary-Tool
# Dictionary Tool where we can get related content for a given word.


commands:

	node dict.js <Word>			------> all the definitions, synonyms, antonyms and examples of the word.

	node dict.js dict <Word>    ------> Same as above command

	node dict.js def <Word>     ------> Definition of the word

	node dict.js syn <Word>     ------> Synonym of word

	node dict.js ant <Word>     ------> Antonym of word

	node dict.js ex <Word>      ------> Example of word

	node dict.js		     	------> displays all items of a random word



	node dict.js play			------> To play the game of guessing word
