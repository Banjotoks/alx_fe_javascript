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

        // Create elements
        const newQuoteText = document.createElement('input');
        newQuoteText.id = 'newQuoteText';
        newQuoteText.type = 'text';
        newQuoteText.placeholder = 'Enter a new quote';

        const newQuoteCategory = document.createElement('input');
        newQuoteCategory.id = 'newQuoteCategory';
        newQuoteCategory.type = 'text';
        newQuoteCategory.placeholder = 'Enter quote category';

        const addQuoteButton = document.createElement('button');
        addQuoteButton.id = 'addQuoteButton';
        addQuoteButton.textContent = 'Add Quote';

        // Append elements to form
        addQuoteForm.appendChild(newQuoteText);
        addQuoteForm.appendChild(newQuoteCategory);
        addQuoteForm.appendChild(addQuoteButton);

        // Add event listener
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
