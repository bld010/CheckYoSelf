var searchButton = document.querySelector('#header__search-button');
var searchInput = document.querySelector('#header__search-input');
var newTaskListTitleInput = document.querySelector('#aside__new-task-list-title-input');
var newTaskItemInput = document.querySelector('#aside__new-task-input');
var newTaskItemButton = document.querySelector('.aside__new-task-button');
var makeTaskListButton = document.querySelector('#aside__make-task-list-button');
var clearAllButton = document.querySelector('#aside__clear-all-button');
var filterByUrgencyButton = document.querySelector('#aside__filter-by-urgency-button');
var potentialItemList = document.querySelector('#aside__potential-items-list');
var newTaskForm = document.querySelector('.aside__top-section');
var listTitleInput = document.querySelector('#aside__new-task-list-title-input');
var taskListContainer = document.querySelector('.section__task-list-container');
var prompt = document.querySelector('.section__prompt');
var taskListArray = [];

window.addEventListener('load', pageLoadHandler);
newTaskItemButton.addEventListener('click', newTaskItemHandler);
potentialItemList.addEventListener('click', deletePotentialItem);
newTaskForm.addEventListener('keyup',newTaskButtonHandler);
listTitleInput.addEventListener('keyup', makeListandClearButtonHandler);
makeTaskListButton.addEventListener('click', newTaskListHandler);
clearAllButton.addEventListener('click', clearAllButtonHandler);
taskListContainer.addEventListener('click', taskListContainerHandler);
searchInput.addEventListener('keyup', searchHandler);
filterByUrgencyButton.addEventListener('click', filterByUrgencyHandler);
taskListContainer.addEventListener('focusout', editingListsHandler);
taskListContainer.addEventListener('keydown', listenForEnter);

function editingListsHandler(e) {
  updateTaskText(e);
  updateListTitle(e);
}

function updateTaskText(e) {
  if (e.target.classList.contains('card__task-text')) {
    taskListArray[getListIndex(e)].tasks[findEditedTaskIndex(e)].body = e.target.innerText;
    taskListArray[getListIndex(e)].saveToStorage();
  }
}

function listenForEnter(e) {
  if (e.key === 'Enter') {
    e.target.blur();
  }
}

function updateListTitle(e) {
  if (e.target.classList.contains('list-title')) {
    taskListArray[getListIndex(e)].title = e.target.innerText;
    taskListArray[getListIndex(e)].saveToStorage();
  }
}

function styleActiveFilterButton() {
  filterByUrgencyButton.classList.toggle('active');
}

function toggleFilterStatus() {
  filterByUrgencyButton.clicked = !filterByUrgencyButton.clicked;
}

function populateFilterCards() {
  if (filterByUrgencyButton.clicked === true) {
    var filterArray = generateFilterArray();
    populateCards(filterArray);
    showNoUrgentListsPrompt();
  } else {
    populateCards(taskListArray)
  }
}

function showNoUrgentListsPrompt() {
  if (filterByUrgencyButton.clicked === true && generateFilterArray().length === 0) {
    taskListContainer.innerHTML = '<article class="section__prompt"><p>You don\'t have any urgent lists.<p></article>';
  }
}

function filterByUrgencyHandler() {
  taskListContainer.innerHTML = '';
  toggleFilterStatus();
  styleActiveFilterButton();
  populateFilterCards();
}

function generateFilterArray() {
  var filterArray = taskListArray.filter(function(arrayObject) {
    return arrayObject.urgent === true;
  })
  return filterArray;
}

function searchHandler() {
  taskListContainer.innerHTML = '';
  if (filterByUrgencyButton.clicked === true) {
    populateCards(generateSearchArray(generateFilterArray(), searchInput.value));
  } else {
    populateCards(generateSearchArray(taskListArray, searchInput.value));
  }
  if (generateSearchArray(taskListArray, searchInput.value).length === 0 && searchInput.value !== '') {
    taskListContainer.innerHTML = '<article class="section__prompt"><p>No Lists Match Your Search</p></article>';
  } 
}

