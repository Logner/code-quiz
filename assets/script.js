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
                'Cascading Style Sheets', 'Convquestionsergent Simple Styles', 'Configurated Style Selector', 'Combination Style Sheets'],
                ['Which of the following is NOT one of the css properties used to achieve responsive designs?',
                'width', 'float', 'flex', 'grid'],
                ['What is the ul tag responsible for in HTML?',
                'It makes a bullet point list', 'It makes a numbered list', 'It refers adds a universal link', 'It adds a hyperlink', ]];
var askedQuestions = [];

// Score keeping
var currentScore = 0;

// Grabbing elements present on DOM
var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var introPrompt = document.getElementById('intro');
var countDownInterval = null;
var submitAnswerButton = null;
var answers = null;

// Preventing Repeating Questions
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

// Asking new question logic, if 5 questions have been asked, go to endquiz.
var askNewQuestion = function() {
    if (askedQuestions.length === 5) {
        endQuiz();
    }
    // Otherwise generate remove old question and make new question.
    else{
    questionContainer.innerHTML = '';
    var newQuestionEl = generateQuestionEl();
    questionContainer.appendChild(newQuestionEl);
    }
}

var generateQuestionEl = function() {
    var newQuestion = questionSelector();

    // Making the question prompt box
    var newQuestionEl = document.createElement('div');

    // Where the questions will be held
    var questionContent = newQuestionEl.appendChild(document.createElement('div'));
    questionContent.className = 'content';
    var question = questionContent.appendChild(document.createElement('h2'));

    // selected-question[0]
    question.textContent = newQuestion[0];
    answers = questionContent.appendChild(document.createElement('ul'));

    // for i in selected-question: attach li randomly, if li is at 1, set id or class to correct-answer
    generateAnswers(newQuestion);

    // Submit button for logic integration
    var submitAnswerContainer = newQuestionEl.appendChild(document.createElement('div'));
    submitAnswerContainer.className = 'btn-container';
    var submitButton = submitAnswerContainer.appendChild(document.createElement('button'));
    submitButton.className = 'btn'
    submitButton.textContent = 'Submit'

    //Create logic that links submitButton to Evaluate answer and ask new question.
    submitAnswerButton = submitButton;
    // TODO: Change this to checkAnswer
    submitAnswerButton.addEventListener('click', checkAnswer);

    return newQuestionEl;
}

var generateAnswers = function(questionList) {
    var rndAnsLst = [];
    var newAns = null;
    var newAnsText = null;

    // Select a random number
    num = Math.floor(Math.random()*(questionList.length-1))+1;

    // returns the number or ('true') if the number is found
    // Could be a bottleneck with large datasets, but for us its a small enough scale to be effective.
    while (rndAnsLst.length < questionList.length-1) {
        while (rndAnsLst.includes(num)) {
            num = Math.floor(Math.random()*(questionList.length-1))+1;
        };
        rndAnsLst += num;
    };

    for (i=0; i<rndAnsLst.length; i++) {
        li = document.createElement('li');
        li.setClassName = 1;
        newAns = document.createElement('input');
        newAns.setAttribute('type', 'radio');
        newAns.setAttribute('value', rndAnsLst[i]);
        newAns.setAttribute('id', rndAnsLst[i]);
        newAns.setAttribute('name', askedQuestions[askedQuestions.length-1]);
        newAns.textContent = questionList[rndAnsLst[i]];
        newAnsText = document.createElement('label');
        newAnsText.textContent = questionList[rndAnsLst[i]]
        newAnsText.setAttribute('for', rndAnsLst[i]);

        li.appendChild(newAns);
        li.appendChild(newAnsText);
        answers.appendChild(li);
    }

    console.log(answers);

};

var checkAnswer = function() {
    ans = (answers.getElementsByTagName('input'));
    for (i=0; i<ans.length; i++) {
        // Finding Selected Answer
        if (ans[i].checked)
        {
            ans = ans[i].id;
        }
    }
    // if right -> +5 sec
    if (ans == 1) {
        counter += 5;
    }
    // else -5 sec
    else{
        counter -= 10;
    }
    askNewQuestion();
};

// Timer logic, if timer runs out, go to end quiz.
var countdown = function() {
    counter --;
    countDownSpan.textContent = counter;
    if (counter===0){
        endQuiz();
    };
};


// Starting Quiz.
var startQuiz = function() {
    // Incase a user double clicks the start-quiz button and the timer starts ticking twice-as-fast.
    if (countDownInterval) {
        console.log('Cant start now');
    }
    else {
        console.log('Starting Quiz!');
        countDownSpan.textContent = counter;
        countDownInterval=setInterval(countdown, 1000);
        askNewQuestion();
    };
}

// Ending Quiz
var endQuiz = function () {

    // Recording quiz stats
    currentScore = counter;

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

    // Notifying User 
    alert('The quiz has ended. \nNew Score: ' + currentScore);
}

startButton.addEventListener('click', startQuiz);