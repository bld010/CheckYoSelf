class ToDoList {
  constructor(id, title, urgent){
    this.id = id
    this.title = title
    this.urgent = urgent || false;
    this.tasks = [];
  }

  saveToStorage(){

  }

  deleteFromStorage(){

  }

  updateToDo(){

  }

  updateTask(){

  }
}


class ToDoItem {
  constructor(body){
    this.checked = false;
    this.body = body;
  }
}