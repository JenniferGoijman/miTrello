const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
    event.dataTransfer.setData("columnaViejaId", document.getElementById(taskId).parentElement.parentElement.id);
}
const preventDefault = event => event.preventDefault();
const drop = event => {
    const taskId = parseInt(event.dataTransfer.getData("id"));
    const task = document.getElementById(taskId);
    const columnaViejaId = parseInt(event.dataTransfer.getData("columnaViejaId"));
    let columnNuevaId = 0;
    let yaEsta = false;

    if (event.target.localName == "h5") {
        columnNuevaId = event.target.parentElement.parentElement.id;
        event.target.parentElement.nextElementSibling.appendChild(task);
    } else if (event.target.className == "textAddTask") {
        columnNuevaId = event.target.parentElement.parentElement.id;
        event.target.parentElement.previousElementSibling.appendChild(task);
    } else if (event.target.className == "column") {
        columnNuevaId = event.target.id;
        event.target.firstElementChild.nextElementSibling.appendChild(task);
    } else if (event.target.className == "boxAddTask") {
        columnNuevaId = event.target.parentElement.id;
        event.target.previousElementSibling.appendChild(task);
    } else if (event.target.className == "tasks") {
        if (!event.target.innerHTML.includes(taskId)) {
            columnNuevaId = event.target.parentElement.id;
            event.target.appendChild(task);
        } else {
            yaEsta = true;
        }
    } else if (event.target.className == "task") {
        if (!event.target.parentElement.innerHTML.includes(taskId)) {
            columnNuevaId = event.target.parentElement.parentElement.id;
            event.target.parentElement.appendChild(task);
        } else {
            yaEsta = true;
        }
    }
    if (!yaEsta) {
        columnNuevaId = parseInt(columnNuevaId);
        removeTaskInStorage(taskId, columnaViejaId);
        newTaskInStorage(taskId, task.innerText, columnNuevaId);
    }
}
const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];

// CARGA COLUMNAS Y TAREAS DEL LOCAL STORAGE -- //
columns.forEach(column => {
    let taskInStorage = "";
    if (column.tasks.length > 0) {
        column.tasks.forEach(task => {
            taskInStorage += `
            <div class="task" id="${task.id}" draggable ondragstart ="drag(event,${task.id})" >
                <h6 contenteditable onblur="changeTitleTask(event, ${task.id})" onkeydown="preventEnter(event)" onkeyup="changeTitleTask(event, ${task.id})">${task.title}</h6>
                <i class="far fa-trash-alt" onclick="removeTask(${task.id})"></i>
            </div>`
        })
    }

    document.querySelector('main').innerHTML += ` 
    <div class="column" id="${column.id}" ondragover="preventDefault(event)" ondrop="drop(event)">
        <div class="headColumn">
            <h5 contenteditable onblur="changeTitleColumn(event, ${column.id})" onkeydown="preventEnter(event)" onkeyup="changeTitleColumn(event, ${column.id})">${column.title}</h5>
            <div class="btn-group">
                <button type="button" class="btn btn-sm btn-default" data-toggle="dropdown"><img src="puntitos.png" alt="" class="imgOptions"></button>
                <ul class="dropdown-menu" role="menu">
                <li><a href="#" onclick="removeColumn(${column.id})">Eliminar</a></li>
                <li><a href="#" onclick="getFocusInTitle(${column.id})">Cambiar nombre</a></li>
                </ul>
                </div>
            </div>
            <div class="tasks" ondragover="preventDefault(event)" ondrop="drop(event)">${taskInStorage}</div>
	        <div class="boxAddTask">
                <textarea placeholder="+ Añada una tarea" cols="20" rows="2"
                onkeydown="adjustHeightAddNewTask(event)"
                onkeyup="newTask(event,${column.id})"
                onclick="showAddTasksMenu(event)" class="textAddTask"></textarea>
                <div class="addDelTask">
                    <input type="button" value="Añadir tarea" class="buttonAddTask" onclick="newTask(event,${column.id})">
                    <a href="#"><img src="cancelar.png" alt="" class="imgHideAddTask" onclick="hideAddTasksMenu(event)"></a>
		        </div>
	        </div>
        </div>`
});
// -- CARGA COLUMNAS Y TAREAS DEL LOCAL STORAGE //

