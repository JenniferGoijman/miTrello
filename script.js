const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
}

// CARGA COLUMNAS DEL LOCAL STORAGE -- //
const columns = localStorage.getItem('columns') ? JSON.parse(localStorage.getItem('columns')) : [];
columns.forEach(column => {
    document.querySelector('main').innerHTML += ` <div class="column" id="${column.Id}">
	<h4>${column.title}</h4>
        <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
	<div class="boxAddTask">
		<textarea placeholder="+ Añada una tarea" cols="25" rows="2" onkeyup="newTask(event,${column.Id})" class="textAddTask"></textarea>
                <div class="addDelTask">
                    <input type="button" value="Añadir tarea" class="buttonAddTask">
                    <a href="#"><img src="/img/cancelar.png" alt="" class="imgHideAddTask"></a>
		</div>
	</div>
</div>`
});
// -- CARGA COLUMNAS DEL LOCAL STORAGE //
const removeTask = (taskId) => {
    document.getElementById(taskId).remove();
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

function ocultarAddDelTask() {
    document.querySelector('div.boxAddTask').style.height = "2em";
    document.querySelector('.textAddTask').placeholder = "+ Añade una tarea";
    document.querySelector('.textAddTask').style.border = "";
    document.querySelector('.textAddTask').style.backgroundColor = "";
    document.querySelector('div.addDelTask').style.display = "none";
}
document.querySelector('img.imgHideAddTask').onclick = event => {
    ocultarAddDelTask();
}

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
        document.querySelector('main').innerHTML += ` <div class="column" id="${columnId}">
	            <h4>${title}</h4>
                <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)"></div>
	                <div class="boxAddTask">
		                <textarea placeholder="+ Añada una tarea" cols="25" rows="2" onkeyup="newTask(event,${columnId})" class="textAddTask"></textarea>
                    <div class="addDelTask">
                        <input type="button" value="Añadir tarea" class="buttonAddTask">
                        <a href="#"><img src="/img/cancelar.png" alt="" class="imgHideAddTask"></a>
		            </div>
	            </div>
            </div>`
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

document.querySelector('.textAddTask').onclick = event => {
    document.querySelector('div.boxAddTask').style.height = "4em";
    document.querySelector('textarea.textAddTask').placeholder = "Introduzca el nombre de la tarea";
    document.querySelector('textarea.textAddTask').style.border = "1px solid rgb(59, 180, 228)";
    document.querySelector('textarea.textAddTask').style.backgroundColor = "white";
    document.querySelector('.addDelTask').style.display = "flex";
}

//CAMBIAR TODO LO DE ABAJO PARA AGREGAR TAREAS
function newTask(event, columnId) {
    const title = document.querySelector('.textAddTask').value;
    if (title.value != '') {
        const taskId = Date.now();
        document.getElementById(columnId).children[1].innerHTML += `
            <div class="task" id="${taskId}" draggable ondragstart ="drag(event,${taskId})" >
                <h5>${event.target.value}</h5>
                <i class="far fa-trash-alt" onclick="removeTask(${taskId})"></i>
            </div>`
        const columns = localStorage.getItem('columns') ?
            JSON.parse(localStorage.getItem('columns')) : [];
        const currentColumn = columns.find(column => column.id === columnId);
        console.log(currentColumn)
        event.target.value = '';
        ocultarAddDelTask();
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