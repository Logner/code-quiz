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
var asked_questions = [];

// Score keeping
var currentScore = 0;

var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var introPrompt = document.getElementById('intro');
var countDownInterval = null;

var generateQuestionEl = function() {
    
}

var endQuiz = function () {
    countDownSpan.textContent = "Finished";
    currentScore = counter;
    console.log(currentScore);


    // Clears interval of the startCoundown variable
    clearInterval(countDownInterval);
    countDownInterval = null;
    asked_questions = [];

    // Resetting Counter
    counter = 5

    // Re-attach intro to questionContainer
    questionContainer.appendChild(introPrompt);
    console.log(currentScore);
    alert('New Score: ' + currentScore);
}


var askNewQuestion = function() {
    if (asked_questions.length === 5) {
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