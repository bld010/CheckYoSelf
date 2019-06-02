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

  deleteFromStorage(index){
    var arrayList = JSON.parse(localStorage.getItem('taskListArray'));
    console.log(index);
    arrayList.splice(index, 1);
    localStorage.setItem('taskListArray', JSON.stringify(arrayList))

  }

  updateToDo(){

  }

  updateTask(taskIndex){
    this.tasks[taskIndex].checked = !this.tasks[taskIndex].checked;
    this.saveToStorage();
    console.log('classupdater')
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
