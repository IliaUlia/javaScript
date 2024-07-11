
(function () {
    let listArray = [],
        listName = '';

    // создаем и возвращаем заголовок
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }
    // создаем и возвращаем форму для создания дела

    function createTodoItemForm() {
        let form = document.createElement('form'); // создаем элемент формы
        let input = document.createElement('input');// поле для ввода
        let buttonWrapper = document.createElement('div');// передаем в div елемент, для стилизации
        let button = document.createElement('button'); // создаем кнопку
        // расставляем элементы для формы
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';

        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело'; // добавляем кнопке текст

        button.disabled = true;// делаем кнопку неактивной
        // объединяем элементы в DOM структуру
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
        // создаем кнопке формы неактивное состояние, когда поле ввода пустое
        input.addEventListener('input', function () {
            if (input.value !== '') {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        })

        return {
            form,
            input,
            button, // нажимаем на кнопку и забираем значение из input
        }
    }
    // создаем и возвращаем список элементов 
    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // создание дела и возврат элемента для создания дела
    function createTodoItem(obj) {
        let item = document.createElement('li'); // создали элемент
        // кнопки помещаем в элемент, который красиво их покажет в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        // устанавливаем стили для элемента списка, а также для размещения кнопок
        // в его правой части с помощью flex 
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;// textContent- чтобы спецсимволы не превращали элемент в теги

        buttonGroup.classList.add('btn-group', 'btn-group-sm');

        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done == true) item.classList.add('list-group-item-success');

        doneButton.addEventListener('click', function () {
            item.classList.toggle('list-group-item-success');
            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done;
            }
            saveList(listArray, listName);
        });

        deleteButton.addEventListener('click', function () {
            if (confirm('Вы уверены?')) {
                item.remove(); // удаляем элемент с помощью remove
                for (let i = 0; i < listArray.length; i++) {
                    if (listArray[i].id == obj.id) listArray.splice(i, 1);
                }
                saveList(listArray, listName);
            }
        })

        // вкладываем кнопки в отдельный элемент, чтобы объединить в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);// вкладываем группу кнопок в li

        // приложению нужен доступ к самому элементу и кнопкам, чтобы обработать событие клик
        return {
            item,
            doneButton,
            deleteButton,
        }
    };

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id;
        }
        return max + 1;
    };

    // отдельная функция для сохранения дел каждого члена семьи
    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    };

    function createTodoApp(container, title = 'Список дел', keyName, defArray = []) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;
        listArray = defArray;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName);

        if (localData !== null && localData !== '') listArray = JSON.parse(localData);

        for (const itemList of listArray) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item)
        }


        // браузер создает событие submit на форме по нажатию на enter или кнопку создания дела
        todoItemForm.form.addEventListener('submit', function (e) {
            // эта строчка необходима, чтобы предотвратить стандартное действие браузера
            // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы

            e.preventDefault();// усли убрать, то приведет к перезагрузке страницы

            // Игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!todoItemForm.input.value) {// проверяем значение внутри input
                return;
            };

            // создаем и добавляем в список новое дело с названием из поля ввода
            let newItem = {
                id: getNewID(listArray),
                name: todoItemForm.input.value,
                done: false,
            };

            /*  создаем и добавляем в список новое дело с названием и поле для ввода
                      todoList.append(createTodoItem(todoItemForm.input.value).item);*/
            // добавляем в переменную todoItem результат выполнения createTodoItem()
            let todoItem = createTodoItem(newItem);

            // добавляем обработчик на кнопки
            listArray.push(newItem);

            saveList(listArray, listName);

            todoList.append(todoItem.item); // item хранит сам элемент
            // кнопка формы неактивна при пустом input
            todoItemForm.button.disabled = true;

            // обнуляем значение в поле, чтобы не пришлось стирать его вручную
            todoItemForm.input.value = '';
        })
    }
    window.createTodoApp = createTodoApp;
})();