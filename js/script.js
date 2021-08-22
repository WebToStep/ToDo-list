/* eslint-disable arrow-parens */
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
        li.classList.add('todo-item');
        li.key = todo.key;

        li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${todo.value}</span>
        <div class="todo-buttons">
        <!-- <button class="todo-edit"></button> -->
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
        this.todoData.forEach((e, i) => {
            if (itemKey === i) {
                this.todoData.delete(itemKey);
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

    // redactItem(e) {
    //     setInterval(() => console.log('222'), 800);
    //     document.removeEventListener('click', this.redactItem);
    //     e.path.forEach((e) => {
    //         const redactToDo = (e) => {
    //             if (e.target.className === 'todo-edit') {
    //                 console.log('ky');
    //             }
    //         };

    //         if (e.className === 'todo-item') {
    //             e.setAttribute('contenteditable', true);
    //             const value = e.querySelector('span');
    //             e.style.background = '#82c0f2';
    //             e.style.border = '#4682B4 solid 1px';

    //             // value.textContent
    //             // console.log('value.textContent: ', value.textContent);

    //             document.addEventListener('click', e => redactToDo(e));
    //         }
    //     });


    // }

    handler() {
        document.addEventListener('click', e => {
            if (e.target.className === 'todo-complete') {
                this.completedItem(e);
            }
            if (e.target.className === 'todo-remove') {
                this.deleteItem(e);
            }
            // if (e.target.className === 'todo-edit') {
            //     this.redactItem(e);
            // }
        });

        // делегирование обработчик событий
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
