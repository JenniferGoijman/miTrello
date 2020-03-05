const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
}

// CARGA COLUMNAS Y TAREAS DEL LOCAL STORAGE -- //
const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
columns.forEach(column => {
    document.querySelector('main').innerHTML += ` 
    <div class="column" id="${column.id}">
    <div class="headColumn">
        <h5>${column.title}</h5>
        <i class="far fa-trash-alt" onclick="removeColumn(${column.id})"></i>
    </div>
        <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
	        <div class="boxAddTask">
		        <textarea placeholder="+ Añada una tarea" cols="25" rows="2" onkeyup="newTask(event,${column.id})" class="textAddTask"></textarea>
                <div class="addDelTask">
                    <input type="button" value="Añadir tarea" class="buttonAddTask">
                    <a href="#"><img src="/img/cancelar.png" alt="" class="imgHideAddTask"></a>
		        </div>
	        </div>
        </div>`

    column.tasks.forEach(task => {
        // que busque las tareas guardadas en el localstorage de la columna y mostrarlas.
    })
});

// -- CARGA COLUMNAS Y TAREAS DEL LOCAL STORAGE //

const removeTask = (taskId) => {
    document.getElementById(taskId).remove();
    // agregar que tambien se borren del local storage
}

const removeColumn = (columnId) => {
    document.getElementById(columnId).remove();
    const columns = localStorage.getItem('columns') ?
        JSON.parse(localStorage.getItem('columns')) : [];
    const columnsFiltered = columns.filter(column => column.id !== columnId)
    localStorage.setItem('columns', JSON.stringify(columnsFiltered));
}

// const removeTask = (event) =>{
//     event.target.parentElement
// }

const preventDefault = event => event.preventDefault();
const drop = event => {
    const taskId = event.dataTransfer.getData("id");
    const task = document.getElementById(taskId)
    event.target.appendChild(task)
}

function ocultarAddDelColumn() {
    document.querySelector('div.boxAddColumn').style.height = "2em";
    document.querySelector('input#textAddColumn.textAddColumn').placeholder = "+ Añade una columna";
    document.querySelector('input#textAddColumn.textAddColumn').style.border = "";
    document.querySelector('input#textAddColumn.textAddColumn').style.backgroundColor = "";
    document.querySelector('div.addDelColumn').style.display = "none";
}
document.querySelector('img.imgHideAddColumn').onclick = event => {
    ocultarAddDelColumn();
}

function ocultarAddDelTask(imgCancel) {
    const boxAddTask = imgCancel.parentElement.parentElement.parentElement
    boxAddTask.style.height = "2em";
    boxAddTask.firstElementChild.placeholder = "+ Añade una tarea";
    boxAddTask.firstElementChild.style.border = "";
    boxAddTask.firstElementChild.style.backgroundColor = "";
    imgCancel.parentElement.parentElement.style.display = "none";
}
Array.from(document.querySelectorAll('img.imgHideAddTask')).forEach(cancelButton => {
    cancelButton.onclick = event => {
        ocultarAddDelTask(event.target);
    }
})



document.querySelector('.textAddColumn').onclick = event => {
    document.querySelector('div.boxAddColumn').style.height = "4em";
    document.querySelector('input#textAddColumn.textAddColumn').placeholder = "Introduzca el título de la columna...";
    document.querySelector('input#textAddColumn.textAddColumn').style.border = "1px solid rgb(59, 180, 228)";
    document.querySelector('input#textAddColumn.textAddColumn').style.backgroundColor = "white";
    document.querySelector('.addDelColumn').style.display = "flex";
}

function newColumn() {
    if (document.querySelector('.textAddColumn').value != '') {
        const columnId = Date.now();
        const title = document.querySelector('.textAddColumn').value;
        document.querySelector('main').innerHTML += ` 
        <div class="column" id="${columnId}">
            <div class="headColumn">
                <h5>${title}</h5>
                <i class="far fa-trash-alt" onclick="removeColumn(${columnId})"></i>
            </div>
            <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
                <div class="boxAddTask">
                    <textarea placeholder="+ Añada una tarea" cols="25" rows="2" onkeyup="newTask(event,${columnId})" class="textAddTask"></textarea>
                    <div class="addDelTask">
                        <input type="button" value="Añadir tarea" class="buttonAddTask">
                        <a href="#"><img src="/img/cancelar.png" alt="" class="imgHideAddTask"></a>
		            </div>
	            </div>
            </div>`
        document.getElementById(columnId).childNodes
        document.getElementById(columnId).childNodes[5].firstChild.nextSibling.focus()
        const columns = localStorage.getItem('columns') ?
            JSON.parse(localStorage.getItem('columns')) : [];
        columns.push({
            id: columnId,
            title,
            tasks: []
        })
        localStorage.setItem('columns', JSON.stringify(columns));
        document.querySelector('.textAddColumn').value = '';
        ocultarAddDelColumn();

    } else {
        // Mensaje error: "Debe ingresar el titulo de la columna"
    }
}
document.querySelector('.textAddColumn').onkeyup = event => {
    if (event.key === "Enter") {
        newColumn();
    }
}
document.querySelector('.buttonAddColumn').onclick = event => {
    newColumn();
}

Array.from(document.querySelectorAll('.textAddTask')).forEach(textAddTask => {
    textAddTask.onclick = event => {
        textAddTask.parentElement.style.height = "4em";
        textAddTask.placeholder = "Introduzca el nombre de la tarea";
        textAddTask.style.border = "1px solid rgb(59, 180, 228)";
        textAddTask.style.backgroundColor = "white";
        textAddTask.nextElementSibling.style.display = "flex";
    }
})


//CAMBIAR TODO LO DE ABAJO PARA AGREGAR TAREAS
function newTask(event, columnId) {
    const title = event.target.value;
    if (title != '' && event.key === "Enter") {
        const taskId = Date.now();
        document.getElementById(columnId).children[1].innerHTML += `
            <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
                <h6>${event.target.value}</h6>
                <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
            </div>`
        const columns = localStorage.getItem('columns') ?
            JSON.parse(localStorage.getItem('columns')) : [];
        const currentColumn = columns.find(column => {
            console.log(column.id, columnId)
            return column.id === columnId
        });
        currentColumn.tasks.push({
            id: taskId,
            title,
        })
        localStorage.setItem('columns', JSON.stringify(columns))
        event.target.value = '';
        // const imgCancel=event.target.nextElementSibling.firstElementChild.firstElementChild
        // ocultarAddDelTask(imgCancel);
    } else {
        // Mensaje error: "Debe ingresar el titulo de la columna"
    }
}
document.querySelector('.textAddTask').onkeyup = event => {
    if (event.key === "Enter") {
        newTask();
    }
}
document.querySelector('.buttonAddTask').onclick = event => {
    newTask();
}