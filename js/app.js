import App from './classes/App.js'
import {crearDB} from './funciones.js'

window.onload = () =>{
    const app = new App; 
    crearDB();  
}
