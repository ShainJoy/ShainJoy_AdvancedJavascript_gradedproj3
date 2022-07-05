/**
 * Typing Speed Test App
 * 
 */

const quotes = ["The journey of a thousand miles begins with one step.",
"You must be the change you wish to see in the world.",
"Whether you think you can or you think you can't, you're right.",
"Strive not to be a success, but rather to be of value.",
"Great minds discuss ideas; average minds discuss events; small minds discuss people.",
"Those who dare to fail miserably can achieve greatly.",
"Life is ten percent what happens to you and ninety percent how you respond to it.",
"Dream big and dare to fail.",
"A successful man is one who can lay a firm foundation with the bricks others have thrown at him.",
"The greatest glory in living lies not in never falling, but in rising every time we fall.",
"It always seems impossible until it's done.",
"Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.",
"Success is not final, failure is not fatal: it is the courage to continue that counts.",
"I have no special talent. I am only passionately curious.",
"Insanity is doing the same thing over and over again and expecting different results.",
"Simplicity is the ultimate sophistication.",
"It is never too late to be what you might have been.",
"The question isn't who is going to let me; it's who is going to stop me."
];

// Regulate the frequency of displaying Demo texts by changing 'speedLevel'.
// Ideal range is between 5 – 15 (15 is the Indian typing speed record)
const speedLevel = 5;
// let Question_Answers;
let recentQuotes;
let test_timerId, question_timeOutId;
let current_question;
let current_demo_text, user_input;
let current_word;
let isCorrect = true;
let wpm, cpm, errors, wpm_ttl, cpm_ttl, errors_ttl;
const demo_txt_El = document.querySelector( '.demo-text' );
const input_El = document.getElementById( 'feeder' );
const btn_restart = document.querySelector( '.restart' );
const time_El = document.querySelector( '.time');
const wpm_El = document.getElementById( 'wpm' );
const cpm_El = document.getElementById( 'cpm' );
const wpm_cpm_containers = document.querySelectorAll( '.toggle-view' );
const errors_El = document.getElementById( 'errors' );
const accuracy_El = document.getElementById( 'accuracy' );

btn_restart.addEventListener( 'click', testRestart );

function start_test(){
    input_El.removeEventListener('focus', start_test );
    triggerNewQuote();
    start_test_countDown();
};

function show_wpm_cpm( choice ){
    // controls to show or hide wpm & cpm elements
    if( choice ){
        wpm_cpm_containers.forEach((element) => {
                element.classList.remove( 'd-none' );
            });
    }
    else{
        wpm_cpm_containers.forEach((element) => {
            element.classList.add( 'd-none' );
        });
    };
};

function clearTimers(){
    if( test_timerId !== undefined ){
        clearInterval(test_timerId);
        test_timerId = undefined;
    };
    if( question_timeOutId !== undefined ){
        clearTimeout(question_timeOutId);
        question_timeOutId = undefined;
    };
};

function testRestart(){
    recentQuotes = [-1,-1,-1];
    clearTimers();
    current_question = -1;
    current_demo_text = '';
    user_input = '';
    wpm_ttl = 0;
    cpm_ttl = 0;
    errors_ttl = 0;
    show_wpm_cpm( false );
    demo_txt_El.classList.remove( 'result-style' );
    // re-setting values to initial state.
    demo_txt_El.innerHTML = 'Demo text';
    time_El.innerText = '60s';
    errors_El.textContent = '0';
    accuracy_El.textContent = '100';
    input_El.value = '';
    input_El.addEventListener( 'focus', start_test );
    input_El.addEventListener('input', key_in );
};
testRestart();

function show_live_score(){
    let errors_tmp = errors_ttl + errors;
    let cpm_tmp = cpm + cpm_ttl;
    errors_El.textContent = errors_tmp;
    let accuracyVal = Math.round((cpm_tmp - errors_tmp)/ (cpm_tmp + errors_tmp) *100);
    accuracy_El.textContent = isNaN(accuracyVal) ? 0 : accuracyVal;
}

function showResult(){
    // enabling screen and displaying results
    input_El.removeEventListener('input', key_in );
    show_wpm_cpm( true );
    demo_txt_El.innerHTML = "Click on the button to restart";
    input_El.value = user_input;
    wpm_El.textContent = wpm_ttl;
    cpm_El.textContent = cpm_ttl;
    errors_El.textContent = errors_ttl;
    let accuracyVal = Math.round((cpm_ttl - errors_ttl)/ (cpm_ttl + errors_ttl) *100);
    accuracy_El.textContent = isNaN(accuracyVal) ? 0 : accuracyVal;
};

