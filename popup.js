import { quotes } from "./quotes.js";
import { getNameDays } from "./names.js";

document.addEventListener("DOMContentLoaded", function () {
    const quoteElement = document.getElementById("quote");
    const authorElement = document.getElementById("author");
    const newQuoteButton = document.getElementById("new-quote");
    const categorySelect = document.getElementById("category-select");

    // Funkcia na získanie názvu mesiaca v slovenčine
    function getMonthName(monthNumber) {
        const months = [
            "Január", "Február", "Marec", "Apríl", "Máj", "Jún",
            "Júl", "August", "September", "Október", "November", "December"
        ];
        return months[monthNumber - 1]; // Indexovanie od 0
    }

    // Funkcia na získanie aktuálneho dátumu vo formáte "MM-DD" (pre meniny) + "DD. Mesiac" (na zobrazenie)
    function getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const monthName = getMonthName(now.getMonth() + 1);

        return {
            apiFormat: `${month}-${day}`, // Formát pre meniny
            displayFormat: `${day}. ${monthName}` // Formát na zobrazenie
        };
    }

    // Funkcia na získanie citátu podľa kategórie
    function getQuoteForToday(category) {
        const { apiFormat, displayFormat } = getCurrentDate();
        const nameDayList = getNameDays(apiFormat);

        // Filtrovanie citátov podľa kategórie
        let filteredQuotes = quotes;
        if (category !== "all") {
            filteredQuotes = quotes.filter(q => q.category === category);
        }

        // Ak neexistujú citáty v danej kategórii, vyberieme náhodný citát zo všetkých
        const quote = filteredQuotes.length > 0
            ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]
            : quotes[Math.floor(Math.random() * quotes.length)];

            return {
                quoteText: `"${quote.text}"`,
                authorText: `- ${quote.author}`,
                date: displayFormat,
                nameDays: nameDayList.length > 0 ? nameDayList.join(", ") : "Dnes nemá nikto meniny.",
                category: category // Add this line
            };
    }

    // Funkcia na zobrazenie citátu, dátumu a mien
    function updateQuoteDisplay(category) {
        const { quoteText, authorText, date, nameDays } = getQuoteForToday(category);
        
        quoteElement.textContent = quoteText;
        authorElement.textContent = authorText;

        const dateElement = document.getElementById("date-info") || document.createElement("p");
        dateElement.id = "date-info";
        dateElement.innerHTML = `<br>📅 Dátum: ${date} | 🎉 Meniny: ${nameDays}`;
        
        if (!document.getElementById("date-info")) {
            document.body.appendChild(dateElement);
        }
    }

    // Funkcia na kontrolu, či sa má vybrať nový citát
    function shouldUpdateQuote() {
        const lastDisplayDate = localStorage.getItem("lastDisplayDate");
        const currentDate = getCurrentDate().displayFormat;

        if (lastDisplayDate !== currentDate) {
            localStorage.setItem("lastDisplayDate", currentDate);
            return true; // Nový deň, treba vybrať nový citát
        }
        return false; // Nie je nový deň, ponechať aktuálny citát
    }

  // Načítať uložený citát alebo vybrať nový
function loadQuote() {
    const savedQuote = localStorage.getItem("savedQuote");
    const savedDate = localStorage.getItem("lastDisplayDate");
    const currentDate = getCurrentDate().displayFormat;
    const selectedCategory = localStorage.getItem("selectedCategory") || "all";

    // Check if we need to update (new day or category changed)
    const shouldUpdate = !savedQuote || savedDate !== currentDate || 
                        (savedQuote && JSON.parse(savedQuote).category !== selectedCategory);

    if (!shouldUpdate && savedQuote) {
        // Use the saved quote
        const { quoteText, authorText, date, nameDays } = JSON.parse(savedQuote);
        quoteElement.textContent = quoteText;
        authorElement.textContent = authorText;

        const dateElement = document.getElementById("date-info") || document.createElement("p");
        dateElement.id = "date-info";
        dateElement.innerHTML = `<br>📅 Dátum: ${date} | 🎉 Meniny: ${nameDays}`;
        
        if (!document.getElementById("date-info")) {
            document.body.appendChild(dateElement);
        }
    } else {
        // Generate new quote
        updateQuoteDisplay(selectedCategory);
        const newQuote = getQuoteForToday(selectedCategory);
        // Store the category with the quote
        const quoteToSave = {...newQuote, category: selectedCategory};
        localStorage.setItem("savedQuote", JSON.stringify(quoteToSave));
        localStorage.setItem("lastDisplayDate", currentDate);
    }
}

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categorySelect.value = savedCategory;
    }

    // Načítať citát pri načítaní stránky
    loadQuote();

    categorySelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        updateQuoteDisplay(selectedCategory);
        const newQuote = getQuoteForToday(selectedCategory);
        localStorage.setItem("savedQuote", JSON.stringify(newQuote));
    });
});