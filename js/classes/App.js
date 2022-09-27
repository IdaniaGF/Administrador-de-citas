//eventos
import {inputs, formulario} from '../selectores.js'
import {crearCita, validar} from '../funciones.js'

class App {
    constructor(){
        this.initApp(); //queremos que se ejecuten los eventos cuando se mande llamar al constructor.
    }

    initApp(){
        eventListeners()

        function eventListeners(){
            formulario.addEventListener('submit',crearCita);
            inputs.forEach(input =>{
                input.addEventListener('blur', validar); 
            })
        }  
    }
}

export default App; 
