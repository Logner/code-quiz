// Length of quiz in seconds
var counter = 60;

// Question Container
// array of arrays
// questions[i] = [question, correct_answer, wrong answers*]
var questions = [['What Javascript expression do we use to run a block of code based on a boolean criteria?',
                    'if', 'Math.floor', 'var', 'alert'],
                ['Which object is the root of the DOM?', 
                'document', 'console', 'window', 'html'],
                ['Which tag is the root of a typical html file?',
                'html', 'body', 'head', 'DOCTYPE'],
                ['Which object is the root of a webpage in javascript?',
                'window', 'document', 'html', 'the URL'],
                ['What is the full name for css?',
                'Cascading Style Sheets', 'Convergent Simple Styles', 'Configurated Style Selector', 'Combination Style Sheets'],
                ['Which of the following is NOT one of the css properties used to achieve responsive designs?',
                'font-weight', 'float', 'flex', 'grid'],
                ['What is the ul tag responsible for in HTML?',
                'It makes a bullet point list', 'It makes a numbered list', 'It refers adds a universal link', 'It adds a hyperlink', ]];

// Score keeping
var currentScore = 0;

// Grabbing elements present on DOM
var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var messageContainer = document.querySelector('.message-container');
var introPrompt = document.getElementById('intro');
var pageContentEl = document.querySelector('html');
var highScoreButton = document.querySelector('#show-high-scores')

// Temporary container for enabling timer
var countDownInterval = null;
// Temporary container for submitting answers
var submitAnswerButton = null;
// Temporary container for answers
var answers = null;
// Empty Container for preventing repeated questions
var askedQuestions = [];
// Used for resetting the header style
var resetHeaderStyle = null;

// valid characters for highscore.
var validChars = [];

// Character validation loop;
var validateChars = function(input) {
    char_switch = false;
    for (i=0; i < input.length; i++) {
        for (j=0; j < validChars.length; j++) {
            if (input[i] == validChars[j]){
                char_switch = true;
                break;
            }
        }
        if (char_switch == false) {
            return false;
        }
    }
    return true;
}

// Input generating valid characters for highscore storage
function gen_continuous_char_list(start_hex, end_hex) {
    for (var i = (hex.hex_to_int(start_hex)); i <= (hex.hex_to_int(end_hex)); i++) {
      validChars.push(String.fromCharCode(i));
    };
  };
// Unicode: 41-5A 
gen_continuous_char_list('41', '5A')

// Unicode: 61-7A
gen_continuous_char_list('61', '7A')



// Preventing Repeated Questions
var questionSelector = function() {

    // Select a random number
    num = Math.floor(Math.random()*questions.length);

    // if list has number in it, generate a new number
    while (askedQuestions.includes(num)){
        num = Math.floor(Math.random()*questions.length);
    }

    // Adding the selected question to askedQuestions
    askedQuestions.push(num);

    // Returning a new question
    return questions[num];
}

// Asking new question logic.
var askNewQuestion = function() {

    // if 5 questions have been asked, end the quiz.
    if (askedQuestions.length === 5) {
        endQuiz();
    }

    // Otherwise remove old question and make new question.
    else{
    questionContainer.innerHTML = '';
    messageContainer.innerHTML = '';
    var newQuestionEl = generateQuestionEl();
    questionContainer.appendChild(newQuestionEl);
    }
}

// Making a new DOM element for new questions
var generateQuestionEl = function() {

    // Selecting a new (unused) question to ask
    var newQuestion = questionSelector();

    // Making the container for the contents of the question to be held
    var newQuestionEl = document.createElement('div');

    // Question contents
    var questionContent = newQuestionEl.appendChild(document.createElement('div'));
    questionContent.className = 'content';
    var question = questionContent.appendChild(document.createElement('h2'));

    // Populating the question and answers in the container
    question.textContent = newQuestion[0];

    // overwriting the global answers variable with the answer options for new question
    answers = questionContent.appendChild(document.createElement('ul'));
    // Generating Answer tags for the question
    generateAnswers(newQuestion);

    // Creating a submit button
    var submitAnswerContainer = newQuestionEl.appendChild(document.createElement('div'));
    submitAnswerContainer.className = 'btn-container';
    var submitButton = submitAnswerContainer.appendChild(document.createElement('button'));
    submitButton.className = 'btn'
    submitButton.textContent = 'Submit'

    // Submit button logic & connecting the newly created submitbutton to a global event listener
    submitAnswerButton = submitButton;
    submitAnswerButton.addEventListener('click', checkAnswer);

    return newQuestionEl;
}

