var searchButton = document.querySelector('#header__search-button');
var searchInput = document.querySelector('#header__search-input');
var newTaskListTitle = document.querySelector('#aside__new-task-list-title-input')
var newTaskItemInput = document.querySelector('#aside__new-task-input')
var newTaskItemButton = document.querySelector('.aside__new-task-button');
var makeTaskListButton = document.querySelector('#aside__make-task-list-button');
var clearAllButton = document.querySelector('#aside__clear-all-button');
var filterByUrgencyButton = document.querySelector('#aside__filter-by-urgency-button');
var potentialItemList = document.querySelector('#aside__potential-items-list');
var taskListArray = []


newTaskItemButton.addEventListener('click', newTaskItemHandler)

function newTaskItemHandler() {
  newToDoItem(newTaskItemInput.value)
  apendPotentialItems(newTaskItemInput.value);
}

function newToDoItem(input){
  var newPotentialItem = new ToDoItem(input)
  console.log(newPotentialItem);
}

function apendPotentialItems(input){
  var newPotentialItem = `
  <li class="aside__potential-items-item">
    <img src="images/delete-list-item.svg">
    ${input}
  </li>`
  potentialItemList.insertAdjacentHTML('beforeend',newPotentialItem)
}

