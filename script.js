var flag = false;
let choice = "";
let userName = "";
let counterWrong= 0; 
let counterRights=0; 
let maxAttempts=3; 
let factor = 5; 
const audioGame = new Audio("resources/GameMusic.mp3");

window.onload = (event) => {
    const selectedElement = document.querySelector("#myList")
    selectedElement.addEventListener("change", function(){
        choice = selectedElement.options[selectedElement.selectedIndex].id;
        localStorage.setItem("userChoice", choice);
    })   
}

document.querySelector("#start").addEventListener("click", function(){
    userName = document.querySelector("#name").value;
    if(!userName || !choice){
        window.alert("Please, provide your name and choose a level")
        location.reload();
    }
    document.querySelector(".menu").style.display = "none";
    const audioStart = new Audio("resources/StartGame.mp3");
    audioStart.play();
    api()
})

async function api() {

    data = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${choice}`)
        .then(response => response.json());

        start(data);    
}


function start(data) {
    
    
    document.querySelector(".container").style.display = "flex";

    const selector = data.results[0];

    const header = document.querySelector(".header-questions");
    header.innerHTML = `<h1 class="theme">${selector.category.split(":")[1] == undefined? selector.category :selector.category.split(":")[1]}</h1> `;
    console.log(header);

    const question = document.querySelector(".query");
    question.innerHTML = `<h3 class="question">${selector.question}</h3>`;
    console.log(question)
    
    const content = document.querySelector(".list");
    selector.incorrect_answers.splice(Math.random() * (selector.incorrect_answers.length +1), 0, selector.correct_answer);

    var list = selector.incorrect_answers.map((request, index) => `<li id=${index}>${request}</li>`).join('')
    content.innerHTML = list

    document.querySelector(".score").textContent = `Score: ${counterRights*factor}`; 

    checkAnswer(data);

}

function checkAnswer(data) {
    audioGame.pause()
    audioGame.play();

    const answerItens = document.querySelectorAll('li')
    const correctAnswer = data.results[0].correct_answer;
    console.log(correctAnswer)
    var counter = 0;
    var maxAttempts = 1;

    for (let i = 0; i < answerItens.length; i++) {
        console.log("here");

        answerItens[i].addEventListener('click', function (event) {

            counter++;

            const selectedAnswer = event.target.textContent
            const clicked = event.currentTarget

            if (counter === maxAttempts) {

                if (selectedAnswer === correctAnswer) {
                    const audioRight = new Audio("resources/RigthQuestion.mp3")
                    audioRight.play()

                    flag = true;


                    clicked.style.backgroundColor = "green";
                    i = answerItens.length;
                } else {

                    const audioRight = new Audio("resources/WrongQuestion.mp3")
                    audioRight.play()

                    flag = false;
                    clicked.style.backgroundColor = "red";


                    i = answerItens.length;
                }

            }

            setTimeout(function () {
                showAnswer(data)
            }, 500)

        });
    }
}

function showAnswer(data) {
    if (flag) {

        document.querySelector(".container").remove();
        document.querySelector(".show").style.display = "flex";
        
        document.querySelector(".show").style.color = "green";
        document.querySelector(".show").style.backgroundColor = "#3B3B44"; 
        document.querySelector(".show").textContent = "You got it right!";
        setTimeout(function () {
    
            document.querySelector("body").innerHTML = `<div class="show"></div>
            <div class="container">
                <div class="exitContainer">
                    <div class="exit">
                        <input class="exitButton" type="image" src="resources/exit.png" alt="Exit Button" onclick="exit()">
                    </div>
                </div>
                <div class="header-questions">
                   
                </div> 
                <div class="query">
                
                </div>
                <div class="content">
                    <ul class="list">
                       
                    </ul>
                </div>
                <div class="scoreContainer">
                <div class="score">
                    
                </div>
            </div>
            </div> `

            counterRights++;   
            audioGame.pause()
            audioGame.play();
            api()


        }, 1500)
    } else {
        document.querySelector(".container").remove();
        document.querySelector(".show").style.display = "flex"
        document.querySelector(".show").style.color = "#B8F1FE";  
        document.querySelector(".show").style.backgroundColor = "#3B3B44"; 
        document.querySelector(".show").textContent ="Correct Answer: "
                                                        + data.results[0].correct_answer;
        setTimeout(function () {
            document.querySelector("body").innerHTML = `<div class="show"></div>
            <div class="container">

            <div class="exitContainer">
                <div class="exit">
                    <input class="exitButton" type="image" src="resources/exit.png" alt="Exit Button" onclick="exit()">
                </div>
            </div>
                <div class="header-questions">
                   
                </div> 
                <div class="query">
                
                </div>
                <div class="content">
                    <ul class="list">
                       
                    </ul>
                </div>
                <div class="scoreContainer">
                <div class="score">
                    
                </div>
            </div>
            </div> `

            
            if(counterWrong == maxAttempts){
                audioGame.pause()
                endGame()
            }else{
                audioGame.pause()
                audioGame.play();
                api()
            }
           
            counterWrong++; 

        }, 2000)
    }

}

function endGame(){
    document.querySelector(".container").remove();
    document.querySelector(".show").style.display = "flex";
    document.querySelector(".show").style.backgroundColor = "#3B3B44"; 

 

    const newSpan = document.createElement("span"); 
    document.querySelector(".show").appendChild(newSpan); 
    document.querySelector(".show span").textContent = `${userName}, your score is:  ${counterRights*factor}`; 

    document.querySelector(".show").innerHTML=`
                                                <span>${userName}, your score is:  ${counterRights*factor}</span>
                                                <div class="center">
                                                    <button onclick="exit()">Reset</button>
                                                </div>
    `
}

function exit() {
    location.reload(); 
}




