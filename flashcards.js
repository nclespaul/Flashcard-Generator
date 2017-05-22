var right = 0;
var wrong = 0;
const Basic = require("./Basic");
const Cloze = require("./Cloze");
const inquirer = require("inquirer");
const fs = require("fs");
var card_array = [];

// Have the user choose from a pre-defined list of choices on how to proceed.
// inquirer.prompt(questions).then(answers) defined on the npm website.
const flashcards = () => {
        inquirer.prompt([{
                type: 'list',                               //  Defines the type of prompt
                name: 'userType',                           //  User answer stored here.
                message: 'What would you like to do?',      //  Prompt for user.  
                choices: ['Create cards for the basic quiz', 'Take the basic quiz', 'Create cards for the cloze quiz', 'Take the cloze quiz', 'Exit']
        }]).then(function(choice) {
        //  Call the appropriate function based on the user choice.
            if (choice.userType === 'Create cards for the basic quiz') {
                createCards(basicPrompt, 'log.txt');
            } else if (choice.userType === 'Take the basic quiz') {
                quiz('log.txt', 0);
            } else if (choice.userType === 'Create cards for the cloze quiz') {
                createCards(clozePrompt, 'cloze-log.txt');            
            } else if (choice.userType === 'Take the cloze quiz') {
                quiz('cloze-log.txt', 0);
            } else if (choice.userType === 'Exit') {
                console.log('Thanks for playing!');
            }
        });
    }

// ***************************************** Functions *************************************** //

// This routine collects the previously created cards and pushes them into the card_array array.
const readCards = (logFile) => {
    card_array = [];
    fs.readFile(logFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        for (let i = 0; i < jsonContent.length; i++) {
            card_array.push(jsonContent[i]);
        }
    });
};

//  Routine that allows the user to keep creating cards.
//  Also outputs the card data to .txt files.  

const createCards = (promptType, logFile) => {
    inquirer.prompt(promptType).then(function(answers) {
        card_array.push(answers);
        if (answers.makeMoreCards) {
            createCards(promptType, logFile);
        } else {
            writeToLog(logFile, JSON.stringify(card_array));
            flashcards();
        }
    });
};
// Routine that reads and parses the data for insertion into the appropriate card type.
const quiz = (logFile, x) => {
    fs.readFile(logFile, "utf8", function(error, data) {
        var jsonContent = JSON.parse(data);
        if (x < jsonContent.length) {
            if (jsonContent[x].hasOwnProperty("front")) {                               // Only simple cards have the front property.
                var card = new Basic(jsonContent[x].front, jsonContent[x].back);       // Constructor for the simple cards.
                var question = card.front;
                var answer = card.back.toLowerCase();
            } else {
                var card = new Cloze(jsonContent[x].text, jsonContent[x].cloze);        //  Constructor for the cloze cards.
                var question = card.message;
                var answer = card.cloze.toLowerCase();
            }
            inquirer.prompt([{
                name: "question",
                message: question,
                validate: function(value) {
                    if (value.length > 0) {
                        return true;
                    }
                    return 'Take a guess, or hit Ctrl+C to quit.';
                }
            }]).then(function(answers) {
                if (answers.question.toLowerCase().indexOf(answer) > -1) {
                    console.log("That's the right answer!");
                    right++;                                                        // Stores the number of right answers.
                    x++;                                                            // Counter used to get through all of the cards
                    quiz(logFile, x);
                } else {
                    card.printAnswer();
                    wrong++;
                    x++;
                    quiz(logFile, x);
                }
            })
        } else {
            console.log('Your score: ');
            console.log('right: ' + right);
            console.log('wrong: ' + wrong);
            right = 0;
            wrong = 0;
            card_array = [];
            flashcards();
        }
    });
};

//  Writes any errors to the log file. 
const writeToLog = (logFile, info) => {
    fs.writeFile(logFile, info, function(err) {
        if (err)
            console.error(err);
    });
}

// *********************  Key-value pairs containing the prompts used for creating the basic cards. ******************** //
const basicPrompt = [{
    name: "front",
    message: "Enter the question to be displayed on the front of the card: "
}, {
    name: "back",
    message: "Enter the answer to be displayed on the back of the card: "
}, {
    type: 'confirm',
    name: 'makeMoreCards',
    message: 'Create another card?',
    default: true
}]

// *********************  Key-value pairs containing the prompts used for creating the basic cards. ******************** //
const clozePrompt = [{
    name: "text",
    message: "Please enter a sentence for this quiz.  The portion of the sentence that you wish to use as the answer should be in parentheses.\n" + 
    "  For example, '(George Washington) was the first President of the United States'\n ",
    validate: function(value) {
        var parentheses = /\(\w.+\)/;               //  Regex that grabs the data from within the parentheses.
        if (value.search(parentheses) > -1) {       //  User input validation to make sure that something within parentheses was included.
            return true;
        }
        return 'Please put a word in your sentence into parentheses'
    }
}, {
    type: 'confirm',
    name: 'makeMoreCards',
    message: 'Create another card?',
    default: true
}]

//  Routine to continue creating additional cards as long as the user desires.
const makeMoreCards = {
    type: 'confirm',
    name: 'makeMoreCards',
    message: 'Create another card?',
    default: true
}

flashcards();       // Begins the quiz.
