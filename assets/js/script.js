

var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    createTaskEl(taskDataObj);
}

var createTaskEl = function(taskDataObj) {
    // create a list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';
    
    // create a div to hold all of the data inside the list item
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // add div to list item
    listItemEl.appendChild(taskInfoEl);
    // add list item to list
    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener('submit', taskFormHandler);