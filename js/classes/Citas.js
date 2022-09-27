class Citas{
    constructor(){
        this.listaCitas = []
    }

    agregarCita(cita){
        this.listaCitas = [...this.listaCitas, cita]; 
    }

    editarCita(citaActualizada){
        this.listaCitas = this.listaCitas.map(cita => cita.id === citaActualizada.id ? citaActualizada:cita)
        //el operador ? lo que hace es Si se cumple la condición entonces cita vale citaActualizada sino, vale cita
    }

    eliminarCita(id){
        this.listaCitas = this.listaCitas.filter(cita => cita.id !==id); 
    }
}

export default Citas; 