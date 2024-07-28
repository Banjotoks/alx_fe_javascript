document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const importFile = document.getElementById('importFile');
    const exportButton = document.getElementById('exportButton');
    const categoryFilter = document.getElementById('categoryFilter');
    const notification = document.getElementById('notification');

    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: 'The greatest player of all time is Cristiano Ronaldo', category: 'Football' },
        { text: 'Jesus is the way, the truth and the life.', category: 'Bible'}
    ];

    let categories = [...new Set(quotes.map(quote => quote.category))];
    let selectCategory = localStorage.getItem('selectedCategory') || 'all';
    
    console.log('Initial quotes:, quotes');
    console.log('Initial categories:', categories);

    function populateCategories() {
        categoryFilter.innerHTML = '<option value= "all">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            if (category === selectedCategory) {
                option.selected = true;
            }
            categoryFilter.appendChild(option);
        });
        console.log('Category filter populated with categories:',categories);
    }

    function filterQuotes() {
        selectedCategory = categoryFilter.value;
        localStorage.setItem('selected Category:', selectedCategory);
        console.log('selectedCategory:', selectedCategory);
        const filterdQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        console.log('Filtered quotes:', filteredQuotes);
        if(filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const quote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
            sessionStorage.setItem('lastViewedQuote', Json.stringify(quote));
            console.log('Displayed filtered quote:', quote);
        } else {
            quoteDisplay.innerHTML = 'No quotes available for the selected category.';

        }

    }

    function showRandomQuote() {
        const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
        if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        console.log(`Displaying quote: "${quote.text}" - ${quote.category}`);
        quoteDisplay.innerHTML = `"${quote.text}" - ${quote.category}`;
        sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
        console.log('Displayed quote:', quote);
    } else{
        quoteDisplay.innerHTML = 'No quotes availablefor the selected category.';
    }
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
            if (!categories.includes(newQuoteCategory)) {
                categories.push(newQuoteCategory);
                populateCategories();
            }
            syncQuotes();
        } else {
            console.log('Failed to add quote: Missing text or category');
            alert('Please enter both a quote and a category.');
        }
    }

    function exportJson() {
        const dataStr = JSON.stringify(quotes);
        const blob = new Blob([dataStr], { type: 'application/json'});        const dataUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const url = URL.createObjectURL(blob);

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
          categories = [...new Set(quotes.map(quote => quote.category))];
          populateCategories();
          syncQuotes();
          filterQuotes();
        };
        fileReader.readAsText(event.target.files[0]);
      }

      async function syncQuotes() {
        try {
            // Fetch existing quotes from the server
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            console.log('Fetched quotes from server:', serverQuotes);

            // Map server data to match local quote structure
            const mappedServerQuotes = serverQuotes.map(item => ({ text: item.title, category: 'Server' }));

            // Merge quotes, prioritizing server data
            const mergedQuotes = [...mappedServerQuotes];
            quotes.forEach(localQuote => {
                if (!mappedServerQuotes.some(serverQuote => serverQuote.text === localQuote.text && serverQuote.category === localQuote.category)) {
                    mergedQuotes.push(localQuote);
                }
            });

            quotes = mergedQuotes;
            localStorage.setItem('quotes', JSON.stringify(quotes));
            console.log('Merged quotes saved to local storage:', quotes);

            // Notify user of update
            notification.textContent = 'Quotes synced with server!';
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);

            // Update categories and filtered quotes
            categories = [...new Set(quotes.map(quote => quote.category))];
            populateCategories();
            filterQuotes();

        } catch (error) {
            console.error('Error syncing with server:', error);
        }
    }

      // Event listeners
    newQuoteButton.addEventListener('click', showRandomQuote);
    importFile.addEventListener('change,' importFromJsonFile);
    exportButton.addEventListener('click', exportToJsonFile);
    window.addQuote = addQuote;

    // Initialize the add quote form
    populateCategories();
    filterQuotes();


    createAddQuoteForm();
    const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewedQuote) {
        quoteDisplay.innerHTML = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
        console.log('Displayed last viewed quote from session storage:', lastViewedQuote);
    } else {

    // Display a random quote initially
    showRandomQuote();
    }

    syncWithServer();
    setInterval(fetchFromServer, 10000);  // Fetch new quotes every 10 seconds

});