function generateSearchArray(array, searchWords) {
  var searchArray = array.filter(function(arrayObject) {
    return arrayObject.title.toLowerCase().includes(searchWords.toLowerCase()) === true;
  })
  return searchArray;
}

function taskListContainerHandler(e) {
  checkedTaskHandler(e);
  deleteCardHandler(e);
  markUrgentHandler(e);
  updateTaskText(e);
}

function markUrgentHandler(e) {
  if (e.target.classList.contains('urgent_button')) {
  updateUrgencyOnDOM(e);
  taskListArray[getListIndex(e)].urgent = !taskListArray[getListIndex(e)].urgent;
  taskListArray[getListIndex(e)].updateToDo();
  reinstantiateLists();
  }
}

function updateUrgencyOnDOM(e) {
  e.target.closest('article').classList.toggle('urgent');
}

function deleteButtonEnabler(e) {
  var deleteButton = e.target.closest('article').querySelector('.card__footer-delete-button');
  var tasksArray = taskListArray[getListIndex(e)].tasks;
  var notChecked = tasksArray.find(function(taskItem) {
    return taskItem.checked === false;
  })
  notChecked === undefined ? deleteButton.disabled = false : deleteButton.disabled = true;
}

function deleteCardHandler(e) {
  if (e.target.classList.contains('card__delete') && e.target.closest('article').querySelector('.card__footer-delete-button').disabled !== true) {
    deleteCardFromDOM(e);
    var listIndex = getListIndex(e);
    taskListArray[listIndex].deleteFromStorage(listIndex);
    taskListArray.splice(listIndex, 1); 
    noListsPrompt();
  }
}

function deleteCardFromDOM(e) {
  e.target.closest('article').remove();
}

function checkedTaskHandler(e) {
  if (e.target.classList.contains('card__checkbox')) {
  updateCheckedStyles(e);
  findEditedTaskIndex(e);
  deleteButtonEnabler(e);
  } 
}

function getListIndex(e) {
  var cardId = e.target.closest('article').getAttribute('data-id')
  return listIndex = taskListArray.findIndex(function(taskObj) {
    return taskObj.id == parseInt(cardId);
  })
}

function findEditedTaskIndex(e) {
  var listObjTasks = taskListArray[getListIndex(e)].tasks;
  var taskId = parseInt(e.target.closest('li').getAttribute('data-id'));
  var itemIndex = listObjTasks.findIndex(function(itemObj) { 
    return itemObj.id === taskId;
  })
  taskListArray[listIndex].updateTask(itemIndex);
  return itemIndex;
}

function updateCheckedStyles(e) {
  var target = e.target;
  if (target.classList.contains('card__checkbox')) {
    target.classList.toggle('card__checked');
    target.closest('li').classList.toggle('card__checked');
  }
}

function noListsPrompt() {
  taskListArray.length === 0 ? prompt.classList.remove('hidden') : prompt.classList.add('hidden');
}

function clearAllButtonHandler(e) {
  e.preventDefault();
  clearDraftingArea();
  clearPotentialItemsArray(); 
  makeListButtonEnabler();
}

function pageLoadHandler() {
  localStorage.setItem('newToDoItems', JSON.stringify([]));
  reinstantiateLists();
  disableButton(newTaskItemButton, newTaskItemInput);
  noListsPrompt();
  populateCards(taskListArray);
}

function makeListandClearButtonHandler() {
  makeListButtonEnabler();
  if (newTaskListTitleInput.value !== '') {
    clearAllButton.disabled = false;
  }
}

