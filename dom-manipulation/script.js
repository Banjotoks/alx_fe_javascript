document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const importFile = document.getElementById('importFile');
    const exportButton = document.getElementById('exportButton');

    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: 'The greatest player of all time is Cristiano Ronaldo', category: 'Football' },
        { text: 'Jesus is the way, the truth and the life.', category: 'Bible'}
    ];

    console.log('Initial quotes:, quotes');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        console.log(`Displaying quote: "${quote.text}" - ${quote.category}`);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        console.log('last viewed quote saved to session storage:', quote);
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
            localStorage.setItem('quotes', JSON.stringify(quotes));
            console.log('Quotes saved to local storage:', quotes);
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            alert('New quote added successfully!');
        } else {
            console.log('Failed to add quote: Missing text or category');
            alert('Please enter both a quote and a category.');
        }
    }

    function exportJson() {
        const dataStr = JSON.stringify(quotes);
        const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'quotes.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href',dataUrl)
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        console.log('Quotes exported to Json file:', dataStr);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          console.log('Imported quotes:', importedQuotes);
          quotes.push(...importedQuotes);
          localStorage.setItem('quotes', JSON.stringify(quotes));
          console.log('Updated quotes saved to local storage:', quotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
      }

      // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    importFile.addEventListener('change,' importFromJsonFile);
    exportButton.addEventListener('click', exportToJsonFile);
    window.addQuote = addQuote;

    // Initialize the add quote form
    createAddQuoteForm();
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
        console.log('Displayed last viewed quote from session storage:', lastViewedQuote);
    } else {

    // Display a random quote initially
    showRandomQuote();
    }
});
