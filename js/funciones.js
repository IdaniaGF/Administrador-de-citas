import Citas from './classes/Citas.js'
import UI from './classes/UI.js'
import {formulario} from './selectores.js'

const listaCitas = new Citas(); 
const ui = new UI(); 
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "", 
    fecha: "", 
    hora: "",
    sintomas: "", 
    id: "",
}

//funciones

function capturarDato(input){
    citaObj[input.name] = input.value; 
}

export function crearCita(e){
    e.preventDefault();
    if(citaObj.id != ""){
        //spread 
        listaCitas.editarCita({...citaObj}); 
    }else{
        citaObj.id=Date.now(); 
        listaCitas.agregarCita({...citaObj});  

        //agregar registro a la indexedDB
        console.log(citaObj)
        agregarCitaDB(citaObj); 
    }
    ui.agregarCita(listaCitas); 
    citaObj.id = ""; 
    formulario.reset(); 
}

export function validar(input){
    const error=document.querySelector('.alert');
    if(error){
        error.remove(); 
    }

    if(input.target.validity.valid){
        capturarDato(input.target); 
        input.target.classList.remove('border', 'border-red-500');
        input.target.classList.add('border', 'border-green-500');
    }else{
        input.target.classList.remove('border', 'border-green-500');
        input.target.classList.add('border', 'border-red-500');
        ui.mostrarMensajeError(input.target);
    }
}

export function eliminarCita(id){
    listaCitas.eliminarCita(id); 
    ui.agregarCita(listaCitas); 
}

export function infoCita(id){
    const cita = listaCitas.listaCitas.find(cita => cita.id == id); 

    citaObj.mascota = cita.mascota; 
    citaObj.propietario = cita.propietario;
    citaObj.telefono = cita.telefono; 
    citaObj.fecha = cita.fecha; 
    citaObj.hora = cita.hora; 
    citaObj.sintomas = cita.sintomas; 
    citaObj.id = id; 

    ui.cargarEdicion(cita); 
}

let DB; 

export function crearDB(){
    //abrir una conexión con la base de datos
    const openRequest = indexedDB.open('citas',1); 
    console.log(openRequest);

    //evento que indica que la base de datos está lista pero que su versión está desactualizada
    openRequest.onupgradeneeded = function(e){
        const dataBase = e.target.result; 
        console.log(e);
        console.log(e.target);
        console.log(dataBase); 

        const objectStore = dataBase.createObjectStore('citas', {keypath: 'id', autoIncrement: true});

        objectStore.createIndex('mascota','mascota', {unique:false}); 
        objectStore.createIndex('propietario','propietario', {unique:false}); 
        objectStore.createIndex('telefono','telefono', {unique:false}); 
        objectStore.createIndex('fecha','fecha', {unique:false}); 
        objectStore.createIndex('hora','hora', {unique:false}); 
        objectStore.createIndex('sintomas','sintomas', {unique:false}); 
        objectStore.createIndex('id','id', {unique:false}); 
        console.log('DataBase creada y lista'); 
    }

    //          eventos  manejadores
    openRequest.onerror = function(err){
        console.log(err); 
        console.log('hubo un error en la creación/apertura de base de datos'); 
    }
    openRequest.onsuccess = function(){
        console.log('se creó la base de datos con éxito');
        DB = openRequest.result; 
        console.log(DB); 
    }

}

function agregarCitaDB(citaObj){
    //crear la transacción, mencionando todos los almacenes a los que accederá  
    const registroDB = DB.transaction(['citas'],'readwrite');
    //obtenter el almacén de objetos (objectStore) de la base de datos
    const objectStore = registroDB.objectStore('citas'); 
    //realizar una solicitud al almacén de objetos (objectStote)
    let request = objectStore.add(citaObj); 

    //manejar el exito y error de la solicitud 
    request.oncomplete = function(){
        console.log('la cita fue agregada con éxito');
    }

    request.onerror = function(err){
        console.log(err); 
        console.log('hubo un error en la transaccion')
    }
}