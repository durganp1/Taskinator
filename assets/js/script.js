

var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var taskIdCounter = 0;

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    // package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    createTaskEl(taskDataObj);
};

var createTaskEl = function(taskDataObj) {
    // create a list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    
    // create a div to hold all of the data inside the list item
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // add div to list item
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    // create container for task actions
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    // append edit button to action container
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    // append delete button to action container
    actionContainerEl.appendChild(deleteButtonEl);

    // create drop down select element
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // array of status choices
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i=0; i<statusChoices.length; i++) {
        // create option elements
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select options
        statusSelectEl.appendChild(statusOptionEl);
    }

    // append status drop down to action container
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

formEl.addEventListener('submit', taskFormHandler);