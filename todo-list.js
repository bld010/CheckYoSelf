class ToDoList {
  constructor(id, title, tasksArray){
    this.id = id
    this.title = title
    this.urgent = false;
    this.tasks = tasksArray || [];
  }

  saveToStorage(){
    localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
  }

  deleteFromStorage(){

  }

  updateToDo(){

  }

  updateTask(){

  }
}


class ToDoItem {
  constructor(body, id){
    this.id = id;
    this.checked = false;
    this.body = body;
  }

  getFromStorage(){
    var newToDoItemsArray = JSON.parse(localStorage.getItem('newToDoItems'));
    return newToDoItemsArray
  }

  saveToStorage(updatedItemsArray){
    localStorage.setItem('newToDoItems', JSON.stringify(updatedItemsArray));
  }

  deleteFromStorage(index){
    var toDoArray = JSON.parse(localStorage.getItem('newToDoItems'));
    toDoArray.splice(index, 1)
    this.saveToStorage(toDoArray);
  }
}
