let questions = [
    {
        "prompt": "In order to be elected president, a candidate must",
        "questions": [
            "recieve a majority of the popular vote",
            "be approved by the House of Representatives",
            "belong to one of the major parties",
            "recieve a majority of the electoral vote"
        ],
        "answer": 3
    },
    {
        "prompt": "Which of the following can happen under the Electoral College system? It is possible for a candidate to be elected president",
        "questions": [
            "with just a plurality of the electoral vote",
            "without a majority of the popular vote",
            "with the least number of electoral votes",
            "if the House of Representatives awards him or her disputed electoral votes"
        ],
        "answer": 1
    },
    {
        "prompt": "In case of a tie in the electoral college, the election is resolved by a",
        "questions": [
            "recount",
            "vote in the House of Representatives",
            "completely new election",
            "run-off election"
        ],
        "answer": 1
    },
    {
        "prompt": "In order to be nominated for president, a candidate must",
        "questions": [
            "win a majority of his or her's party convention delegates",
            "be a war hero",
            "be a successful governor",
            "campaign in primary elections"
        ],
        "answer": 0
    },
    {
        "prompt": "The first presidential primary in the nation is held in the state of",
        "questions": [
            "Alaska",
            "Iowa",
            "New Hampshire",
            "California"
        ],
        "answer": 2
    },
    {
        "prompt": "A number of presidents who have never held elective office have been",
        "questions": [
            "generals",
            "business leaders",
            "religious leaders",
            "journalists"
        ],
        "answer": 0
    },
    {
        "prompt": "Which amendment allows the vice president to assume the presidency in case the president becomes incapacitated?",
        "questions": [
            "First",
            "Tenth",
            "Twenty-second",
            "Twenty-fifth"
        ],
        "answer": 3
    },
    {
        "prompt": "A newly elected president officially begins his or her term",
        "questions": [
            "on the day after Election Day",
            "on the day after the Electoral College meets",
            "on Inauguration Day",
            "as soon as the election results become official"
        ],
        "answer": 2
    },
    {
        "prompt": "The vice president also serves as president of the",
        "questions": [
            "United States",
            "Supreme Court",
            "House of Representatives",
            "U.S. Senate"
        ],
        "answer": 3
    },
    {
        "prompt": "In 1985, President Ronald Reagan temporarily transferred presidential authority to",
        "questions": [
            "Vice President George. H. W. Bush",
            "First Lady Nancy Reagan",
            "House Speaker Thomas \"Tip\" O'Neill",
            "former Secretary of State Alexander Haig"
        ],
        "answer": 0
    }
]

function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

start();

function start() {
    shuffle(questions);
    for (let i = 0; i < questions.length; i++) {
        questions[i].answer = questions[i].questions[questions[i].answer];
        shuffle(questions[i].questions)
        questions[i].answer = questions[i].questions.indexOf(questions[i].answer)
    }

    let answers = []
    for (let i = 0; i < questions.length; i++) {
        let txt = `Question ${i+1}/${questions.length}:\n${questions[i].prompt}`
        for (let j = 0; j < questions[i].questions.length; j++) {
            txt += `\n${j+1}: ${questions[i].questions[j]}`
        }
        txt += `\n\nYou must input a number corresponding to your answer. Type "quit" to quit this early.`
        let ans = prompt(txt)
        if (ans == "quit") { throw new Error("quit") }
        answers.push(ans - 1)
    }

    let points = 0
    let counted = questions.length
    for (let i = 0; i < questions.length; i++) {
        if (isNaN(questions[i].answer)) {
            counted--
            console.log(`Question ${i+1}\n${questions[i].prompt}\nYour answer: ${questions[i].questions[answers[i]]}\nCorrect answer: undefined (Invalid! This question will not be counted.)`)
        }
        if (answers[i] === questions[i].answer) {
            points++
        } else {
            if (questions[i].questions[questions[i].answer] === undefined) {
                console.error(`Question ${i+1}\n${questions[i].prompt}\nYour answer: ${questions[i].questions[answers[i]]} (Invalid answer)\nCorrect answer: ${questions[i].questions[questions[i].answer]}`)
            } else {
                console.warn(`Question ${i+1}\n${questions[i].prompt}\nYour answer: ${questions[i].questions[answers[i]]}\nCorrect answer: ${questions[i].questions[questions[i].answer]}`)
            }
            
        }
    }

    console.log(`\n%cPoints: ${points} / ${questions.length} (${(points / questions.length * 100).toFixed(1)}%)`, "font-size: 24px")
}

// copy from everything before this line if you want to confirm testing yourself!
// from this line on, make the questions!

function makeQuestions() {
    let amt = 22 // this is used to denote how many questions will there be on the test/quiz.
    for (let i = 0; i < amt; i++) {
        questions[i] = {prompt: "", questions: ["", "", "", ""], answer: 0}
        questions[i].prompt = prompt(`Question ${i+1}/ ${amt}, Prompt:`)
        if (questions[i].prompt == "quit") { throw new Error("quit") }
        for (let j = 0; j < 4; j++) {
            questions[i].questions[j] = prompt(`Question ${i+1}/ ${amt}, Answer ${j+1}:`)
            if (questions[i].questions[j] == "quit") { throw new Error("quit") }
        }
        questions[i].answer = prompt(`Question ${i+1}/ ${amt}, Correct Answer:`) - 1
        if (questions[i].answer == "quit") { throw new Error("quit") }
    }
    console.log(JSON.stringify(questions))
}

makeQuestions()