function key_in(event){
    if( event.data !== " " ){
        user_input = input_El.value;
        evaluate_QnA(current_question, user_input);
        demo_txt_El.innerHTML = current_demo_text;
        show_live_score();
    }
}

function evaluate_QnA( q_index, ans ){
    // evaluating a question and answer by breaking it into
    // different words.
    current_demo_text = '';
    current_word = false;
    wpm = 0;
    cpm = 0;
    errors = 0;
    let questionArry = quotes[q_index].split(' ');
    // If user typed multiple spaces consecutively, making it to single space
    ans = ans.replace(/\s\s+/g, ' ');
    let answersArry = ans.split(' ');
    cpm += ans.length;
    let answerWords = answersArry.length;
    let cntr = 0;
    let ansWord = '';
    for( cntr = 0; cntr < answerWords; cntr++ ){
        if(cntr === answerWords-1){current_word = true};
        ansWord = answersArry[cntr];
        if ( ansWord !== '') { 
            wpm++;
            current_demo_text += compare_words( questionArry[cntr], ansWord ) + ' ';
        }
        else{
            cntr = Math.max(0, cntr--);
            break;
        }
    };
    if(questionArry.length > cntr){
        // untyped words remaining with question
        current_demo_text += "<font color='black'> ";
        current_demo_text += questionArry.slice(cntr).join(' ');
    };
};

function compare_words( qstn, ans ){
    // comparing characters in user typed text with question
     let temp = '';
     let rslt = '';
     let i = 0;
     for ( i = 0; i < qstn.length; i++ ){
        if(current_word && (ans[i] === undefined)){break};
        if((ans[i] === qstn[i]) === isCorrect){
            temp += qstn[i];
        }
        else{
            rslt += appendFormattedText( temp, isCorrect );
            temp = '';
            temp += qstn[i];
            isCorrect = (ans[i] === qstn[i]);
        }
    };
    if(temp.length > 0){
        rslt += appendFormattedText( temp, isCorrect );
    };
    if( qstn.length > i ){
        rslt += "<font color='black'>" + qstn.substring( i );
    } else if( ans.length > i ){
        // If any character typed extra, it will be highlighted as * in red
        rslt += appendFormattedText( '*'.repeat(ans.length - i), false );
    }
    return rslt;
};

function appendFormattedText( appndtext, isCorrect ){
    // On evaluation, appends text on different colour
    if( isCorrect ){
        // correct answer
        return ("<font color='green'>" + appndtext);
    }
    else{
        // wrong answer
        errors += appndtext.length;
        return ("<font color='red'>" + appndtext);
    };
};

function triggerNewQuote(){
    // Generates a new quote and displays it.
    // also sets time, how long it has to be displayed.
    let quote = getOneQuote();
    demo_txt_El.textContent = quote;
    set_question_time( (quote.length/speedLevel)*1000 );
};

function setReady_nextQuote(){
    input_El.value = '';
    wpm_ttl += wpm;
    cpm_ttl += cpm;
    errors_ttl += errors;
    wpm = 0;
    cpm = 0;
    errors = 0;
};

function set_question_time( timeInMs ){
    // Sets the time for trigger new demo text
    question_timeOutId = setTimeout(function(){
        setReady_nextQuote();
        triggerNewQuote();
    }, timeInMs);
};

function start_test_countDown(){
    // Starting the app timer. 
    // Once time is elapsed, reads answer and trigger evaluation.
    if (test_timerId === undefined){
        let balTime = 60;
        test_timerId = setInterval(function(){
            balTime--;
            time_El.innerText = balTime + 's';
            if (balTime < 1){
                clearTimers();
                alert('Time is up!');
                setReady_nextQuote();
                showResult();
                return;
            }
        }, 1000);
    };
}

function getOneQuote(){
    let index;
    // ensuring last 3 quotes are not repeating.
    do{
        index = getRandomNumber(0, quotes.length-1);
    } while( isRecentQuote(index) );
    current_question = index;
    return quotes[index];
};

function isRecentQuote( index ){
    // checks current index with recent quotes array,
    // if exist, return true, else adds index to the last of array 
    // and removes the oldest one and return false
    if( recentQuotes.indexOf( index ) < 0 ){
        recentQuotes[0] = recentQuotes[1];
        recentQuotes[1] = recentQuotes[2];
        recentQuotes[2] = index;
        return false;
    };
    return true;
};

function getRandomNumber( min, max ){
    // returns a random number between provided min & max
    return Math.floor((Math.random() * (max - min ) + 1) + min);
};
