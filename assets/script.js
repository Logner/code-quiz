// Length of quiz in seconds
var counter = 5;

// Question Container
var questions = [['What Javascript expression do we use to run a block of code based on a boolean criteria?',
                    'if', 'for', 'var', 'alert'],
                ['Which object is the root of the DOM?', 
                'document', 'console', 'window', 'html'],
                ['Which tag is the root of a typical html file?',
                'html', 'body', 'head', 'DOCTYPE'],
                ['What is the full name for css?',
                'Cascading Style Sheets', 'Convergent Simple Styles', 'Configurated Style Selector', 'Combination Style Sheets'],
                ['Which of the following is NOT one of the css properties used to achieve responsive designs?',
                'width', 'float', 'flex', 'grid']];
var askedQuestions = [];

// Score keeping
var currentScore = 0;

// Grabbing elements present on DOM
var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var introPrompt = document.getElementById('intro');
var countDownInterval = null;

var questionSelector = function() {
    num = Math.floor(Math.random()*questions.length);

    for (var i=0; i<askedQuestions.length; i++) {
        if (askedQuestions[i] === i) {
            questionSelector();
            break;
        }
    }
    return questions[num];
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
    var answers = questionContent.appendChild(document.createElement('ul'));
    // for i in selected-question: attach li randomly, if li is at 1, set id or class to correct-answer

    // Submit button for logic integration
    var submitAnswerContainer = newQuestionEl.appendChild(document.createElement('div'));
    submitAnswerContainer.className = 'btn-container';
    var submitButton = submitAnswerContainer.appendChild(document.createElement('button'));
    submitButton.className = 'btn'
    submitButton.textContent = 'Submit'

    //Create logic that links submitButton to Evaluate answer and ask new question.
    
    return newQuestionEl;
}

var endQuiz = function () {
    countDownSpan.textContent = "Finished";
    currentScore = counter;

    // Clears interval of the startCoundown variable
    clearInterval(countDownInterval);
    countDownInterval = null;
    console.log(askedQuestions);
    askedQuestions = [];

    // Resetting Counter
    counter = 5

    // Re-attach intro to questionContainer
    questionContainer.innerHTML = '';
    questionContainer.appendChild(introPrompt);
    alert('New Score: ' + currentScore);
}


var askNewQuestion = function() {
    if (askedQuestions.length === 5) {
        endQuiz();
    }
    else{
    questionContainer.innerHTML = '';
    var newQuestionEl = generateQuestionEl();
    questionContainer.appendChild(newQuestionEl);
    }
}

var countdown = function() {
    counter --;
    countDownSpan.textContent = counter;
    if (counter===0){
        endQuiz();
    };
};
// setInterval (func, milliseconds)
// why does adding brackets to countdown only trigger the function once.
var startCountdown = function() {
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

startButton.addEventListener('click', startCountdown);