// for i in selected-question: randomize the answer order
var generateAnswers = function(questionList) {
    // stores values that correspond to the index in the questionList array
    var rndAnsLst = [];
    var newAns = null;
    var newAnsText = null;

    // Select a random number
    num = Math.floor(Math.random()*(questionList.length-1))+1;

    // TODO: Could be a bottleneck with large datasets, but for us its a small enough scale to be effective.
    // Logic for randomizing order and making sure elements are not repeated.
    while (rndAnsLst.length < questionList.length-1) {
        while (rndAnsLst.includes(num)) {
            num = Math.floor(Math.random()*(questionList.length-1))+1;
        };
        // Attaching unique number to the random answers list
        rndAnsLst += num;
    };

    // use the numbers stored in rndAnsLst as the index, attach li's to answer in that order.
    for (i=0; i<rndAnsLst.length; i++) {
        // create li
        li = document.createElement('li');
        li.setClassName = 1;

        // create the input element in the form of a radio button
        newAns = document.createElement('input');
        newAns.setAttribute('type', 'radio');

        // set the radio id and value to the rndAnsLst index
            // value/id of 1 will always be the right answer due to the structure of the
            // questions array.
        newAns.setAttribute('value', rndAnsLst[i]);
        newAns.setAttribute('id', rndAnsLst[i]);

        // setting name so the name corresponds to the position of this question
        // in the questions array questions[name] == this question and all the details.
        // in other words:
        //          questionList == questions[name]
        newAns.setAttribute('name', askedQuestions[askedQuestions.length-1]);
        
        //  Creating the actual textContent for our questions
        newAnsText = document.createElement('label');
        newAnsText.textContent = questionList[rndAnsLst[i]]
        // linking label to the corresponding id/value
        newAnsText.setAttribute('for', rndAnsLst[i]);

        // appending the radio button to li
        li.appendChild(newAns);
        // appending label after radio button to li
        li.appendChild(newAnsText);
        // appending finished li to answers
        answers.appendChild(li);
    }
};

// checking if answer is correct
var checkAnswer = function() {
    // reset timer
    resetHeaderStyle == null;

    // finding all elements with the tagname 'input'
    var ans = (answers.getElementsByTagName('input'));
    for (i=0; i<ans.length; i++) {
        // Finding Selected Answer
        if (ans[i].checked)
        {
            // storing the answer-ID in the answer variable
            ans = ans[i].id;
        }
    }

    // if right -> +5 sec
    if (ans == 1) {
        counter += 5;
        countDownSpan.textContent = counter;
        pageContentEl.setAttribute('style', "background:var(--emrald);");
    }
    // if no answer has been selected -> try again
    else if (ans.constructor === HTMLCollection) {
        submitAnswerButton.textContent = 'Submit after selecting a valid answer!';
        return 0;
    }
    // else -5 sec
    else{
        counter -= 10;
        pageContentEl.setAttribute('style', "background:var(--pink);");
    }

    // eitherways, ask a new question.
    resetHeaderStyle = setTimeout(resetHeader, 500);
    askNewQuestion();
};

// Timer logic, if timer runs out, go to end quiz.
var countdown = function() {
    counter --;
    countDownSpan.textContent = counter;
    if (counter < 1){
        endQuiz();
    };
};

// animation function
var resetHeader = function() {
    pageContentEl.removeAttribute('style');
}

// Starting Quiz.
var startQuiz = function() {
    // Input verification:
    // incase a user double clicks the start-quiz button and the timer starts ticking twice-as-fast.
    if (countDownInterval) {
        console.log('Cant start now');
    }
    // start quiz
    else {
        console.log('Starting Quiz!');
        // otherwise the text wont change to a number until a second has passed.
        countDownSpan.textContent = counter;
        countDownInterval=setInterval(countdown, 1000);
        document.querySelector('.high-scores').setAttribute('style','visibilty:hidden');
        askNewQuestion();
    };
}

// making high-score prompt
var makeHighScorePrompt = function() {

    // Making the container for the highscore content
    var highScoreEl = document.createElement('div');
    highScoreEl.className = 'highscore';

    // highscore contents
    var highScoreContent = highScoreEl.appendChild(document.createElement('div'));
    highScoreContent.className = 'content'
    var quizEndMessage = highScoreContent.appendChild(document.createElement('h2'));
    var playerInitialsInput = highScoreContent.appendChild(document.createElement('input'));

    // Generating end game messages
    quizEndMessage.textContent = 'Good job finishing the quiz! \n\n your new score is '+currentScore;
    playerInitialsInput.setAttribute('placeholder', 'Please enter your initials here!')
    playerInitialsInput.className = 'player-name'


    // Creating a submit button
    var submitHighScoreContainer = highScoreEl.appendChild(document.createElement('div'));
    submitHighScoreContainer.className = 'btn-container';
    var submitButton = submitHighScoreContainer.appendChild(document.createElement('button'));
    submitButton.className = 'submit-highscore btn'
    submitButton.textContent = 'Submit'

    return highScoreEl;
}

