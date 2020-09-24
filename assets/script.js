// Length of quiz in seconds
var counter = 60;

// Question Container
// list of lists
// questions[i] = [question, correct_answer, wrong answers*]
var questions = [['What Javascript expression do we use to run a block of code based on a boolean criteria?',
                    'if', 'for', 'var', 'alert'],
                ['Which object is the root of the DOM?', 
                'document', 'console', 'window', 'html'],
                ['Which tag is the root of a typical html file?',
                'html', 'body', 'head', 'DOCTYPE'],
                ['Which object is the root of a webpage in javascript?',
                'window', 'document', 'html', 'the URL'],
                ['What is the full name for css?',
                'Cascading Style Sheets', 'Convergent Simple Styles', 'Configurated Style Selector', 'Combination Style Sheets'],
                ['Which of the following is NOT one of the css properties used to achieve responsive designs?',
                'width', 'float', 'flex', 'grid'],
                ['What is the ul tag responsible for in HTML?',
                'It makes a bullet point list', 'It makes a numbered list', 'It refers adds a universal link', 'It adds a hyperlink', ]];

// Score keeping
var currentScore = 0;

// Grabbing elements present on DOM
var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var introPrompt = document.getElementById('intro');
var pageContentEl = document.querySelector('html');

// Temporary container for enabling timer
var countDownInterval = null;
// Temporary container for submitting answers
var submitAnswerButton = null;
// Temporary container for answers
var answers = null;
// Empty Container for preventing repeated questions
var askedQuestions = [];
// Used for resetting the heaer style
var resetHeaderStyle = null;

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
        pageContentEl.setAttribute('style', "background:green;");
        console.log('yop')
    }
    // else -5 sec
    else{
        counter -= 10;
        pageContentEl.setAttribute('style', "background:var(--pink);");
        console.log('nop')
    }

    // eitherways, ask a new question.
    resetHeaderStyle = setTimeout(resetHeader, 300);
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
        askNewQuestion();
    };
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
    countDownSpan.textContent = "Finished";
    console.log(askedQuestions);
    askedQuestions = [];
    counter = 60;

    // TODO: Change this to make a score recording form
    questionContainer.innerHTML = '';
    questionContainer.appendChild(introPrompt);

    // TODO: Dont use alert, make a card for notifiying them of the high-score
    alert('The quiz has ended. \nNew Score: ' + currentScore);
}

startButton.addEventListener('click', startQuiz);

// TODO: add listeners for keys 1,2,3,4 and enter for submit button