function makeListButtonEnabler() {
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
  if (associatedInput.value === ''|| null) {
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
  disableButton(newTaskItemButton, newTaskItemInput); 
}

function newTaskListHandler(e) {
  e.preventDefault();
  createNewToDoList();
  clearDraftingArea();
  makeListButtonEnabler();
  clearPotentialItemsArray(); 
  noListsPrompt();
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
  if (JSON.parse(localStorage.getItem('taskListArray')) !== null) {
    var reinstantiatedArray = JSON.parse(localStorage.getItem('taskListArray')).map(function(listObject) {
      return new ToDoList(listObject.id, listObject.title, listObject.tasks, listObject.urgent)
    })
    taskListArray = reinstantiatedArray
  }
}

function createNewToDoList() {
  var toDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
  var newToDoList = new ToDoList(Date.now(), newTaskListTitleInput.value, toDoItemsArray);
  taskListArray.push(newToDoList);
  newToDoList.saveToStorage();
  generateCard(newToDoList);
}

function newToDoItem(input, id) {
  var newPotentialItem = new ToDoItem(input, id);
  var newToDoItemsArray = newPotentialItem.getFromStorage();
  newToDoItemsArray.push(newPotentialItem);
  newPotentialItem.saveToStorage(newToDoItemsArray);
  return newPotentialItem;
}

function apendPotentialItems(input, id) {
  var newPotentialItem = `
    <li class="aside__potential-items-item">
      <img src="images/delete-list-item.svg" data-id='${id}' class="delete-list-item">
      ${input}
    </li>`
  potentialItemList.insertAdjacentHTML('beforeend',newPotentialItem);
}

function deletePotentialItem(e) {
  if (e.target.classList.contains('delete-list-item')) {
    var taskIndex = findTaskIndex(e);
    var taskArray = JSON.parse(localStorage.getItem('newToDoItems'));
    reinstantiateTask(e).deleteFromStorage(taskIndex);
    makeListButtonEnabler();
    e.target.parentNode.remove();
  }
}

function reinstantiateTask(e) {
  var taskInstance = new ToDoItem(e.target.closest('li').innerText, e.target.getAttribute('data-id'));
  return taskInstance;
}

function findTaskIndex(e) {
  var taskId = e.target.getAttribute('data-id');
  var newToDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
  return newToDoItemsArray.findIndex(function(taskObj) {
    return taskObj.id == parseInt(taskId);
  });
}

function createTaskElements(newListObject) {
  var listItems = `<ul>`   
  newListObject.tasks.forEach(function(taskItem) {
    taskItem.checked === true ? checkedStatus = 'card__checked' : checkedStatus = '';
    listItems += `<li data-id="${taskItem.id}">
        <img src="images/checkbox.svg" class="card__checkbox ${checkedStatus}" >
        <p class="card__task-text" contenteditable="true">
          ${taskItem.body}
        </p>
      </li>`
  })
  return listItems;
}

function generateCard(newListObject) {
  var listItems = createTaskElements(newListObject);
  var deleteButton = createDeleteButtonElement(newListObject);
  var urgency = cardUrgency(newListObject);
  var newList = `
    <article data-id="${newListObject.id}" class="${urgency}">
      <h2 class="list-title" contenteditable="true">${newListObject.title}</h2>
      <main>
        ${listItems}
        </ul>
      </main>
      <footer>
        <button id="card__footer-urgent-button" class="urgent_button">
          <img src="images/urgent.svg" class="urgent_button card__footer-urgent-button-image">
          <p class="urgent_button card__urgent_button_text">Urgent</p>
        </button>
        <button class="card__footer-delete-button card__delete" ${deleteButton}>
          <img src="images/delete.svg" class="card__delete">
          <p class="card__delete">Delete</p>
        </button>
      </footer>
    </article>`
  taskListContainer.insertAdjacentHTML('afterbegin', newList);
}

function createDeleteButtonElement(newListObject) {
  var notChecked = newListObject.tasks.find(function(taskItem) {
    return taskItem.checked === false;
  }) 
  if (notChecked === undefined) {
    return '';
  } else {
    return 'disabled';
  }
}

function cardUrgency(newListObject) {
  if (newListObject.urgent) {
    return 'urgent';
  }
}

function populateCards(array) {
  array.forEach(function(taskObj) {
    generateCard(taskObj)
  })
}