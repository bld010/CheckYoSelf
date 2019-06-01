var searchButton = document.querySelector('#header__search-button');
var searchInput = document.querySelector('#header__search-input');
var newTaskListTitleInput = document.querySelector('#aside__new-task-list-title-input')
var newTaskItemInput = document.querySelector('#aside__new-task-input')
var newTaskItemButton = document.querySelector('.aside__new-task-button');
var makeTaskListButton = document.querySelector('#aside__make-task-list-button');
var clearAllButton = document.querySelector('#aside__clear-all-button');
var filterByUrgencyButton = document.querySelector('#aside__filter-by-urgency-button');
var potentialItemList = document.querySelector('#aside__potential-items-list');
var newTaskForm = document.querySelector('.aside__top-section');
var newTaskListForm = document.querySelector('#aside__new-task-list-title-input');
var taskListArray = []

pageLoadHandler();
localStorage.setItem('newToDoItems', JSON.stringify([]));
newTaskItemButton.addEventListener('click', newTaskItemHandler);
potentialItemList.addEventListener('click', deletePotentialItem);
newTaskForm.addEventListener('keyup', function(){
  newTaskButtonHandler(newTaskItemButton, newTaskItemInput)
})
newTaskListForm.addEventListener('keyup', newTaskListButtonHandler)


function pageLoadHandler() {
 disableButton(newTaskItemButton, newTaskItemInput);
}

function newTaskListButtonHandler(){
   var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
   console.log(toDoItemsArray)
   if (toDoItemsArray.length > 0) {
    enableButton(makeTaskListButton, newTaskListTitleInput)
   } else {
    disableButton(makeTaskListButton, newTaskListTitleInput);
    }
}


function newTaskButtonHandler() {
  disableButton(newTaskItemButton, newTaskItemInput);
  enableButton(newTaskItemButton, newTaskItemInput);
}

function disableButton(buttonElement, associatedInput) {
  if (associatedInput.value === '') {
    buttonElement.disabled = true;
  }
}

function enableButton(buttonElement, associatedInput) {
  if (associatedInput.value !== '') {
    buttonElement.disabled = false;
  }
}

function newTaskItemHandler(e) {
  e.preventDefault();
  newToDoItem(newTaskItemInput.value)
  apendPotentialItems(newTaskItemInput.value);
  newTaskItemInput.value = '';
}

function newTaskListHandler(){
  createNewToDoList();
  clearPotentialItemsArray(); 
  clearDraftingArea();
}

function clearPotentialItemsArray() {
  localStorage.setItem('newToDoItems', JSON.stringify([]));
}

function clearDraftingArea() {
  potentialItemList.innerHTML = '';
  newTaskListTitleInput.value = '';
  newTaskItemInput.value = '';
}

reinstantiateLists()

function reinstantiateLists() {
  var reinstantiatedArray = JSON.parse(localStorage.getItem('taskListArray')).map(function(listObject){
    return new ToDoList(listObject.id, listObject.title, listObject.tasks)
  })
  taskListArray = reinstantiatedArray
}

function createNewToDoList() {
  var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
  var newToDoList = new ToDoList(Date.now(), newTaskListTitleInput.value, toDoItemsArray);
  taskListArray.push(newToDoList)
  console.log(taskListArray)
  newToDoList.saveToStorage()
}

function newToDoItem(input){
  var newPotentialItem = new ToDoItem(input);
  var newToDoItemsArray = newPotentialItem.getFromStorage();
  newToDoItemsArray.push(newPotentialItem);
  newPotentialItem.saveToStorage(newToDoItemsArray);
}

function apendPotentialItems(input){
  var newPotentialItem = `
  <li class="aside__potential-items-item">
    <img src="images/delete-list-item.svg" class="delete-list-item">
    ${input}
  </li>`
  potentialItemList.insertAdjacentHTML('beforeend',newPotentialItem)
}

function deletePotentialItem(e) {
  console.log(e.target.classList)
  if (e.target.classList.contains("delete-list-item")) {
    var listItemToDelete = e.target;
    listItemToDelete.parentNode.remove();
  }
}

