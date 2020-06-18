class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI {
    static displayBooks() {
        let books = Store.getBooks()
        books.forEach((book) => UI.addBookToList(book))
    }
    static addBookToList(book) {
        const tbody = document.querySelector('#book-list')
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-sm btn-danger delete">X</a></td>
        `
        tbody.appendChild(tr)
    }
    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, status) {
        const alert = document.createElement('div')
        alert.className = `alert alert-${status}`
        alert.innerHTML = `
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <h4 class="alert-heading">Success!</h4>
            <p class="mb-0">${message}</p>
        `
        const body = document.getElementsByTagName('body')[0]
        body.appendChild(alert)
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000)
    }

    static clearFiled() {
        document.querySelector('#title').value = ''
        document.querySelector('#author').value = ''
        document.querySelector('#isbn').value = ''
    }
}

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
        let books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books))

    }

    static deleteBook(isbn) {
        let books = Store.getBooks().filter((item) => item.isbn !== isbn)
        localStorage.setItem('books', JSON.stringify(books))
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', UI.displayBooks); // Document still loading so DomContentLoaded can still fire :)
} else {
    UI.displayBooks();
}

document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target)
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent)
    UI.showAlert('Book deleted', 'success')
})

const fieldValidation = (el) => {
    const parent = el.parentElement
    const span = document.createElement('span')
    span.className = 'invalid-feedback invalid-feedback'
    const dataValue = el.getAttribute('data-value')
    span.innerText = `Please Fill ${dataValue} field`
    parent.insertBefore(span, null)
}

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.querySelector('#title').value
    const author = document.querySelector('#author').value
    const isbn = document.querySelector('#isbn').value

    if (title === "") {
        fieldValidation(document.querySelector('#title'))
    }
    if (author === "") {
        fieldValidation(document.querySelector('#author'))
    }
    if (isbn === "") {
        fieldValidation(document.querySelector('#isbn'))
    } else {
        const errorMessage = document.querySelectorAll('.invalid-feedback')
        errorMessage.forEach((el) => {
            el.classList.remove('invalid-feedback')
            el.innerText = ''
        })
        const book = new Book(title, author, isbn)
        UI.addBookToList(book)
        Store.addBook(book)
        UI.showAlert('Book Added', 'success')
        UI.clearFiled()
    }
})