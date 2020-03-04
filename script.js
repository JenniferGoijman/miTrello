const drag = (event, taskId) => {
    event.dataTransfer.setData("id", taskId);
}
const columns = localStorage.getItem('columns') ?
    JSON.parse(localStorage.getItem('columns')) : [];
columns.forEach(column => {
    document.querySelector('main').innerHTML += ` <div class="column" 
        id="${column.id}">
                    <h2>${column.title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    </div>
                    <input type="text" onkeyup="addTask(event,${column.id})">
                    </div>`
});
const removeTask = (taskId) => {
    document.getElementById(taskId).remove();
}
// const removeTask = (event) =>{
//     event.target.parentElement
// }
const addTask = (event, columnId) => {
    if (event.key === 'Enter') {
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
    }
}
const preventDefault = event => event.preventDefault();
const drop = event => {
    const taskId = event.dataTransfer.getData("id");
    const task = document.getElementById(taskId)
    event.target.appendChild(task)
}

document.querySelector('.addColumn').onclick = event => {
    document.querySelector('input#addColumn.addColumn').placeholder = "Introduzca el título de la columna...";
    document.querySelector('input#addColumn.addColumn').style.border = "1px solid rgb(59, 180, 228)";
    document.querySelector('input#addColumn.addColumn').style.backgroundColor = "white";
    document.querySelector('.addDel').style.display = "flex";
}

function ocultarAddDel() {
    document.querySelector('input#addColumn.addColumn').placeholder = "Añadir columna";
    document.querySelector('input#addColumn.addColumn').style.border = "";
    document.querySelector('input#addColumn.addColumn').style.backgroundColor = "";
    document.querySelector('.addDel').style.display = "none";
}

document.querySelector('img.imgCancelar').onclick = event => {
    ocultarAddDel();
}

function newColumn() {
    const columnId = Date.now();
    const title = document.querySelector('.addColumn').value;
    document.querySelector('main').innerHTML += ` <div class="column" 
        id="${columnId}">
                    <h2>${title}</h2>
                    <div class="tasks" ondragover="preventDefault(event)"  ondrop="drop(event)">
                    </div>
                    <input type="text" onkeyup="addTask(event,${columnId})">
                    </div>`
    const columns = localStorage.getItem('columns') ?
        JSON.parse(localStorage.getItem('columns')) : [];
    columns.push({
        id: columnId,
        title,
        tasks: []
    })
    localStorage.setItem('columns', JSON.stringify(columns));
    document.querySelector('.addColumn').value = '';
    ocultarAddDel();
}

document.querySelector('.addColumn').onkeyup = event => {
    if (event.key === "Enter") {
        newColumn();
    }
}
document.querySelector('.buttonAddColumn').onclick = event => {
    newColumn();
}

// document.querySelector('.addColumn').addEventListener('keyup', event => {})