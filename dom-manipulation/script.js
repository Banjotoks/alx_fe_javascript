document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');

    const quotes = [
        { text: 'The greatest player of all time is Cristiano Ronaldo', category: 'Football' },
        { text: 'Jesus is the way, the truth and the life.', category: 'Bible'}
    ];

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        console.log(`Displaying quote: "${quote.text}" - ${quote.category}`);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
    }

    function createAddQuoteForm() {
        const addQuoteForm = document.getElementById('addQuoteForm');
        addQuoteForm.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
    `;
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            console.log(`Added new quote: "${newQuoteText}" - ${newQuoteCategory}`);
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            alert('New quote added successfully!');
        } else {
            console.log('Failed to add quote: Missing text or category');
            alert('Please enter both a quote and a category.');
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    window.addQuote = addQuote;

    // Initialize the add quote form
    createAddQuoteForm();

    // Display a random quote initially
    showRandomQuote();
});
