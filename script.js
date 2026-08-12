/* =========================================================
   HIDDEN QUEST — C L A Y
   SCRIPT.JS
   QUEST + WEIGHTED SPIN WHEEL + REWARD / ZONK
========================================================= */


/* =========================================================
   QUEST DATA
   EDIT PERTANYAAN DAN JAWABAN DI SINI
========================================================= */

const QUESTIONS = [

    {
        question: "Apa pandangan kalian tentang CLAY?",
        answers: [
            "Baik",
            "Ngeselin",
            "Ngangenin",
            "Semua itu CLAY"
        ]
    },

    {
        question: "Apa pekerjaan CLAY?",
        answers: [
            "Bandar Judol",
            "Marbot Masjid",
            "Retail Trader",
            "Anak DPRD"
        ]
    },

    {
        question: "Apa kalian sayang CLAY?",
        answers: [
            "Low",
            "Medium",
            "Hard",
            "Extreme"
        ]
    },

    {
        question: "Apa identitas Rahasia CLAY?",
        answers: [
            "CEO PT MEGAH PEARLS GROUP",
            "Spiderman",
            "Batman",
            "Admin MBG"
        ]
    },

    {
        question: "Siapa nama pacar CLAY?",
        answers: [
            "ALYA PUTRY",
            "ALYA CATHELYNE",
            "ALYA SUMBUL",
            "ALYA ZAHRA"
        ]
    }

];


/* =========================================================
   REWARD CONFIGURATION
   TOTAL CHANCE HARUS = 100
========================================================= */

const REWARDS = [

    {
        name: "ZONK",
        chance: 50.00,
        type: "zonk"
    },

    {
        name: "Decoration",
        chance: 50.00,
        type: "reward"
    },

    {
        name: "NITRO",
        chance: 50.00,
        type: "reward"
    },

    {
        name: "BUNDLE",
        chance: 50.00,
        type: "reward"
    }

];


/*
    TOTAL:

    ZONK       = 99.990%
    HADIAH A   = 0.005%
    HADIAH B   = 0.003%
    HADIAH C   = 0.002%

    TOTAL      = 100%
*/


/* =========================================================
   STATE
========================================================= */

let currentQuestion = 0;

let isTransitioning = false;

let isSpinning = false;

let wheelRotation = 0;


/* =========================================================
   ELEMENTS
========================================================= */

const questScreen =
    document.getElementById("questScreen");

const completeScreen =
    document.getElementById("completeScreen");

const wheelScreen =
    document.getElementById("wheelScreen");

const rewardScreen =
    document.getElementById("rewardScreen");

const questionCounter =
    document.getElementById("questionCounter");

const progressBar =
    document.getElementById("progressBar");

const questionNumber =
    document.getElementById("questionNumber");

const questionText =
    document.getElementById("questionText");

const answersContainer =
    document.getElementById("answersContainer");

const continueButton =
    document.getElementById("continueButton");

const spinButton =
    document.getElementById("spinButton");

const spinStatus =
    document.getElementById("spinStatus");

const wheel =
    document.getElementById("wheel");

const rewardName =
    document.getElementById("rewardName");


/* =========================================================
   LOAD QUESTION
========================================================= */

function loadQuestion() {

    const data =
        QUESTIONS[currentQuestion];


    questionNumber.textContent =
        "QUESTION_" +
        String(currentQuestion + 1).padStart(2, "0");


    questionText.textContent =
        data.question;


    questionCounter.textContent =
        String(currentQuestion + 1).padStart(2, "0") +
        " / " +
        String(QUESTIONS.length).padStart(2, "0");


    const progress =
        ((currentQuestion + 1) / QUESTIONS.length) * 100;


    progressBar.style.width =
        progress + "%";


    answersContainer.innerHTML = "";


    data.answers.forEach(
        (answer, index) => {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "answer-button";


            button.innerHTML = `

                <span class="answer-key">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span class="answer-text">
                    ${escapeHTML(answer)}
                </span>

            `;


            button.addEventListener(
                "click",
                () => selectAnswer(index)
            );


            answersContainer.appendChild(button);

        }
    );

}


/* =========================================================
   SELECT ANSWER
========================================================= */

function selectAnswer(answerIndex) {

    if (isTransitioning) {
        return;
    }


    isTransitioning = true;


    console.log(
        "Question:",
        currentQuestion + 1,
        "Answer:",
        String.fromCharCode(65 + answerIndex)
    );


    questScreen.classList.add("exit");


    setTimeout(() => {

        currentQuestion++;


        if (
            currentQuestion >=
            QUESTIONS.length
        ) {

            showComplete();

            return;

        }


        questScreen.classList.remove("exit");


        void questScreen.offsetWidth;


        loadQuestion();


        isTransitioning = false;

    }, 250);

}


/* =========================================================
   QUEST COMPLETE
========================================================= */

function showComplete() {

    questScreen.style.display =
        "none";


    completeScreen.classList.add(
        "active"
    );


    isTransitioning = false;

}


/* =========================================================
   CONTINUE → WHEEL
========================================================= */

function showWheel() {

    completeScreen.classList.remove(
        "active"
    );


    completeScreen.style.display =
        "none";


    wheelScreen.classList.add(
        "active"
    );


    spinStatus.textContent =
        "READY TO SPIN";


    spinButton.disabled =
        false;

}


/* =========================================================
   WEIGHTED RANDOM
========================================================= */

