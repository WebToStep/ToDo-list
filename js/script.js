'use strict';
class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }
    // отправка данных в Storage
    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }
    // перерисовка
    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.input.value = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
            <button class="todo-edit"></button>
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
        </div>
        `);

        if (todo.complited) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }
    // добавить todo
    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                complited: false,
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else (
            alert('Введите задачу, затем нажмите добавить!')
        );
    }
    // создание ключа события
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    // поиск ключа элемента
    findKey(e) {
        let key;
        e.path.forEach(e => { if (e.className === 'todo-item') key = e.key; });
        return key;
    }
    // удалить todo
    deleteItem(e) {
        const parentLi = e.target.parentNode.parentNode;
        let opacity = 1;
        const interval = setInterval(() => {
            parentLi.style.cssText = `
            background: red;
            opacity: ${opacity};
            overflow: hidden;`;
            opacity -= 0.01;
            if (opacity < 0) {
                clearInterval(interval);
                parentLi.style.display = 'none';
            }
        }, 1);

        const itemKey = this.findKey(e);
        this.todoData.forEach((item, index) => {
            if (itemKey === index) {
                this.todoData.delete(itemKey);
            }
        });
        this.addToStorage();
    }
    // выполненное todo
    completedItem(e) {
        const parentLi = e.target.parentNode.parentNode;
        const reverceTodo = appendParent => {
            const screenWidth = window.screen.width;
            let position1 = 10;
            let position2 = screenWidth;
            const interval = setInterval(() => {
                if (position1 < screenWidth) {
                    parentLi.style.cssText = `
                background: lightblue;
                position: relative;
                left: ${position1}px;
                overflow: hidden;`;
                    position1 += 15;
                } else if (position1 > screenWidth) {
                    appendParent.append(parentLi);
                    parentLi.style.cssText = `
                background: lightblue;
                position: relative;
                left: ${position2}px;
                overflow: hidden;`;
                    position2 -= 15;
                    if (position2 <= -5) {
                        parentLi.style.cssText = `
                    background: white;
                    position: relative  ;`;
                        clearInterval(interval);
                    }
                }
            }, 1);
        };

        if (parentLi.parentNode.matches('.todo-list')) {
            reverceTodo(this.todoCompleted);
        } else {
            reverceTodo(this.todoList);
        }


        const itemKey = this.findKey(e);
        this.todoData.forEach((event, i) => {
            if (itemKey === i) {
                event.complited = !event.complited;
            }
        });
        this.addToStorage();
    }
    // редактирование полей
    redactItem(e) {
        const parent = e.target.parentNode.parentNode;
        const key = parent.key;
        const value = parent.textContent;

        const sendChangedToDo = () => {
            parent.setAttribute('contenteditable', false);
            parent.style.background = '';
            parent.style.border = '';
            this.todoData.forEach(item => {
                if (item.key === key) {
                    item.value = value;
                }
            });
            this.addToStorage();
        };
        if (!parent.style.background) {
            parent.setAttribute('contenteditable', true);
            parent.style.background = 'steelblue';
            parent.style.border = 'black solid 2px';
        } else {
            sendChangedToDo();
        }
        parent.addEventListener('keypress', e => {
            const key = e.which || e.keyCode;
            if (key === 13) {
                e.preventDefault();
                sendChangedToDo();
            }
        });
    }
    // делегирование обработчик событий
    handler() {
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', e => {
            if (e.target.className === 'todo-complete') {
                this.completedItem(e);
            }
            if (e.target.className === 'todo-remove') {
                this.deleteItem(e);
            }
            if (e.target.className === 'todo-edit') {
                this.redactItem(e);
            }
        });

    }
    // вывод дел при загрузке страницы
    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
