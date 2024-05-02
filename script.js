document.addEventListener('DOMContentLoaded', function() {
    let authorsData = {};
    let genres = ["Фантастика", "Детектив", "Пригоди", "Проза", "Поєзія", "Біографія", "Драма", "Дитяча література", "Класика"];
    let newAuthor;
    let addBtn = document.querySelector(".add-btn");

    function showAuthorForm() {
        const authorForm = document.querySelector('.author-info');
        authorForm.classList.remove('hidden');
    }

    function hideAuthorForm() {
        const authorForm = document.querySelector('.author-info');
        authorForm.classList.add('hidden');
    }

    addBtn.addEventListener('click', function() {
        showAuthorForm();
        
    });

    

    function saveDataToLocalStorage() {
        localStorage.setItem('authorsData', JSON.stringify(authorsData));
    }

    function loadDataFromLocalStorage() {
        const data = localStorage.getItem('authorsData');
        if (data) {
            authorsData = JSON.parse(data);
            displayAuthorsData(); 
        }
    }

    function showBookForm() {
        const editBook = document.querySelector('.edit-book');
        editBook.classList.remove('hidden');
    };

    function hideBookForm() {
        const editBook = document.querySelector('.edit-book');
        editBook.classList.add('hidden');
    };

    let editBtn = document.querySelector(".edit-btn");
    editBtn.addEventListener('click', function() {
        showBookForm();
    });

    function saveBook() {
        validateForm();

        const authorNameInput = document.querySelector('.author-info .name');
        const authorName = authorNameInput.value;

        const titleInput = document.querySelector('.edit-book .title');
        const pageCountInput = document.querySelector('.edit-book .page-count');
        const genreInput = document.querySelector('.edit-book .genre');

        const title = titleInput.value;
        const pageCount = pageCountInput.value;
        const genre = genreInput.value;

        const form = document.querySelector('.edit-book form');
        validateForm(form);

        const newBook = document.createElement('div');
        newBook.classList.add('book');
        newBook.innerHTML = `
            <p>${title}</p>
            <p>${pageCount} ст.</p>
            <p>${genre}</p>
            <button type="button" class="btn btn-danger del-btn">Видалити</button>
        `;

        const bookList = document.querySelector('.book-list');
        bookList.appendChild(newBook);

        if (authorsData.hasOwnProperty(authorName)) {
            authorsData[authorName].books.push(newBook);
            authorsData[authorName].bookCount++;
        } else {
            authorsData[authorName] = {
                books: [newBook],
                bookCount: 1
            };
        }

        const newDeleteBtns = document.querySelectorAll('.book .del-btn');
        newDeleteBtns.forEach(function(deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                const book = deleteBtn.parentElement;
                const author = book.parentElement;
                const authorNameElement = author.querySelector('td:first-child');
                const authorName = authorNameElement ? authorNameElement.textContent.trim() : '';
                book.remove();

                if (authorsData.hasOwnProperty(authorName)) {
                    const index = authorsData[authorName].books.indexOf(book);
                    if (index !== -1) {
                        authorsData[authorName].books.splice(index, 1);
                        authorsData[authorName].bookCount = authorsData[authorName].books.length;
                    }
                }
            });
        });

        attachAuthorButtonListeners();

        titleInput.value = '';
        pageCountInput.value = '';
        genreInput.value = '';
    };

    function attachAuthorButtonListeners(authorRow) {
        const deleteAuthorBtn = authorRow.querySelector('.del-btn-author');
        deleteAuthorBtn.addEventListener('click', function() {
            authorRow.remove();
            delete authorsData[authorRow.firstChild.textContent];
        });
    }

    let saveAuthorBtn = document.querySelector('.save-author-btn');

    function validateForm() {
        const forms = document.querySelectorAll(".needs-validation");
        Array.from(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                (event) => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    };

    let saveBtn = document.querySelector('.add-book-btn');
    saveBtn.addEventListener('click', function() {
        saveBook();
        hideBookForm();
    });

    function saveAuthor() {
        validateForm();
        const nameInput = document.querySelector('.author-info .name');
        const secondNameInput = document.querySelector('.author-info .second-name');
        const fatherNameInput = document.querySelector('.author-info .father-name');
        const bDayInput = document.querySelector('.author-info .b-day');

        const name = nameInput.value;
        const secondName = secondNameInput.value;
        const fatherName = fatherNameInput.value;
        const currentDate = new Date().toISOString().split('T')[0];
        const bDay = bDayInput ? bDayInput.value : currentDate;

        const form = document.querySelector('.author-info form');
        validateForm(form);

        if (name === '' || secondName === '' || bDay === '') {
            alert('Будь ласка, заповніть всі поля');
            return;
        }

        newAuthor = document.createElement('tr');
        newAuthor.innerHTML = `
            <td>${secondName} ${name.charAt(0)}. ${fatherName.charAt(0)}.</td>
            <td>${authorsData[name] ? authorsData[name].bookCount : 0}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Outline ">
                    <button type="button" class="btn btn-outline-primary edit-author-btn">Редагувати</button>
                    <button type="button" class="btn btn-outline-primary del-btn-author">Видалити</button>
                    <button type="button" class="btn btn-outline-primary author-detail-btn">Деталі</button>
                </div>
            </td>
        `;
        const contentTable = document.querySelector('.content-table tbody');
        contentTable.appendChild(newAuthor);


        attachAuthorButtonListeners(newAuthor);

        const editAuthorBtn = newAuthor.querySelector('.edit-author-btn');
        editAuthorBtn.addEventListener('click', function() {
            const name = newAuthor.querySelector('td:nth-child(1)').textContent;
            const secondName = newAuthor.querySelector('td:nth-child(1)').textContent.split(' ')[1];
            const fatherName = newAuthor.querySelector('td:nth-child(1)').textContent.split(' ')[3];
            const bDayElement = newAuthor.querySelector('td:nth-child(4)');
            const bDay = bDayElement ? bDayElement.textContent : '';

            const editAuthor = document.createElement('div');
            editAuthor.innerHTML = `
                <form class="row g-3 needs-validation" novalidate>
                    <div class="col-md-4">
                        <label for="1-fname" class="form-label">Ім'я:</label>
                        <input type="text" class="form-control name" id="1-fname"  value="${name}" required>
                        <div class="invalid-feedback " id="3-username-invalid-feedback">
                            Будь ласка, введіть Ім'я.
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label for="lname" class="form-label">Прізвище:</label>
                        <input type="text" class="form-control second-name" id="lname" value="${secondName}" required>
                        <div class="invalid-feedback hidden" id="3-username-invalid-feedback">
                            Будь ласка, введіть Прізвище.
                        </div>
                    </div>
                    <div class="col-12">
                        <label  class="form-label">По батькові:</label>
                        <input type="text" class="form-control father-name"  value="${fatherName}" >
                    </div>
                    <div class="col-12">
                        <label class="form-label">Дата народження</label>
                        <input type="date" class="form-control b-day" value="${bDay || currentDate}" required>
                        <div class="invalid-feedback hidden" id="3-username-invalid-feedback">
                            Будь ласка, оберіть дату.
                        </div>
                    </div>
                    <div class="book-list">
                        <h4>Книги</h4>
                        <button type="button" class="btn btn-primary ms-auto edit-btn">Редагувати</button>
                    </div>
                    <form class="row g-3 needs-validation hidden" novalidate>
                        <div class="edit-book">
                            <div class="col-12">
                                <label class="form-label">Назва:</label>
                                <input type="text" class="form-control title" required>
                                <div class="invalid-feedback hidden" id="3-username-invalid-feedback">
                                    Будь ласка, введіть назву.
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Кількість сторінок:</label>
                                <input type="number" class="form-control page-count" required>
                                <div class="invalid-feedback hidden" id="3-username-invalid-feedback">
                                   Будь ласка, введіть кількість сторінок.
                                </div>
                            </div>
                            <label class="form-label">Жанр:</label>
                            <select class="form-select genre" required>
                                <option>Фантастика</option>
                                <option>Детектив</option>
                                <option>Пригоди</option>
                                <option>Проза</option>
                                <option>Поєзія</option>
                                <option>Біографія</option>
                                <option>Драма</option>
                                <option>Дитяча література</option>
                                <option>Класика</option>
                            </select>
                            <div class="invalid-feedback hidden" id="3-username-invalid-feedback">
                                Будь ласка, оберіть жанр.
                            </div>
                            <button class="btn btn-primary ms-auto add-book-btn" >Додати книгу</button>
                        </form>
                    </div>
                    <button type="submit" class="btn btn-primary ms-auto save-author-btn" >Зберегти</button>
                </form>
            `;
            const saveAuthorEditsBtn = editAuthor.querySelector('.save-author-btn');

            saveAuthorEditsBtn.addEventListener('click', function() {
                saveAuthorEdits(newAuthor);
            });

            const editBtn = newAuthor.querySelector('.edit-author-btn');
            editBtn.parentNode.insertBefore(editAuthor, editBtn);

            const addBookBtn = editAuthor.querySelector('.add-book-btn');
            addBookBtn.addEventListener('click', function(){
                saveBook();
                hideBookForm();
            })

        });

    }
    saveAuthorBtn.addEventListener('click', function() {
        validateForm();
        saveAuthor();
        saveDataToLocalStorage();
        hideAuthorForm();
    });

    function saveAuthorEdits(newAuthor) {
        const newNameInput = newAuthor.querySelector('.name');
        const newSecondNameInput = newAuthor.querySelector('.second-name');
        const newFatherNameInput = newAuthor.querySelector('.father-name');
        const newBDayInput = newAuthor.querySelector('.b-day');

        const newName = newNameInput.value;
        const newSecondName = newSecondNameInput.value;
        const newFatherName = newFatherNameInput.value;
        const newBDay = newBDayInput.value;

        if (newName === '' || newSecondName === '' || newBDay === '') {
            alert('Будь ласка, заповніть всі поля');
            return;
        }

        const authorFullName = `${newSecondName} ${newName.charAt(0)} ${newFatherName.charAt(0)}.`;
        newAuthor.querySelector('td:nth-child(1)').textContent = authorFullName;

        const authorRow = document.querySelector('.content-table tbody tr');
        authorRow.innerHTML = `
            <td>${newSecondName} ${newName.charAt(0)}. ${newFatherName.charAt(0)}.</td>
            <td>${authorsData[newName] ? authorsData[newName].bookCount : 1}</td>
            <td>
                <div class="btn-group" role="group" aria-label="Outline ">
                    <button type="button" class="btn btn-outline-primary edit-author-btn">Редагувати</button>
                    <button type="button" class="btn btn-outline-primary del-btn-author">Видалити</button>
                    <button type="button" class="btn btn-outline-primary author-detail-btn">Деталі</button>
                </div>
            </td>
        `;

        const authorForm = document.querySelector('.author-info');
        authorForm.classList.add('hidden');

        const newEditBtns = document.querySelectorAll('.edit-author-btn');
        newEditBtns.forEach(function(editBtn) {
            editBtn.addEventListener('click', function() {
                const editBook = newAuthor.querySelector('.edit-book');
                editBook.classList.remove('hidden');
            });
        });

        newNameInput.value = '';
        newSecondNameInput.value = '';
        newFatherNameInput.value = '';
        newBDayInput.value = '';
    };

    function saveDataToLocalStorage() {
        localStorage.setItem('authorsData', JSON.stringify(authorsData));
    }

    function loadDataFromLocalStorage() {
        const data = localStorage.getItem('authorsData');
        if (data) {
            authorsData = JSON.parse(data);
            displayAuthorsData();
        }
    }

    function displayAuthorsData() {
        const contentTable = document.querySelector('.content-table tbody');
        contentTable.innerHTML = '';

        for (const [authorName, authorInfo] of Object.entries(authorsData)) {
            const { books, bookCount } = authorInfo;

            const authorRow = document.createElement('tr');
            authorRow.innerHTML = `
                <td>${authorName}</td>
                <td>${bookCount}</td>
                <td>
                    <div class="btn-group" role="group" aria-label="Outline">
                        <button type="button" class="btn btn-outline-primary edit-author-btn">Редагувати</button>
                        <button type="button" class="btn btn-outline-primary del-btn-author">Видалити</button>
                        <button type="button" class="btn btn-outline-primary author-detail-btn">Деталі</button>
                    </div>
                </td>
            `;

            contentTable.appendChild(authorRow);
        }
    }
    loadDataFromLocalStorage();
    
}); 
