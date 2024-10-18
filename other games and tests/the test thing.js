let questions = [
    {
        "prompt": "Government is best defined here as a system for",
        "questions": [
            "collecting taxes",
            "managing a community or nation and the officials who run that system",
            "making war",
            "building highways and bridges"
        ],
        "answer": 1
    },
    {
        "prompt": "Politics is best defined as the process of",
        "questions": [
            "gaining and keeping control of a government",
            "deal making and debate",
            "making full use of a nation's resources",
            "providing jobs for everyone"
        ],
        "answer": 0
    },
    {
        "prompt": "A nation cannot exist without",
        "questions": [
            "a king",
            "a legislature",
            "sovereignty",
            "free elections"
        ],
        "answer": 2
    },
    {
        "prompt": "Laws in the American colonies were made by the",
        "questions": [
            "British Parliament",
            "colonial governor",
            "British monarchy",
            "colonial assemblies"
        ],
        "answer": 3
    },
    {
        "prompt": "The significance of the establishment of the Virginia House of Burgesses in 1619 was that it",
        "questions": [
            "led to our system of checks and balances",
            "brought an end to all conflicts with Native Americans",
            "was the first elected assembly in Nortth America",
            "introduced the confederate system of government"
        ],
        "answer": 2
    },
    {
        "prompt": "Long before the revolutionary war, Americans had become used to self-government because",
        "questions": [
            "royal colonies has disappeared by 1700",
            "their assemblies used the power of the purse to check the power of colonial governors",
            "Parliament was eager to allow the colonies to run their own affairs",
            "the British monarchy encouraged self-government"
        ],
        "answer": 1
    },
    {
        "prompt": "The Magna Carta, the Petition of Right, and the English Bill of Rights all attempted to",
        "questions": [
            "limit the power of the English kings",
            "extend the right to vote to all citizens",
            "extend full rights to the American colonies",
            "unite England and the American colonies"
        ],
        "answer": 0
    },
    {
        "prompt": "The ideas of John Locke",
        "questions": [
            "opposed democracy",
            "influenced the colonists in their struggle against George III",
            "supported tyranny",
            "stressed religious toleration"
        ],
        "answer": 1
    },
    {
        "prompt": "The Declaration of Independance shows the influence of John Locke by stressing the importance of",
        "questions": [
            "a strong court system",
            "a standing army",
            "colonial assemblies",
            "natural rights"
        ],
        "answer": 3
    },
    {
        "prompt": "Thomas Jefferson statesi nthe Declaration of Independance that the main purpose of government is to",
        "questions": [
            "maintain law and order",
            "provide jobs for all",
            "protect the people's rights",
            "provide safety for its citizens"
        ],
        "answer": 2
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

function makeQuestions() {
    let amt = 22
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