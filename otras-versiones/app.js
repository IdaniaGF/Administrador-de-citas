//variables globales
const formulario = document.getElementById('nueva-cita');
const inputs = document.querySelectorAll('.input'); 
const contenedorCitas = document.querySelector("#citas"); 
const mascota = formulario.querySelector("#mascota");
const propietario = formulario.querySelector("#propietario");
const telefono = formulario.querySelector("#telefono"); 
const fecha = formulario.querySelector("#fecha"); 
const hora = formulario.querySelector("#hora"); 
const sintomas = formulario.querySelector("#sintomas"); 


////para eliminar dejo vacio todos los campos y para editar reiniciarnos el objeto

function capturarDatos(){
    //conosole.log(e.target.value)
    //notación de corchetes, es lo mismo que. 

    //buscar otra forma de hacer esto ya que inputs ya almacena estos valores. 
    const citaObj = {
        mascota: mascota.value,
        propietario: propietario.value,
        telefono: telefono.value, 
        fecha: fecha.value, 
        hora: hora.value,
        sintomas: sintomas.value, 
        id: "",
    }
    return citaObj;
}  

//eventos
eventListeners()

function eventListeners(){
    formulario.addEventListener('submit',crearCita);
    inputs.forEach(input =>{
        input.addEventListener('blur', validar); 
    })
}

//Clases
class Citas{
    constructor(){
        this.listaCitas = []
    }

    agregarCita(cita){
        console.log(this.listaCitas); 
        this.listaCitas = [...this.listaCitas, cita]; 
        console.log(this.listaCitas); 
    }

    editarCita(citaActualizada){
        this.listaCitas = this.listaCitas.map(cita => cita.id === citaActualizada.id ? citaActualizada:cita)
        //el operador ? es de asignación de anulación lógica y lo que hace es Si citaActualizada es nulo asigna lo de id a cita actualizada cita
    }

    eliminarCita(id){
        this.listaCitas = this.listaCitas.filter(cita => cita.id !==id); 
    }
}

//user interface
class UI{
    limpiarHTML(){
        //eliminar todo y dejar limpio
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild); 
        }
    }

    //insertar los gastos a la lista
    agregarCita({listaCitas}) { //Se puede aplicar destructuring desde la función... 
        this.limpiarHTML(); 
        //iterar nuestro arreglo de gastos
        listaCitas.forEach(cita =>{
            const{mascota, propietario, telefono, fecha, hora, sintomas, id} = cita; 

            //Crear un div 
            const divCita = document.createElement("div"); 
            divCita.classList.add('cita', 'p-3'); 
            divCita.dataset.id=id; 
            contenedorCitas.appendChild(divCita); 

            //Scripting de los elementos
            this.createElement('h2', mascota, divCita, cita).classList.add('card-title', 'font-weight-bolder');
            this.createElement('p',propietario, divCita, cita);
            this.createElement('p',telefono, divCita,cita); 
            this.createElement('p',fecha, divCita,cita);
            this.createElement('p',hora, divCita,cita); 
            this.createElement('p',sintomas, divCita, cita);

            //borrar cita boton 
            const btnBorrar = this.createButton("Borrar", divCita);
            btnBorrar.onclick=()=>{
                eliminarCita(id); 
            }

            //editar cita boton
            const btnEditar = this.createButton("Editar", divCita); 
            btnEditar.onclick=()=>{
                editarCita(id); 
            }
        })
    }
    
    createElement(HTMLtag, data, divCita,cita){
        const element = document.createElement(HTMLtag);
        let label = Object.keys(cita).find(key => cita[key] === data); 
        label = label.charAt(0).toUpperCase() + label.slice(1); 
        element.innerHTML = `<span class = "font-weight-bolder">${label}: </span> ${data}`; 
        divCita.appendChild(element);
        return element; 
    }

    createButton(type, divCita){
        const btn = document.createElement("button");
        btn.classList.add('btn', 'btn-danger', 'mr-2');
        btn.textContent=type; 
        divCita.appendChild(btn);
        return btn; 
    }

    mostrarMensajeError(input){
        let mensaje = ""; 
        if(input.validity.valueMissing){
            mensaje = "Todos los campos son obligatorios"; 
        } else if(input.validity.patternMismatch){
            mensaje = "El telefono requiere de 10 digitos"; 
        } else if (input.validity.customError){
            mensaje = ""; 
        }

        const divMensaje=document.createElement('div'); 
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12', 'alert-danger');
        divMensaje.textContent = mensaje; 

        formulario.insertBefore(divMensaje,document.querySelector("#submitBtn"));
    }

    editarCita(cita){
        mascota.value = cita.mascota; 
        propietario.value = cita.propietario; 
        telefono.value = cita.telefono; 
        fecha.value = cita.fecha; 
        hora.value = cita.hora; 
        sintomas.value = cita.sintomas; 
    }
}

const listaCitas = new Citas(); 
const ui = new UI(); 
let id = ""; 

//funciones


function crearCita(e){
    e.preventDefault();
    const citaObj = capturarDatos(); 

    if(id != ""){
        citaObj.id=id; 
        listaCitas.editarCita(citaObj); 
        id = "";
    }else{
        citaObj.id=Date.now(); 
        listaCitas.agregarCita(citaObj);  
    }

    ui.agregarCita(listaCitas); 
    formulario.reset(); 
}

function validar(input){
    const error=document.querySelector('.alert');
    if(error){
        error.remove(); 
    }

    if(input.target.validity.valid){
        input.target.classList.remove('border', 'border-red-500');
        input.target.classList.add('border', 'border-green-500');
    }else{
        input.target.classList.remove('border', 'border-green-500');
        input.target.classList.add('border', 'border-red-500');
        ui.mostrarMensajeError(input.target);
    }
}

function eliminarCita(id){
    listaCitas.eliminarCita(id); 
    ui.agregarCita(listaCitas); 
}

function editarCita(idCita){
    id = idCita; 
    const cita = listaCitas.listaCitas.find(cita => cita.id == id); 
    ui.editarCita(cita); 
}