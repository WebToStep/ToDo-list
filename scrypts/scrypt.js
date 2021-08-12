'use strict';

const todoControl = document.querySelector('.todo-control'),
   headerInput = document.querySelector('.header-input'),
   todoList = document.querySelector('.todo-list'),
   todoCompleted = document.querySelector('.todo-completed');

let todoData = JSON.parse(localStorage.todoDataTest);


const render = function () {
   todoList.textContent = '';
   todoCompleted.textContent = '';
   headerInput.value = '';
   localStorage.todoDataTest = JSON.stringify(todoData);

   todoData.forEach((i, key) => {
      const li = document.createElement('li');
      li.classList.add('todo-item');

      li.innerHTML = '<span class="text-todo">' + i.value + '</span>' +
         '<div class="todo-buttons">' +
         '<button class="todo-remove"></button>' +
         '<button class="todo-complete"></button>' +
         ' </div>';
      if (i.complated) {
         todoCompleted.prepend(li);
      } else {
         todoList.prepend(li);
      }
      const btnTodoComplete = li.querySelector('.todo-complete');
      const todoRemove = li.querySelector('.todo-remove');

      btnTodoComplete.addEventListener('click', () => {
         i.complated = !i.complated;
         render();
      });

      todoRemove.addEventListener('click', () => {
         todoData.splice(key, 1);
         render();
      });
   });
};

todoControl.addEventListener('submit', (e) => {
   e.preventDefault();

   const newTodo = {
      value: headerInput.value,
      complated: false
   };

   if (headerInput.value !== '') {
      todoData.push(newTodo);
      render();
   } else {
      console.error('Добавьте значение');
   }

});
render();