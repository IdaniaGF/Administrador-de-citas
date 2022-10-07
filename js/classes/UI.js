import {contenedorCitas, mascota, propietario, telefono, fecha, hora, sintomas} from '../selectores.js'
import {eliminarCita, infoCita} from '../funciones.js'
import {DB} from '../funciones.js'

//user interface
class UI{
    limpiarHTML(){
        //eliminar todo y dejar limpio
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild); 
        }
    }

    //insertar los gastos a la lista
    imprimirCitas() { //Se puede aplicar destructuring desde la función... 
        this.limpiarHTML(); 

        //leer el contenido de la base de datos
        const objectStore = DB.transaction('citas').objectStore('citas');

        //eso es nada más para probar el método count
        const total = objectStore.count(); 
        total.onsuccess = function(){
            console.log(total.result); 
        }

        total.onerror = function(err){
            console.log(err)
        }

        objectStore.openCursor().onerror = function(err){
            console.log(err)
        }

        function createElement(HTMLtag, data, divCita,cita){
            const element = document.createElement(HTMLtag);
            let label = Object.keys(cita).find(key => cita[key] === data); 
            label = label.charAt(0).toUpperCase() + label.slice(1); 
            element.innerHTML = `<span class = "font-weight-bolder">${label}: </span> ${data}`; 
            divCita.appendChild(element);
            return element; 
        }

        function createButton(divCita){
            const btn = document.createElement("button");
            divCita.appendChild(btn);
            return btn; 
        }

        //opencursor es un método que se utilizará para iterar a través de un almacén de objetos con un cursor
        objectStore.openCursor().onsuccess = function(e){
            const cursor = e.target.result; 

            if(cursor){
                const{mascota, propietario, telefono, fecha, hora, sintomas, id} = cursor.value;                
                
                //Crear un div 
                const divCita = document.createElement("div"); 
                divCita.classList.add('cita', 'p-3'); 
                divCita.dataset.id=id; 
                contenedorCitas.appendChild(divCita); 

                //Scripting de los elementos
                createElement('h2', mascota, divCita, cursor.value).classList.add('card-title', 'font-weight-bolder');
                createElement('p',propietario, divCita, cursor.value);
                createElement('p',telefono, divCita, cursor.value); 
                createElement('p',fecha, divCita, cursor.value);
                createElement('p',hora, divCita, cursor.value); 
                createElement('p',sintomas, divCita, cursor.value);

                //borrar cita boton 
                const btnBorrar = createButton(divCita);
                btnBorrar.classList.add('btn', 'btn-danger', 'mr-2');
                btnBorrar.innerHTML = 'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
                btnBorrar.onclick=()=>{
                    eliminarCita(id); 
                }

                //editar cita boton
                const btnEditar = createButton(divCita); 
                btnEditar.classList.add('btn', 'btn-info');
                btnEditar.innerHTML = 'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>';
                btnEditar.onclick=()=>{
                    infoCita(id); 
                }

                //ve al siguiente elemento registrado
                cursor.continue()
            }//fin del if
        }// fin de la función cursor
        
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

        document.querySelector('#contenido').insertBefore(divMensaje,document.querySelector('.agregar-cita'));

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    cargarEdicion(cita){
        mascota.value = cita.mascota; 
        propietario.value = cita.propietario; 
        telefono.value = cita.telefono; 
        fecha.value = cita.fecha; 
        hora.value = cita.hora; 
        sintomas.value = cita.sintomas; 
    }
}

export default UI; 