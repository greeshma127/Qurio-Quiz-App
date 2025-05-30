const questionNumberEl = document.getElementById('question-number');
const questionEl=document.getElementById('questions');
const optionEl=document.getElementById('options');
const feedbackEl = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");

let correctAnswer=" ";
let score=0;
let questionCount=0;
const totalQuestions=10;

function fetchQuestion(){
    if(questionCount>=totalQuestions){
        questionNumberEl.textContent = "";
        questionEl.textContent=`Quiz Finished! Your score is ${score}/${totalQuestions}`;
        optionEl.innerHTML="";
        feedbackEl.textContent="";
        nextButton.style.display="none";
        document.querySelector(".container").style.height = "200px";
        document.querySelector(".container").style.justifyContent = "center";
        return;
    }

    feedbackEl.textContent="";
    
    //nextButton.style.display = "none";

    fetch("https://opentdb.com/api.php?amount=10").then(response=>response.json()).then(data=>{
        const result=data.results[0];
       // console.log(result);
        const question=decodeHTMLEntities(result.question);
        correctAnswer=decodeHTMLEntities(result.correct_answer);
        const incorrectAnswers=result.incorrect_answers.map(ans=>decodeHTMLEntities(ans));

        const allAnswers=[...incorrectAnswers,correctAnswer].sort(()=>Math.random()-0.5);

        questionNumberEl.textContent = `Question ${questionCount + 1}:`;
        questionEl.textContent = question;
        optionEl.innerHTML = "";

        allAnswers.forEach(option=>{
            const btn=document.createElement("button");
            btn.textContent=option;
            btn.onclick=()=>checkAnswer(option);
            optionEl.appendChild(btn);
        });
    });
}

function checkAnswer(selected){
    if(selected===correctAnswer){
        feedbackEl.textContent="Correct!";
        score++;
    }
    else{
        feedbackEl.textContent=`Incorrect! Correct Answer: ${correctAnswer}`;
    }

    Array.from(optionEl.children).forEach(btn=>{
        btn.disabled=true;
        if(btn.textContent===correctAnswer){
            btn.style.backgroundColor = "#8f8";
        }
    });
    nextButton.style.display="inline-block";
    nextButton.style.width="100px";
    nextButton.style.height="40px";
    nextButton.style.backgroundColor="#FFFFFF";
    nextButton.style.color="black";
    nextButton.style.fontSize = "15px";
    nextButton.disabled = false;
    nextButton.style.borderRadius= "5px";
    nextButton.style.cursor= "pointer";
}

nextButton.addEventListener("click", () => {
    questionCount++;
    fetchQuestion();
});

function decodeHTMLEntities(text){
    const textarea=document.createElement("textarea");
    textarea.innerHTML=text;
    return textarea.value;
}

fetchQuestion();