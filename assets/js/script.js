

var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector('#tasks-to-do');
var taskIdCounter = 0;
var pageContentEl = document.querySelector('#page-content');
var tasksInProgressEl = document.querySelector('#tasks-in-progress');
var tasksCompletedEl = document.querySelector('#tasks-completed');
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute('data-task-id');

    // if data attribute, get task id and call function to complete edit
    if (isEdit) {
        var taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // if no data attribute, go to createTaskEl function
    else {
        // package up data as an object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do'
        };

        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    
    // create a list item
    var listItemEl = document.createElement('li');
    listItemEl.className = 'task-item';

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // make element draggable
    listItemEl.setAttribute('draggable', 'true');
    
    // create a div to hold all of the data inside the list item
    var taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    // add div to list item
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add taskId to taskDataObj
    taskDataObj.id = taskIdCounter;

    // add taskDataObj to tasks array and save to local storage
    tasks.push(taskDataObj);
    saveTasks();

    // add list item to list
    if (taskDataObj.status === 'to do') {
        tasksToDoEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === 'in progress') {
        tasksInProgressEl.appendChild(listItemEl);
    }
    else if (taskDataObj.status === 'completed') {
        tasksCompletedEl.appendChild(listItemEl);
    }
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

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

    // edit button click
    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }
    // delete button click
    else if (targetEl.matches('.delete-btn')) {
        var taskId = targetEl.getAttribute('data-task-id');
        deleteTask(taskId);
    }
};

var editTask = function(taskId) {

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector('h3.task-name').textContent;
    var taskType = taskSelected.querySelector('span.task-type').textContent;
    // using initial form to edit task
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    // keep the same id for the task being edited
    formEl.setAttribute('data-task-id', taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector('h3.task-name').textContent = taskName;
    taskSelected.querySelector('span.task-type').textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i=0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    // save new tasks array to local storage
    saveTasks();

    alert("Task Updated!");

    // reset the form
    formEl.removeAttribute('data-task-id');
    document.querySelector('#save-task').textContent = "Add Task";
};

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create a new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i=0; i<tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, keep that task and push to new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    };

    // reassign tasks aray to be the same at updatedTaskArr
    tasks = updatedTaskArr;

    // save updated array to local storage
    saveTasks();
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute('data-task-id');

    // get the current selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i=0; i<tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    };

    // save updated tasks array to local storage
    saveTasks();
};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute('data-task-id');
    event.dataTransfer.setData('text/plain', taskId);
    var getId = event.dataTransfer.getData('text/plain');
    
};

var dropZoneDragHandler = function(event) {
    var taskListEl = event.target.closest('.task-list');
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData('text/plain');
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneEl = event.target.closest('.task-list');
    var statusType = dropZoneEl.id;
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === 'tasks-to-do') {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === 'tasks-completed') {
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute('style');
    dropZoneEl.appendChild(draggableElement);

    // loop throught tasks array to find and update the updated task's status
    for (var i=0; i<tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    };

    // save updated array to local storage
    saveTasks();
};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest('.task-list');
    if (taskListEl) {
        taskListEl.removeAttribute('style');
    }
};

var saveTasks = function() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

var loadTasks = function() {
    var savedTasks = localStorage.getItem('tasks');

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);

    for (var i=0; i<savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
    };
};

formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
pageContentEl.addEventListener('dragstart', dragTaskHandler);
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
pageContentEl.addEventListener('drop', dropTaskHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);

loadTasks();