const removeTask = (taskId) => {
    const currentColumnId = document.getElementById(taskId).parentElement.parentElement.id;
    removeTaskInStorage(taskId, currentColumnId);
    document.getElementById(taskId).remove();
}
const removeTaskInStorage = (taskId, columnId) => {
    const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
    const currentColumn = columns.find(column => column.id == columnId);
    const tasksFiltered = currentColumn.tasks.filter(task => task.id !== +taskId);
    currentColumn.tasks = tasksFiltered;
    localStorage.setItem('columns', JSON.stringify(columns));
}

const removeColumn = (columnId) => {
    const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
    const columnsFiltered = columns.filter(column => column.id !== columnId)
    localStorage.setItem('columns', JSON.stringify(columnsFiltered));
    document.getElementById(columnId).remove();
}

function showAddColumnMenu() {
    document.querySelector('div.boxAddColumn').style.height = "4em";
    document.querySelector('input#textAddColumn.textAddColumn').placeholder = "Introduzca el título de la columna...";
    document.querySelector('input#textAddColumn.textAddColumn').style.border = "1px solid rgb(59, 180, 228)";
    document.querySelector('input#textAddColumn.textAddColumn').style.backgroundColor = "white";
    document.querySelector('.addDelColumn').style.display = "flex";
}

function hideAddDelColumn() {
    document.querySelector('div.boxAddColumn').style.height = "unset";
    document.querySelector('input#textAddColumn.textAddColumn').placeholder = "+ Añade una columna";
    document.querySelector('input#textAddColumn.textAddColumn').style.border = "";
    document.querySelector('input#textAddColumn.textAddColumn').style.backgroundColor = "";
    document.querySelector('div.addDelColumn').style.display = "none";
}
// DESPLIEGA MENU AGREGAR TAREAS -- //
// function showAddTasksMenu() {
//     Array.from(document.querySelectorAll('.textAddTask')).forEach(textAddTask => {
//         textAddTask.onclick = event => {
//             textAddTask.parentElement.style.height = "unset";
//             textAddTask.placeholder = "Introduzca el nombre de la tarea";
//             textAddTask.style.border = "1px solid rgb(59, 180, 228)";
//             textAddTask.style.backgroundColor = "white";
//             textAddTask.nextElementSibling.style.display = "flex";
//         }
//     })
// }

function showAddTasksMenu(event) {
    if (event.key === "Enter" ||  event.currentTarget.type === "textarea") {
        currentTextAddTask = event.target;       
    } else if (event.currentTarget.type === "textarea") {
        currentTextAddTask = event.target.parentElement.parentElement.firstElementChild;
    }   
    currentTextAddTask.parentElement.style.height = "unset";
    currentTextAddTask.placeholder = "Introduzca el nombre de la tarea";
    currentTextAddTask.style.border = "1px solid rgb(59, 180, 228)";
    currentTextAddTask.style.height = "2em";
    currentTextAddTask.style.backgroundColor = "white";
    currentTextAddTask.nextElementSibling.style.display = "flex";
}


function hideAddTasksMenu(event) {
    Array.from(document.querySelectorAll('img.imgHideAddTask')).forEach(cancelButton => {
        cancelButton.onclick = event => {
            const boxAddTask = event.target.parentElement.parentElement.parentElement;
            boxAddTask.style.height = "2em";
            boxAddTask.firstElementChild.placeholder = "+ Añade una tarea";
            boxAddTask.firstElementChild.style.border = "";
            boxAddTask.firstElementChild.style.backgroundColor = "";
            event.target.parentElement.parentElement.style.display = "none";
        }
    })
}

