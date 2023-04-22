let books = [];
const RENDER = "render";
const STORAGE_KEY = "Bookshelf";
const ITEM_ID = "itemId";

document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addBooks();
    submitForm.reset();
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    searchBooks();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
    console.log(books);
  }
});

function addBooks() {
}

function searchBooks() {
}

function loadDataFromStorage() {
}

function isStorageExist() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (e) {
    alert("Your browser does not support local storage");
    return false;
  }
}

function addBooks() {
  const textBook = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateId();

  books.push({
    id: generatedID,
    title: textBook,
    author,
    year,
    isComplete,
  });

  document.dispatchEvent(new Event(RENDER));
  saveData();
}


function generateId() {
  return Math.floor(Math.random() * 100000000);
}

function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

const incompletedBookList = document.getElementById("incompleteBookshelfList");
const completedBookList = document.getElementById("completeBookshelfList");

function renderBookList() {
  incompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBook(bookItem);
    bookElement[ITEM_ID] = bookItem.id;

    if (bookItem.isComplete) {
      completedBookList.append(bookElement);
    } else {
      incompletedBookList.append(bookElement);
    }
  }
}

document.addEventListener(RENDER, renderBookList);


function createBook(book) {

  const bookTitle = document.createElement("h3");
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = book.author;

  const bookYear = document.createElement("p");
  bookYear.innerText = book.year;

  const undoButton = createUndoButton();
  const finishButton = createFinishButton();
  const removeButton = createRemoveButton();

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("action");

  if (book.isComplete) {
    buttonContainer.append(undoButton, removeButton);
  } else {
    buttonContainer.append(finishButton, removeButton);
  }

  const bookContainer = document.createElement("article");
  bookContainer.setAttribute("id", book.id);
  bookContainer.classList.add("book_item");
  bookContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);

  return bookContainer;
}

const createFinishButton = () =>
  createButton("green", (event) => {
    addBookToCompleted(event.target.parentElement.parentElement);
    resetForm();
  }, "finish");

const createUndoButton = () =>
  createButton("green", (event) => {
    undoBookFromCompleted(event.target.parentElement.parentElement);
    resetForm();
  }, "undo");

const createRemoveButton = () =>
  createButton("red", (event) => {
    removeBookFromCompleted(event.target.parentElement.parentElement);
    resetForm();
  }, "remove");

const resetForm = () => {
  const searchForm = document.getElementById("searchBook");
  searchForm.reset();
};

const createButton = (buttonTypeClass, eventListener, text) => {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = `${text}`;
  button.addEventListener("click", (event) => {
    eventListener(event);
    event.stopPropagation();
  });
  return button;
};



function addBookToCompleted(bookElement) {
  const book = findBook(bookElement[ITEM_ID]);
  book.isComplete = true;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER));
  saveData();
}


function undoBookFromCompleted(bookElement) {
  const book = findBook(bookElement[ITEM_ID]);
  book.isComplete = false;
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER));
  saveData();
}


function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement);
  books.splice(bookPosition, 1);
  bookElement.remove();
  document.dispatchEvent(new Event(RENDER));
  saveData();
}


function findBook(bookId) {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}


function findBookIndex(bookElement) {
  const bookId = bookElement[ITEM_ID];
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
}


function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsed);
}


function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  if (serializedData !== null) {
    const data = JSON.parse(serializedData);
    books = [...books, ...data];
    
    document.dispatchEvent(new Event(RENDER));
  }
}

function isStorageExist() {
  try {
    const storage = localStorage;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    alert('Your browser does not support local storage');
    return false;
  }
}


function searchBooks() {
  const searchTitle = document.getElementById("searchBookTitle").value;

  const incompletedBookList = document.getElementById(
    "incompleteBookshelfList"
  );
  incompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  if (searchTitle === "") {
    incompletedBookList.innerHTML = "";
    completedBookList.innerHTML = "";
    books = [];
    console.log(books);
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  } else {
    const filteredBooks = books.filter((book) => {
      return book.title.toLowerCase().includes(searchTitle.toLowerCase());
    });
    console.log(filteredBooks);
    for (const bookItem of filteredBooks) {
      const bookElement = createBook(bookItem);
      bookElement[ITEM_ID] = bookItem.id;
      if (bookItem.isComplete) {
        completedBookList.append(bookElement);
      } else {
        incompletedBookList.append(bookElement);
      }
    }
  }
}
