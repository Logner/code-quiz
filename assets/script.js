var counter = 5; //provide a starting time

var startButton = document.getElementById('start');
var countDownSpan = document.getElementById('countdown');
var questionContainer = document.getElementById('question-container');
var introPrompt = document.getElementById('intro');
var countDownInterval = null;

var askNewQuestion = function() {
    questionContainer.innerHTML = '';
    var newQuestionEl = generateQuestionEl();
    questionContainer.appendChild(newQuestionEl);
}


var countdown = function() {
    counter --;
    countDownSpan.textContent = counter;
    if (counter===0){
        countDownSpan.textContent = "inactive";
        // Clears interval of the startCoundown variable
        clearInterval(countDownInterval);
        countDownInterval = null;
        counter = 5

        // Re-attach intro to questionContainer
        questionContainer.appendChild(introPrompt);
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