function getWeightedReward() {

    const random =
        Math.random() * 100;


    let accumulated =
        0;


    for (
        const reward of REWARDS
    ) {

        accumulated +=
            reward.chance;


        if (
            random <=
            accumulated
        ) {

            return reward;

        }

    }


    /*
        Fallback kalau ada pembulatan
        floating-point.
    */

    return REWARDS[
        REWARDS.length - 1
    ];

}


/* =========================================================
   CREATE WHEEL
========================================================= */

function createWheel() {

    wheel.innerHTML = "";

    const segmentCount = REWARDS.length;

    const segmentAngle = 360 / segmentCount;

    REWARDS.forEach((reward, index) => {

        const segment =
            document.createElement("div");

        segment.className =
            "wheel-segment";


        const label =
            document.createElement("span");

        label.textContent =
            reward.name;


        /*
         * Tentukan posisi setiap hadiah
         */

        const angle =
            index * segmentAngle +
            segmentAngle / 2;


        segment.style.setProperty(
            "--label-angle",
            `${angle}deg`
        );


        segment.appendChild(label);


        wheel.appendChild(segment);

    });

}


/* =========================================================
   SPIN WHEEL
========================================================= */

function spinWheel() {

    if (isSpinning) {
        return;
    }


    isSpinning = true;

    spinButton.disabled = true;


    spinStatus.textContent =
        "CALCULATING DESTINY...";


    /*
        Tentukan hasil SEBELUM
        animasi dimulai.
    */

    const selectedReward =
        getWeightedReward();


    console.log(
        "Selected reward:",
        selectedReward.name,
        "| Chance:",
        selectedReward.chance + "%"
    );


    /*
        Cari index hadiah.
    */

    const rewardIndex =
        REWARDS.indexOf(
            selectedReward
        );


    const segmentAngle =
        360 / REWARDS.length;


    /*
        Posisi tengah segment.
    */

    const targetAngle =
        rewardIndex *
        segmentAngle +
        segmentAngle / 2;


    /*
        Pointer berada di atas.
        Karena wheel bergerak searah
        jarum jam, kita putar ke posisi
        target dari arah yang benar.
    */

    const targetRotation =
        360 -
        targetAngle;


    /*
        Tambahkan 5–8 putaran penuh
        supaya animasinya terasa natural.
    */

    const fullSpins =
        5 +
        Math.floor(
            Math.random() * 4
        );


    wheelRotation +=
        fullSpins * 360;


    wheelRotation +=
        targetRotation;


    /*
        Sedikit random offset visual
        di dalam segment.

        Tidak mengubah hasil probability.
    */

    const visualOffset =
        (Math.random() - 0.5) *
        (segmentAngle * 0.45);


    wheelRotation +=
        visualOffset;


    wheel.style.transform =
        `rotate(${wheelRotation}deg)`;


    /*
        Tunggu sampai animasi selesai.
    */

    setTimeout(() => {

        isSpinning = false;


        spinStatus.textContent =
            "RESULT CALCULATED";


        showResult(
            selectedReward
        );

    }, 5200);

}


/* =========================================================
   SHOW RESULT
========================================================= */

function showResult(
    selectedReward
) {

    setTimeout(() => {

        wheelScreen.classList.remove(
            "active"
        );


        wheelScreen.style.display =
            "none";


        if (
            selectedReward.type ===
            "zonk"
        ) {

            showZonk(
                selectedReward
            );

        } else {

            showReward(
                selectedReward
            );

        }

    }, 500);

}


/* =========================================================
   SHOW REWARD
========================================================= */

function showReward(
    reward
) {

    rewardName.textContent =
        reward.name;


    rewardScreen.classList.add(
        "active"
    );


    rewardScreen.style.display =
        "block";


    console.log(
        "🎁 REWARD UNLOCKED:",
        reward.name
    );

}


/* =========================================================
   ZONK SCREEN
========================================================= */

function showZonk(
    reward
) {

    /*
        Buat screen Zonk secara dynamic
        supaya HTML awal tidak perlu
        punya elemen tambahan.
    */

    const zonkScreen =
        document.createElement("div");


    zonkScreen.id =
        "zonkScreen";


    zonkScreen.className =
        "zonk-screen active";


    zonkScreen.innerHTML = `

        <div class="zonk-icon">
            ☠
        </div>

        <div class="zonk-label">
            SYSTEM RESULT
        </div>

        <h2>
            ZONK
        </h2>

        <p>
            Luck wasn't on your side...
        </p>

        <div class="zonk-chance">
            ${reward.chance}% CHANCE
        </div>

    `;


    document
        .querySelector(".quest-card")
        .appendChild(
            zonkScreen
        );


    console.log(
        "💀 ZONK"
    );

}


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toUpperCase();


        if (
            !["A", "B", "C", "D"]
                .includes(key)
        ) {

            return;

        }


        if (
            !questScreen ||
            questScreen.style.display ===
            "none"
        ) {

            return;

        }


        const answerIndex =
            key.charCodeAt(0) -
            65;


        const buttons =
            answersContainer
                .querySelectorAll(
                    ".answer-button"
                );


        if (
            buttons[answerIndex]
        ) {

            buttons[
                answerIndex
            ].click();

        }

    }
);


/* =========================================================
   EVENT LISTENERS
========================================================= */

if (continueButton) {

    continueButton.addEventListener(
        "click",
        showWheel
    );

}


if (spinButton) {

    spinButton.addEventListener(
        "click",
        spinWheel
    );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   INITIALIZE
========================================================= */

createWheel();


if (
    QUESTIONS.length > 0
) {

    loadQuestion();

} else {

    questionNumber.textContent =
        "ERROR";


    questionText.textContent =
        "No quest data available.";


    answersContainer.innerHTML =
        "";

}