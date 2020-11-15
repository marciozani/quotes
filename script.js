const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterButton = document.getElementById('twitter');
const newQuoteButton = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorContainer = document.getElementById('error-container');
const reloadButton = document.getElementById('reload');

function showLoadingSpinner() {
    loader.hidden = false;
    errorContainer.hidden = true;
    quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
    if (!loader.hidden) {
        loader.hidden = true;
        errorContainer.hidden = true;
        quoteContainer.hidden = false;
    }
}

function showError() {
    errorContainer.hidden = false;
    loader.hidden = true;
    quoteContainer.hidden = true;
}

async function getQuote() {
    showLoadingSpinner();
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';

    let retries = 10;
    let succeeded = false;
    while (retries > 0 && !succeeded) {
        try {
            const response = await fetch(proxyUrl + apiUrl);
            const data = await response.json();
            authorText.innerText = data.quoteAuthor === '' ? 'Unknown' : data.quoteAuthor;
            if (data.quoteText.length > 120) {
                quoteText.classList.add('long-quote');
            } else {
                quoteText.classList.remove('long-quote');
            }

            quoteText.innerText = data.quoteText;
            hideLoadingSpinner();
            succeeded = true;
        } catch (error) {
            // sometimes the json format fails in this API, then try again
            //getQuote();
            retries--;
        }
    }

    if (!succeeded) {
        showError();
    }
}

function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteButton.addEventListener('click', getQuote);
twitterButton.addEventListener('click', tweetQuote);
reloadButton.addEventListener('click', getQuote);

// On load
getQuote();