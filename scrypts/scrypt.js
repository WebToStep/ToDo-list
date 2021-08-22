'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.input.value = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(todo) {
        const li = document.createElement('li');
        const removeBtn = document.createElement('button');
        const completeBtn = document.createElement('button');

        li.classList.add('todo-item');
        removeBtn.classList.add('todo-remove');
        completeBtn.classList.add('todo-complete');

        li.key = todo.key;
        removeBtn.key = todo.key;
        completeBtn.key = todo.key;

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
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

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                complited: false,
                key: this.generateKey(),
                configurable: true, // запретить удаление "delete user.name"
                writable: true,
                enumerable: true,
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else (
            alert('Введите задачу, затем нажмите добавить!')
        );
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    findKey(e) {
        let key;
        e.path.forEach(e => { if (e.className === 'todo-item')key = e.key; });
        return key;
    }

    deleteItem(e) {
        const itemKey = this.findKey(e);
        this.todoData.forEach((e, i, arr) => {
            if (itemKey === i) {

              e = null;
                // console.log('arr: ', arr);
                // console.log('arr: ', i);
                // console.log('e: ', e);
                // console.log('this.todoData: ', this.todoData);
            }
        });
        this.render();
    }

    completedItem(e) {
        const itemKey = this.findKey(e);
        this.todoData.forEach((event, i) => {
            if (itemKey === i) {
                event.complited = !event.complited;
            }
        });
        this.render();
    }

    // redactItem(){}

    handler() {
        document.addEventListener('click', e => {
            if (e.target.className === 'todo-complete') {
                this.completedItem(e);
            }
            if (e.target.className === 'todo-remove') {
                this.deleteItem(e);
            }
        });

        // делегирование обработчик событий
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-complete');

todo.init();
