class ToDoList {
  constructor(id, title, tasksArray, urgency){
    this.id = id
    this.title = title
    this.urgent = urgency || false;
    this.tasks = tasksArray || [];
  }

  saveToStorage(){
    localStorage.setItem('taskListArray', JSON.stringify(taskListArray));
  }

  deleteFromStorage(index){
    var arrayList = JSON.parse(localStorage.getItem('taskListArray'));
    arrayList.splice(index, 1);
    localStorage.setItem('taskListArray', JSON.stringify(arrayList))
  }

  updateToDo(){
    this.saveToStorage();
  }

  updateTask(taskIndex){
    this.tasks[taskIndex].checked = !this.tasks[taskIndex].checked;
    this.saveToStorage();
  }
}