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
var listTitleInput = document.querySelector('#aside__new-task-list-title-input');
var taskListArray = []

pageLoadHandler();
localStorage.setItem('newToDoItems', JSON.stringify([]));
newTaskItemButton.addEventListener('click', newTaskItemHandler);
potentialItemList.addEventListener('click', deletePotentialItem);
newTaskForm.addEventListener('keyup', function(){
  newTaskButtonHandler(newTaskItemButton, newTaskItemInput)
})
listTitleInput.addEventListener('keyup', makeListButtonHandler)


function pageLoadHandler() {
 disableButton(newTaskItemButton, newTaskItemInput);
}

function makeListButtonHandler(){
   var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
   console.log(toDoItemsArray.length)
   if (toDoItemsArray.length > 0 && newTaskListTitleInput.value !== '') {
    makeTaskListButton.disabled = false;
   }
   if (toDoItemsArray.length === 0 || newTaskListTitleInput.value === '') {
    makeTaskListButton.disabled = true;
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
  var newTask = newToDoItem(newTaskItemInput.value, Date.now());
  apendPotentialItems(newTask.body, newTask.id);
  newTaskItemInput.value = '';
  makeListButtonHandler();
}

function newTaskListHandler(){
  createNewToDoList();
  clearPotentialItemsArray(); 
  clearDraftingArea();
  makeListButtonHandler();
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

function newToDoItem(input, id){
  var newPotentialItem = new ToDoItem(input, id);
  var newToDoItemsArray = newPotentialItem.getFromStorage();
  newToDoItemsArray.push(newPotentialItem);
  newPotentialItem.saveToStorage(newToDoItemsArray);
  return newPotentialItem
}

function apendPotentialItems(input, id){
  var newPotentialItem = `
  <li class="aside__potential-items-item">
    <img src="images/delete-list-item.svg" data-id='${id}' class="delete-list-item">
    ${input}
  </li>`
  potentialItemList.insertAdjacentHTML('beforeend',newPotentialItem)
}

function deletePotentialItem(e) {
  console.log(e.target.closest('li').innerText)
  if (e.target.classList.contains('delete-list-item')) {
    var taskIndex = findTaskIndex(e)
    var taskArray = JSON.parse(localStorage.getItem('newToDoItems'))
    reinstantiateTask(e).deleteFromStorage(taskIndex)
    makeListButtonHandler()
    e.target.parentNode.remove();
  }
}

function reinstantiateTask(e) {
  var taskInstance = new ToDoItem(e.target.closest('li').innerText, e.target.getAttribute('data-id'));
  return taskInstance
}

function findTaskIndex(e) {
  var taskId = e.target.getAttribute('data-id');
  var newToDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
  console.log(newToDoItemsArray)
  return newToDoItemsArray.findIndex(function(taskObj){
    return taskObj.id == parseInt(taskId);
  });
}


