 /* 
  const webAddress = 'http://localhost:5000/' */

  const webAddress = 'https://web-production-ab3a.up.railway.app/'
export const takeNoteFromServer = async() =>{
  
    let userNotes = await axios.get(`${webAddress}todos/note_tags`) 

    return userNotes.data
} 

/// mostratr tags
export function displayTags(tags) {
    let displayTags = tags.map(tag => {
      return `<span class="tag">  ${tag.tag_name} </span> `
    })
  
    displayTags = displayTags.join("");
    /*  tagContainer.innerHTML = displayTags ;  */
    return displayTags
  
  }
export const deleteFromServer =  async (id) =>{
    return await axios.delete(`${webAddress}todos/${id}`) 
  } 
  
export const   updateOnServer = async(updateNote, id) =>{
  
   return await axios.put(`${webAddress}todos/${id}`, updateNote) 
   
  
  }
export function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO)  
    fecha.setHours(fecha.getHours() - 3);// sino me guarda con la hora de la Bd que son 2 o 3 hs diferencia

 
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Sumamos 1 porque los meses son base 0 en JavaScript
    const anio = fecha.getFullYear();
  
    return `${horas}:${minutos} hs ${dia}-${mes}-${anio}`;
  }