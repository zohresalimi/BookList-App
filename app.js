// Book Class: Represents a Book
class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks()
        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list')
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
        `
        list.appendChild(row)
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, colorStatus) {
        const alert = document.createElement('div')
        alert.className = `alert alert-dismissible alert-${colorStatus}`
        alert.innerHTML = `
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Success!</h4>
            <p class="mb-0">${message}</p>
        `
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(alert)
        setTimeout(() => document.querySelector('.alert').remove(), 3000)
    }

    static clearField() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
}

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }

    static addBook(book) {
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))

    }

    static deleteBook(isbn) {
        const filteredBook = Store.getBooks().filter((item) => {
            return item.isbn !== isbn
        })
        localStorage.setItem('books', JSON.stringify(filteredBook))
    }
}
// Event: Display Books
//document.addEventListener('click', UI.displayBooks)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UI.displayBooks); // Document still loading so DomContentLoaded can still fire :)
} else {
    UI.displayBooks();
}

// Field Validation
const validation = (el) => {
    const span = document.createElement('span')
    span.className = 'validation invalid-feedback'
    const dataValue = el.getAttribute('data-value')
    span.innerText = `Please Fille in ${dataValue} Field`
    const parentElement = el.parentElement
    parentElement.insertBefore(span, null)
}
// Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value
    if (title === '') {
        validation(document.querySelector(('#title')))
    }
    if (author === '') {
        validation(document.querySelector(('#author')))
    }
    if (isbn === '') {
        validation(document.querySelector(('#isbn')))
    } else {
        const invalidLabels = document.querySelectorAll('.validation')
        invalidLabels.forEach((el) => {
            el.classList.remove('invalid-feedback')
            el.innerText = ''
        })
        const book = new Book(title, author, isbn)
        UI.addBookToList(book)
        Store.addBook(book)
        UI.showAlert('Book added successfully', 'success')
        UI.clearField()
    }


})
// Event: Remove a Book

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent)
    UI.showAlert('Book deleted successfully', 'success')
})