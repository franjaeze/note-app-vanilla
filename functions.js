 
export const takeNoteFromServer = async() =>{
  
    let userNotes = await axios.get('http://localhost:5000/todos/note_tags') 

    return userNotes.data
} 

/// mostratr tags
export function displayTags(tags) {
    let displayTags = tags.map(tag => {
      return `<span class="tag">${tag.tag_name}</span> `
    })
  
    displayTags = displayTags.join("");
    /*  tagContainer.innerHTML = displayTags ;  */
    return displayTags
  
  }
export const deleteFromServer =  async (id) =>{
    return await axios.delete(`http://localhost:5000/todos/${id}`) 
  }
  
export const   updateOnServer = async(updateNote, id) =>{
  
   return await axios.put(`http://localhost:5000/todos/${id}`, updateNote) 
   
  
  }
export function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
  
    const horas = fecha.getUTCHours().toString().padStart(2, '0');
    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); // Sumamos 1 porque los meses son base 0 en JavaScript
    const anio = fecha.getUTCFullYear();
  
    return `${horas}:${minutos} hs ${dia}-${mes}-${anio}`;
  }