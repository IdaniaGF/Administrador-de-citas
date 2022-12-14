import UI from './classes/UI.js'
import {formulario} from './selectores.js'

export let DB; 
export let heading = document.querySelector('#administra'); 
export const ui = new UI(); 
let modificando = false; 

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "", 
    fecha: "", 
    hora: "",
    sintomas: "", 
}

//funciones

function capturarDato(input){
    citaObj[input.name] = input.value; 
}

export function crearCita(e){
    e.preventDefault();
    if(modificando){
        editarCita(citaObj); 
    }else{
        citaObj.id = Date.now();
        agregarCitaDB(citaObj); 
    }
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
    //Create a transaction, mentioning all the sotres it's going to access 
    const trans = DB.transaction(['citas'], 'readwrite'); 
    //get de the storeObject
    const objectStore = trans.objectStore('citas'); 
    //perform the request to the object sotre
    objectStore.delete(id); 
    trans.oncomplete = () => {
        console.log(`cita ${id} ha sido eliminada`);
        ui.imprimirCitas(); 
    }
    trans.onerror = () => {
        console.log('Hubo un error'); 
    }
}

export function infoCita(id){
    const trans = DB.transaction(['citas'], 'readonly');
    const objectStore = trans.objectStore('citas'); 
    objectStore.get(id)
    .onsuccess = (e) =>{
        const cita = e.target.result; 

        citaObj.mascota = cita.mascota; 
        citaObj.propietario = cita.propietario;
        citaObj.telefono = cita.telefono; 
        citaObj.fecha = cita.fecha; 
        citaObj.hora = cita.hora; 
        citaObj.sintomas = cita.sintomas; 
        citaObj.id = cita.id; 
    
        ui.cargarEdicion(cita); 
        modificando = true; 
    }
}

export function crearDB(){
    //abrir una conexi??n con la base de datos
    const openRequest = indexedDB.open('citas',1); 
    console.log(openRequest);

    //evento que indica que la base de datos est?? lista pero que su versi??n est?? desactualizada
    openRequest.onupgradeneeded = function(e){
        const dataBase = e.target.result; 

        const objectStore = dataBase.createObjectStore('citas', {keyPath: 'id', autoIncrement: true});

        objectStore.createIndex('mascota','mascota', {unique:false}); 
        objectStore.createIndex('propietario','propietario', {unique:false}); 
        objectStore.createIndex('telefono','telefono', {unique:false}); 
        objectStore.createIndex('fecha','fecha', {unique:false}); 
        objectStore.createIndex('hora','hora', {unique:false}); 
        objectStore.createIndex('sintomas','sintomas', {unique:false}); 
        objectStore.createIndex('id', 'id', { unique: false })
        console.log('DataBase creada y lista'); 
    }

    //          eventos  manejadores
    openRequest.onerror = function(err){
        console.log(err); 
        console.log('hubo un error en la creaci??n/apertura de base de datos'); 
    }
    openRequest.onsuccess = function(){
        console.log('se cre?? la base de datos con ??xito');
        DB = openRequest.result; 
        ui.imprimirCitas(); 
    }
}

function agregarCitaDB(citaObj){
    //crear la transacci??n, mencionando todos los almacenes a los que acceder??  
    const registroDB = DB.transaction(['citas'],'readwrite');
    //obtenter el almac??n de objetos (objectStore) de la base de datos
    const objectStore = registroDB.objectStore('citas'); 
    //realizar una solicitud al almac??n de objetos (objectStote)
    let request = objectStore.add(citaObj); 

    //manejar el exito y error de la solicitud 
    registroDB.oncomplete = function(){
        console.log('la cita se agreg?? con ??xito')
        ui.imprimirCitas(); 
        formulario.reset(); 
    }

    registroDB.onerror = function(err){
        console.log(err); 
        console.log('hubo un error en la transaccion')
    }
}

function editarCita(citaObj){
    const trans = DB.transaction(['citas'], 'readwrite');
    const objectStore = trans.objectStore('citas'); 
    objectStore.put(citaObj); 

    trans.oncomplete = function (){
        modificando = false; 
        ui.imprimirCitas(); 
        formulario.reset(); 
    }

    trans.onerror = function(err){
        console.log(err); 
    }

}