function newColumn(event) {
    if (event.key === "Enter" || event.type === "click") {
        if (document.querySelector('.textAddColumn').value != '') {
            const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
            const columnId = Date.now();
            const title = document.querySelector('.textAddColumn').value;
            document.querySelector('main').innerHTML += ` 
            <div class="column" id="${columnId}" ondragover="preventDefault(event)" ondrop="drop(event)">
                <div class="headColumn">
                    <h5 contenteditable onblur="changeTitleColumn(event, ${columnId})" onkeydown="preventEnter(event)" onkeyup="changeTitleColumn(event, ${columnId})"">${title}</h5>
                    <div class="btn-group">
                    <button type="button" class="btn btn-sm btn-default" data-toggle="dropdown"><img src="puntitos.png" alt="" class="imgOptions"></button>
                    <ul class="dropdown-menu" role="menu">
                    <li><a href="#" onclick="removeColumn(${columnId})">Eliminar</a></li>
                    <li><a href="#" onclick="getFocusInTitle(${columnId})">Cambiar nombre</a></li>
                    </ul>
                    </div>
                </div>
                <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
                    <div class="boxAddTask">
                        <textarea placeholder="+ Añada una tarea" cols="25" rows="2" 
                        onkeydown="adjustHeightAddNewTask(event)" onkeyup="newTask(event,${columnId})" 
                        onclick="showAddTasksMenu(event)" class="textAddTask"></textarea>
                        <div class="addDelTask">
                            <input type="button" value="Añadir tarea" class="buttonAddTask" onkeyup="newTask(event,${columnId})">
                            <a href="#"><img src="../img/cancelar.png" alt="" class="imgHideAddTask"></a>
                        </div>
                    </div>
                </div>`
            columns.push({
                id: columnId,
                title,
                tasks: []
            })
            localStorage.setItem('columns', JSON.stringify(columns));
            document.querySelector('.textAddColumn').value = '';
        }
    } else {
        // Mensaje error: "Debe ingresar el titulo de la columna"
    }
}

function adjustHeightAddNewTask(event) {
    event.target.style.height = "1px";
    event.target.style.height = (5 + event.target.scrollHeight) + "px";
}

function newTask(event, columnId) {
    let title = '';
    if (event.key === "Enter") {
        title = event.target.value.replace(/\n/ig, '');
        event.target.value = '';
    } else if (event.type === "click") {
        title = event.target.parentElement.previousElementSibling.value.replace(/\n/ig, '');
        event.target.parentElement.previousElementSibling.value = '';
    }
    if (title != '') {
        const taskId = Date.now();
        document.getElementById(columnId).children[1].innerHTML += `
            <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
                <h6 contenteditable onblur="changeTitleTask(event, ${taskId})" onkeydown="preventEnter(event)" onkeyup="changeTitleTask(event, ${taskId})">${title}</h6>
                <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
            </div>`
        newTaskInStorage(taskId, title, columnId);
        showAddTasksMenu(event);
    } else {
        // Mensaje error: "Debe ingresar el titulo de la columna"
    }
}

const newTaskInStorage = (taskId, title, columnId) => {
    const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
    const currentColumn = columns.find(column => {
        return column.id === +columnId
    });
    if (title == "") {
        title = document.getElementById(taskId).firstElementChild.innerText;
    }
    currentColumn.tasks.push({
        id: taskId,
        title
    })
    localStorage.setItem('columns', JSON.stringify(columns));
}
const preventEnter = event => event.key === 'Enter' ? event.preventDefault() : '';

function changeTitleColumn(event, columnId) {
    if (event.key === "Enter" || event.type === "blur") {
        const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
        const currentColumn = columns.find(column => {
            return column.id === +columnId
        });
        currentColumn.title = (event.target.innerText).replace(/\n/ig, '');;
        localStorage.setItem('columns', JSON.stringify(columns));
        event.target.blur();
    }
}

function getFocusInTitle(columnId) {
    document.getElementById(columnId).firstElementChild.firstElementChild.focus();
}

function changeTitleTask(event, taskId) {
    if (event.key === "Enter" || event.type === "blur") {
        const currentColumnId = document.getElementById(taskId).parentElement.parentElement.id;
        const currentColumn = columns.find(column => column.id == currentColumnId);
        const currentTask = currentColumn.tasks.find(task => task.id == taskId);
        currentTask.title = (event.target.innerText).replace(/\n/ig, '');
        localStorage.setItem('columns', JSON.stringify(columns));
        event.target.blur();
    }
}