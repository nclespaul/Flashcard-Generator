## Flashcard-Generator - Week 11 app
 - Author: Darrell Freeman
 - Date: 05/21/2017
 - Tools used: Javascript, Node.js, npm inquirer version 2.0.0.  
 
## Description
The Flashcard Generator is a command-line app that allows a user to create two different kinds of flashcards to use in a quiz.  Those flashcards can then be used as quiz questions for other users in applications such as the classroom, general trivia games, etc.  The two different kinds of flashcards are:
1.  BASIC - This is your standard flashcard, consisting of a question on the front and the corresponding answer on the back.  
2.  CLOZE - This type of card makes a portion of the question visible.  For example, the front of the card might say "The first President of the United States was ...", and then say "George Washington" when the user requests it.  

## Playing the Game
When the app is initialized, the user is presented with a menu consisting of five options.  The arrow keys are used to scroll up and down the menu, and the "Enter" key is used to make a selection.  Depending on the selection, the user is guided through the process of creating flashcards of whichever type was selected.  Once the cards have been created, the flashcards that were created are presented, presumably to a different user, in the form of traditional trivia questions.  The app will acknowledge each answer as correct and incorrect as the answers are provided.  The totals of each correct and incorrect answer are displayed at the end.  The app is then exited, and can be re-initialized if desired.  