var validateScore = function (score, playerName) {
    // fetch all scores from json.

    scores = JSON.parse(score);
    console.log(score);
    // if player has played before
    if (scores[playerName]){
        // find old score
        old = scores[playerName];
        if (old > currentScore) {
            // do nothing
            console.log('nope');
            messageContainer.textContent = playerName+' had a higher score of '+old+' vs. the current '+currentScore+'.'
        }
        // if current > older; set new highscore
        else{
            scores[playerName] = currentScore;
        }
    }
    // if new player set a new highscore
    else{
        scores[playerName] = currentScore;
    }

    return scores;
}

// Checking if highscore is okay; and adding it to localstorage
var storeHighScore = function() {
    // logic goes here
    playerName = pageContentEl.querySelector('.player-name').value
    var validation = validateChars(playerName);

    if (playerName.length==2 && validation) {
        //Store Highscore
        scores = window.localStorage.getItem('highscore')
        if (scores) {
            scores = validateScore(scores, playerName);
        }
        // if first game ever on machine; set new score.
        else{
            scores = {};
            scores[playerName] = currentScore
            console.log(scores);
        }
        
        localStorage.setItem('highscore', JSON.stringify(scores));
        
        //Show Intro Element
        questionContainer.innerHTML = '';
        questionContainer.appendChild(introPrompt);

        //Blink to show score is stored;
        pageContentEl.setAttribute('style', 'background:var(--emrald)');
        resetHeaderStyle = setTimeout(resetHeader, 500);
    }
    // if playerName validation fails
    else{
        // change text
        submitButton = pageContentEl.querySelector('.submit-highscore');
        submitButton.textContent = 'Please submit your initials!'
        //Blink to show attempt failed;
        pageContentEl.setAttribute('style', 'background:var(--pink)');
        resetHeaderStyle = setTimeout(resetHeader, 500);
    }
};

var showHighScores = function () {
    messageContainer.textContent = '';
    questionContainer.innerHTML = '';
    scores = JSON.parse(localStorage.getItem('highscore'));

    // Making the container for the highscore content
    var highScoreEl = document.createElement('div');
    highScoreEl.className = 'highscore';

    // highscore contents
    var highScoreContent = highScoreEl.appendChild(document.createElement('div'));
    var highScoreMessage = highScoreContent.appendChild(document.createElement('h2'));

    // Generating end game messages
    highScoreMessage.textContent = 'Highscores';

    // Creating a start new game button
    var buttonContainer = highScoreEl.appendChild(document.createElement('div'));
    buttonContainer.className = 'btn-container';
    var submitButton = buttonContainer.appendChild(document.createElement('button'));
    submitButton.className = 'btn';
    submitButton.textContent = 'Start a new game';
    submitButton.addEventListener('click',startQuiz);

    var highScoreContainer = highScoreContent.appendChild(document.createElement('ul'));
    var head = highScoreContainer.appendChild(document.createElement('li'));
    head.className = 'hs-header hs-item';
    head.innerHTML = '<h3>Player Name</h3><h3>Highest Score</h3>';
    
    //generateScores
    for (var score in scores) {
        var scoreEl = highScoreContainer.appendChild(document.createElement('li'));
        scoreEl.innerHTML = '<p>'+score+'</p><p>'+scores[score]+'</p>';
        scoreEl.className = 'hs-item';
    }

    questionContainer.appendChild(highScoreEl);
}

// Ending Quiz
var endQuiz = function () {
    // Updating the timer to reflect the counter at the time end-quiz was triggered.
    countDownSpan.textContent = counter;

    // Recording quiz stats
    currentScore = counter;
    
    // Setting the minimum score to zero.
    if (currentScore < 0) {currentScore = 0};

    // Stopping the timer
    clearInterval(countDownInterval);
    countDownInterval = null;

    // Resetting Variables
    countDownSpan.textContent = "finished";
    askedQuestions = [];
    counter = 60;

    // TODO: Change this to make a score recording form
    questionContainer.innerHTML = '';
    highScorePrompt = makeHighScorePrompt()
    document.querySelector('.high-scores').removeAttribute('style')
    questionContainer.appendChild(highScorePrompt);
    highScorePrompt.querySelector('.submit-highscore').addEventListener('click', storeHighScore);
}

startButton.addEventListener('click', startQuiz);
highScoreButton.addEventListener('click', showHighScores)

// TODO: add listeners for keys 1,2,3,4 and enter for submit button