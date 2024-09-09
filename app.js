document.addEventListener("DOMContentLoaded", function() {
    const booksList = document.getElementById("booksList");
    const filterGenre = document.getElementById("filterGenre");
    const sortBooks = document.getElementById("sortBooks");
    const prevPage = document.getElementById("prevPage");
    const nextPage = document.getElementById("nextPage");
    const errorMessage = document.getElementById("errorMessage");

    let books = [];
    let filteredBooks = [];
    let currentPage = 1;
    const booksPerPage = 6;

    async function fetchBooks() {
        try {
            const response = await fetch("books.json");
            if (!response.ok) throw new Error("Failed to fetch books");
            books = await response.json();
            populateGenreFilter();
            displayBooks();
        } catch (error) {
            showError(error.message);
        }
    }


    function populateGenreFilter() {
        const genres = [...new Set(books.map(book => book.genre))];
        genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre;
            option.textContent = genre;
            filterGenre.appendChild(option);
        });
    }

    function displayBooks() {
        const start = (currentPage - 1) * booksPerPage;
        const end = currentPage * booksPerPage;
        const booksToShow = filteredBooks.slice(start, end);

        booksList.innerHTML = "";
        booksToShow.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.className = "card p-4 rounded-lg shadow-lg";
            bookCard.innerHTML = `
                <h2 class="text-2xl font-bold mb-2">${book.title}</h2>
                <p class="text-secondary">Author: ${book.author}</p>
                <p class="text-secondary">Genre: ${book.genre}</p>
                <p class="text-secondary">Year: ${book.year}</p>
                <p class="text-secondary">Rating: ${book.rating}</p>
            `;
            booksList.appendChild(bookCard);
        });
    }

    
    function filterAndSortBooks() {
        const genre = filterGenre.value;
        const sortBy = sortBooks.value;

        filteredBooks = books.filter(book => genre === "" || book.genre === genre);

        filteredBooks.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) return -1;
            if (a[sortBy] > b[sortBy]) return 1;
            return 0;
        });

        currentPage = 1;
        displayBooks();
    }

    // Handle pagination
    function handlePagination(direction) {
        const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
        if (direction === "next" && currentPage < totalPages) currentPage++;
        if (direction === "prev" && currentPage > 1) currentPage--;
        displayBooks();
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }

    // Event listeners
    filterGenre.addEventListener("change", filterAndSortBooks);
    sortBooks.addEventListener("change", filterAndSortBooks);
    prevPage.addEventListener("click", () => handlePagination("prev"));
    nextPage.addEventListener("click", () => handlePagination("next"));

    // Initial fetch of books
    fetchBooks();
});
