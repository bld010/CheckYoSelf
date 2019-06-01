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
var taskListContainer = document.querySelector('.section__task-list-container')
var taskListArray = []

localStorage.setItem('newToDoItems', JSON.stringify([]));

newTaskItemButton.addEventListener('click', newTaskItemHandler);
potentialItemList.addEventListener('click', deletePotentialItem);
newTaskForm.addEventListener('keyup', function(){
  newTaskButtonHandler(newTaskItemButton, newTaskItemInput)
})
listTitleInput.addEventListener('keyup', makeListandClearButtonHandler)
makeTaskListButton.addEventListener('click', newTaskListHandler)
clearAllButton.addEventListener('click', clearAllButtonHandler);
reinstantiateLists()
pageLoadHandler();
populateCards(taskListArray);

function noListsPrompt(){
  if (taskListArray.length === 0){
    var prompt = `<h2 class="prompt">Make a new ToDo List to see it here.</h2>`
    taskListContainer.insertAdjacentHTML('afterbegin', prompt)
  } else {
    taskListContainer.innerHTML = ''
  }
}

function clearAllButtonHandler(e) {
  e.preventDefault();
  clearDraftingArea();
  clearPotentialItemsArray(); 
  makeListButtonEnabler();
}

function pageLoadHandler() {
 disableButton(newTaskItemButton, newTaskItemInput);
 noListsPrompt();
}

function makeListandClearButtonHandler(){
  makeListButtonEnabler()
  if (newTaskListTitleInput.value !== ''){
    clearAllButton.disabled = false;
  }
}

function makeListButtonEnabler(){
   var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
   if (toDoItemsArray.length > 0 && newTaskListTitleInput.value !== '') {
    makeTaskListButton.disabled = false;
    clearAllButton.disabled = false;

   }
   if (toDoItemsArray.length === 0 || newTaskListTitleInput.value === '') {
    makeTaskListButton.disabled = true;
    clearAllButton.disabled = true;
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
  makeListButtonEnabler();
}

function newTaskListHandler(e){
  e.preventDefault();
  createNewToDoList();
  clearDraftingArea();
  makeListButtonEnabler();
  clearPotentialItemsArray(); 
}

function clearPotentialItemsArray() {
  localStorage.setItem('newToDoItems', JSON.stringify([]));
}

function clearDraftingArea() {
  potentialItemList.innerHTML = '';
  newTaskListTitleInput.value = '';
  newTaskItemInput.value = '';
}

function reinstantiateLists() {
  if (JSON.parse(localStorage.getItem('taskListArray')) !== null){
    var reinstantiatedArray = JSON.parse(localStorage.getItem('taskListArray')).map(function(listObject){
      return new ToDoList(listObject.id, listObject.title, listObject.tasks)
    })
    taskListArray = reinstantiatedArray
  }
}

function createNewToDoList() {
  var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
  var newToDoList = new ToDoList(Date.now(), newTaskListTitleInput.value, toDoItemsArray);
  taskListArray.push(newToDoList)
  console.log(taskListArray)
  newToDoList.saveToStorage()
  generateCard(newToDoList);
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
    makeListButtonEnabler()
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

function createTaskElements(newListObject) {
  var listItems = `<ul>`   
  for (var i = 0; i < newListObject.tasks.length; i++){
    listItems += `<li>
      <img src="images/checkbox.svg">
      ${newListObject.tasks[i].body}
    </li>`
  }
  console.log(listItems)
  return listItems
}

function generateCard(newListObject) {
  var listItems = createTaskElements(newListObject);
  var newList = `
    <article data-id='${newListObject.id}'>
      <h2>${newListObject.title}</h2>
      <main>
        ${listItems}
        </ul>
      </main>
      <footer>
        <div id="card__footer-urgent-button">
          <img src="images/urgent.svg">
          <p>Urgent</p>
        </div>
        <div class="card__footer-delete-button">
          <img src="images/delete.svg">
          <p>Delete</p>
        </div>
      </footer>
    </article>
  `
  taskListContainer.insertAdjacentHTML('afterbegin', newList)
}

function populateCards(array) {
  for (var i = 0; i < array.length; i++) {
    generateCard(array[i]);
  }
}
