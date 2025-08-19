const bookList = [
    {
        title: "A Flower Traveled in My Blood: The Incredible True Story of the Grandmothers Who Fought to Find a Stolen Generation of Children",
        authors: ["Haley Cohen Gilliland"],
        genre: "non-fiction",
        pages: 512,
        read: false,
    },
    {
        title: "Strata: Stories from Deep Time",
        authors: ["Laura Poppick"],
        genre: "non-fiction",
        pages: 288,
        read: false,
    },
    {
        title: "Will Eisner: A Comics Biography",
        authors: ["Steve Weiner", "Dan Mazur (illustrator)"],
        genre: "non-fiction",
        pages: 300,
        read: false,
    },
];

// Helpers

function capitalize(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return string; // Handle non-string input or empty strings
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateRandomPastelColor() {
    const hue = Math.floor(Math.random() * 361); // Random hue (0-360)
    const saturation = Math.floor(Math.random() * (40 - 20 + 1)) + 20; // Saturation between 20% and 40%
    const lightness = Math.floor(Math.random() * (80 - 60 + 1)) + 60; // Lightness between 60% and 80%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Object Constructors

/**
 * Shelf in library that contains books. Size is in pages.
 * @param {number} size Size of shelf in book pages
 * @param {string} genre Genre of books on shelf
 */
function Shelf(size, genre) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.size = size;
    this.genre = genre
    this.books = [];
}

/**
 * Library composed of bookshelves.
 * @param {[Shelf]} shelves 
 */
function Library(shelves) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.shelves = shelves;
}

/**
 * Book
 * @param {string} title book title
 * @param {[string]} authors book authors
 * @param {number} pages how many pages
 * @param {boolean} read have you read the book
 */
function Book(title, authors, genre, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.title = title;
    this.authors = authors;
    this.genre = genre;
    this.pages = pages;
    this.read = read;
}

// Return room left in shelf in pages.
Shelf.prototype.roomLeft = function () {
    const spaceOccupied = this.books.reduce((acc, curr) => acc += curr.pages, 0);
    return this.size - spaceOccupied;
}

// Attempt to add book to shelf
Shelf.prototype.addBook = function (book) {
    if (this.genre !== book.genre) {
        throw Error(`Book is wrong genre, ${book.genre} !== ${this.genre}`);
    }
    if (!book.pages) {
        throw Error(`Book (${book.title}), has no pages`);
    }
    const roomLeft = this.roomLeft();
    if (roomLeft < book.pages) {
        console.log(`No room left on shelf, ${book.pages} > ${roomLeft}`);
        return false;
    }
    this.books.push(book);
    return true;
}

// Attempt to add book to library
Library.prototype.addBook = function (book) {
    let bookAdded = false;
    const shelves = this.shelves.filter((shelf) => shelf.genre === book.genre);
    if (shelves.length === 0) {
        console.log(`Book, ${book.title}, could not be added, no shelf available`);
    }
    shelves.forEach((shelf) => {
        if (!bookAdded && shelf.addBook(book)) {
            bookAdded = true;
        }
    });
    if (!bookAdded) {
        console.log(`Book, ${book.title}, could not be added, no room available`);
        return false;
    }
    console.log(`Book, ${book.title}, added to library`);
    return true;
}

// Render library as a set of bookshelves with books
function render(library) {
    const container = document.getElementById("container");
    const prevLibrary = document.getElementById("library");
    if (prevLibrary) {
        prevLibrary.remove();
    }
    const libraryContainer = document.createElement("div");
    libraryContainer.setAttribute("id", "library");
    container.appendChild(libraryContainer);

    // Add Shelves to library container
    library.shelves.forEach((shelf) => {
        const shelfContainer = document.createElement("fieldset");
        shelfContainer.classList.add("shelf");
        shelfContainer.setAttribute("style", `width: ${shelf.size / 8}px`);
        // Add genre to shelf container
        const legend = document.createElement("legend");
        legend.textContent = capitalize(shelf.genre);
        shelfContainer.appendChild(legend);
        // Add books to shelf containers
        shelf.books.forEach((book) => {
            const bookContainer = document.createElement("button");
            bookContainer.classList.add("book");
            bookContainer.setAttribute("style", `width: ${book.pages / 8}px; background-color: ${generateRandomPastelColor()}`);
            bookContainer.textContent = book.title.split(":")[0];
            shelfContainer.appendChild(bookContainer);

            // Create Tooltip
            const tooltip = document.createElement("div");
            tooltip.classList.add("tooltip");
            const title = document.createElement("span");
            title.textContent = book.title;
            const authors = document.createElement("span");
            authors.textContent = book.authors.join(", ");
            const genre = document.createElement("span");
            genre.textContent = capitalize(book.genre);
            const pages = document.createElement("span");
            pages.textContent = `${book.pages} pages`;
            const read = document.createElement("span");
            read.textContent = book.read ? "Read" : "Not Read";
            tooltip.appendChild(title);
            tooltip.appendChild(authors);
            tooltip.appendChild(genre);
            tooltip.appendChild(pages);
            tooltip.appendChild(read);
            shelfContainer.appendChild(tooltip);
        });
        // Add shelf to library container
        libraryContainer.appendChild(shelfContainer);
    })
}

document.addEventListener("DOMContentLoaded", (event) => {
    // Create shelves
    const nonfiction = new Shelf(4000, "non-fiction");
    const fantasy = new Shelf(3000, "fantasy");
    const mystery = new Shelf(3000, "mystery");

    // Create library and add shelves
    const library = new Library([nonfiction, fantasy, mystery]);

    // Add books to library
    bookList.forEach((b) => {
        const { title, authors, genre, pages, read } = b;
        const book = new Book(title, authors, genre, pages, read);
        library.addBook(book);
    });

    // Add New Book Button
    const dialog = document.getElementById("newBookForm");
    const closeDialog = document.getElementById("closeBookForm");
    const newBook = document.getElementById("newBook");
    closeDialog.addEventListener("click", () => {
        dialog.close();
    });
    newBook.addEventListener("click", () => {
        dialog.showModal();
    });

    // Add Book Button
    const addBook = document.getElementById("addBook");
    addBook.addEventListener("click", (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const authors = document.getElementById("authors").value.split(", ");
        const genre = document.getElementById("genre").value;
        const pages = Number(document.getElementById("pages").value);
        const read = document.getElementById("read").checked;
        const book = new Book(title, authors, genre, pages, read);
        dialog.close();
        library.addBook(book);
        render(library);
    });

    render(library);
});