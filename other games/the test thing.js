let questions = [
    {
        "prompt": "A supporter of the Grange Movement would most likely also have supported",
        "questions": ["government regulation of railroads", "abolishing private property", "laissez-faire capitalism", "women's sufferage"],
        "answer": 0
    }, {
        "prompt": "Which factor was most likely a major cause of the trend shown by the chart?",
        "questions": ["a series of major droughts", "prices set by government regulations", "widespread crop failures", "overproduction"],
        "answer": 3
    }, {
        "prompt": "To protect themselves from the trend shown by the chart, American farmers wanted the federal government to",
        "questions": ["reduce regulation of the railroads", "increase the money supply", "pay for increased crop yields", "raise tariffs on foreign goods"],
        "answer": 1
    }, {
        "prompt": "A major aim of both the Grange and Populist Movements was",
        "questions": ["the establishment of a gold standard for currency", "mandatory government policies to curb inflation", "the passage of laws to regulate monopolies", "unlimited immigration of Asians"],
        "answer": 2
    }, {
        "prompt": "The Granger Laws were an attempt by various state legislatures to regulate",
        "questions": ["farmers", "railroads", "manufacturers", "factories"],
        "answer": 1
    }, {
        "prompt": "Which contributed to the birth of the Progressive Movement?",
        "questions": ["the influence of muckrackers, Populists, and social reformers", "the Stock Market Crash of 1929", "racial conflict in the New South", "the migration of population from cities to the countryside"],
        "answer": 0
    }, {
        "prompt": "The muckrackers of the Progressive Era and the investigative reporters of the present day are most similar in that both have",
        "questions": ["sought to document corruption in American life", "advocated fewer government controls on the economy", "focused their efforts on increasing patriotism", "called for increased aid to developing nations"],
        "answer": 0
    }, {
        "prompt": "A study of the Progressive Movement would indicate that Progressives",
        "questions": ["wished to ease immigration requirements", "sought to correct the abuses of industrial society", "opposed most of the Populist platform", "were mainly supported by big business"],
        "answer": 1
    }, {
        "prompt": "Which speaker would most likely support laissez-faire captialism?",
        "questions": ["A", "B", "C", "D"],
        "answer": 2
    }, {
        "prompt": "Which speaker best expresses beliefs held by Robert La Follette?",
        "questions": ["A", "B", "C", "D"],
        "answer": 1
    }, {
        "prompt": "Many of Theodore Roosevelt's ations demonstrated his belief that the role of the President was to",
        "questions": ["act vigorously in the public interest", "follow the lead of Congress", "remain free from politics", "free business from burdensome government regulation"],
        "answer": 0
    }, {
        "prompt": "Theodore Roosevelt's Square Deal and Woodrow Wilson's New Freedom were primarily designed to",
        "questions": ["increase the power and influence of the United States in foreign affairs", "reduce the role of government in the economy", "help Americans cope with the problems caused by industrialization", "protect the consititutional rights of religious and racial minorities"],
        "answer": 2
    }, {
        "prompt": "The Federal Reserve System was established to",
        "questions": ["serve as a source for farm loans", "reform the practices of big business", "balance the federal budget", "regulate the circulation of money"],
        "answer": 3
    }, {
        "prompt": "The Women's Rights Movement of the late 19th century primarily focused its efforts on securing",
        "questions": ["Cabinet positions for women", "the reform of prisons", "equal rights for all minorities", "suffrage for women"],
        "answer": 3
    }, {
        "prompt": "Which headline best illustrates the concept of imperialism?",
        "questions": [
            "\"The Supreme Court Bans Segregation in Public Schools\"",
            "\"United Nations is Founded in San Francisco\"",
            "\"President McKinley Announces U.S. Annexation of the Philippines\"",
            "\"President Roosevelt Meets Japanese and Russian Leaders at Portsmouth\""
        ],
        "answer": 2
    }, {
        "prompt": "The primary reason for the construction of the Panama Canal was the need to",
        "questions": ["increase the security and power of the United States", "spread the American way of life to less developed nations", "encourage the economic development of Central America", "stop the spread of Communism in the Western Hemisphere"],
        "answer": 0
    }, {
        "prompt": "Which U.S. foreign policy does the cartoon to the right depict?",
        "questions": ["Open Door Policy", "isolationism", "Big Stick Policy", "neutrality"],
        "answer": 2
    }, {
        "prompt": "A primary aim of the \"Open Door\" Policy was to",
        "questions": ["encourage Chinese citizens to emigrate to other nations", "preserve American trade with China", "develop China's industrial capacity", "introduce democratic government into China"],
        "answer": 1
    }, {
        "prompt": "In Schenck v. United States, the Supreme Court decided that a \"clear and present danger\" to the United States permitted",
        "questions": ["an expansion of Presidental power", "restrictions on 1st Amendment rights", "establishment of a peacetime draft", "limitations on the right to vote"],
        "answer": 1
    }, {
        "prompt": "Which was a major result of World War I?",
        "questions": ["American troops occupied Japan.", "The Austro-Hungarian empire was divided into smaller nations.", "The Soviet Union gained control of Eastern Europe.", "Britain and France lost their colonies."],
        "answer": 1
    }, {
        "prompt": "A major reason why some members of the U.S. Senate objected to joining the League of Nations was their opposition to",
        "questions": ["lower tariffs", "freedom of the seas", "potential military commitments", "German membership in the League"],
        "answer": 2
    }, {
        "prompt": "The refusal of the United States to join the League of Nations illustrates the policy known as",
        "questions": ["Manifest Destiny", "imperialism", "neutrality", "isolationism"],
        "answer": 3
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
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
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
    for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) {
            points++
        } else {
            console.warn(`Question ${i+1}\n${questions[i].prompt}\nYour answer: ${questions[i].questions[answers[i]]}\nCorrect answer: ${questions[i].questions[questions[i].answer]}`)
        }
    }

    console.log(`\n%cPoints: ${points} / ${questions.length} (${(points / questions.length * 100).toFixed(1)}%)`, "font-size: 24px")
}

function makeQuestions() {
    for (let i = 0; i < 22; i++) {
        questions[i] = {prompt: "", questions: ["", "", "", ""], answer: 0}
        questions[i].prompt = prompt(`Question ${i+1}/22, Prompt:`)
        if (questions[i].prompt == "quit") { throw new Error("quit") }
        for (let j = 0; j < 4; j++) {
            questions[i].questions[j] = prompt(`Question ${i+1}/22, Answer ${j+1}:`)
            if (questions[i].questions[j] == "quit") { throw new Error("quit") }
        }
        questions[i].answer = prompt(`Question ${i+1}/22, Correct Answer:`) - 1
        if (questions[i].answer == "quit") { throw new Error("quit") }
    }
    console.log(JSON.stringify(questions))
}