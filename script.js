const questionElement = document.getElementById("question");
const answerButtonsElement = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
const popup = document.getElementById("popup");
const startQuizButton = document.getElementById("start-quiz-btn");

let currentQuestionIndex = 0;
let score = 0;
let questions = [];

function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&type=multiple')
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(result => {
                // Retrieve all answers
                const answers = [
                    ...result.incorrect_answers.map(text => ({ text, correct: false })),
                    { text: result.correct_answer, correct: true }
                ];

                // Shuffle the answers array
                shuffleArray(answers);

                // Return the shuffled question object
                return {
                    question: result.question,
                    answers: answers
                };
            });
            showPopup();
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showPopup() {
    popup.style.display = "block";
}

function startQuiz() {
    popup.style.display = "none";
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNum = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNum + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtonsElement.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Your Score: ${score}/${questions.length}`;
    nextButton.innerHTML = "Retry";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length) {
        handleNextButton();
    } else {
        fetchQuestions(); // Restart the quiz
    }
});

startQuizButton.addEventListener("click", startQuiz);

fetchQuestions(); // Initial fetch to start the quiz
