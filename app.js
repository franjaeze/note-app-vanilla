const notesContainer = document.querySelector('#notes');
const addNote = document.querySelector('.note-btn')
const addTag = document.querySelector('.tag-btn')
const tagContainer = document.querySelector('.tag-container')
const categoryTags = document.querySelector('.options')
const btnFilter = document.querySelector('#btn-filter')
const newNote = document.querySelector('.add-note');
const formBox = document.getElementById('form-box')
const updateBtn = document.querySelector('.update-note-btn')
const noteHandler = document.querySelector('.note-index')
const closeBtn= document.querySelector('.close-btn')

const noteTitle = document.querySelector('#title')
const noteBody = document.querySelector('#body')
const newTag = document.querySelector('#new-tag')

///////////////////////////// modal

const openModal = document.querySelector('.open-dialog')
const closeModal = document.querySelector('.close-dialog')
const testDialog= document.querySelector('.test-dialog')


 
let allNotes = [];
let user_email = 'fran@gmail.com';  /// hardcodeo de email acaaaaa
let tags = []

window.addEventListener("DOMContentLoaded",  async ()=> {  /// para ejecutar ni bien se carge la pagina
 /*  const storedNotes = localStorage.getItem("allNotesData");

  if (storedNotes) {
    allNotes = JSON.parse(storedNotes);
    displayNotes(allNotes);
    insertCategories(allNotes);
  } */
 

 await displayNotes();
  /*  displayMenuButtons(); */


    
  



});


const takeNoteFromServer = async() =>{
  
    let userNotes = await axios.get('http://localhost:5000/todos/note_tags') 
    
    return userNotes.data
} 



// funcion para agregar nota al array
addNote.addEventListener('click', async()=> {
  const newNote = {}
  newNote.title = noteTitle.value  // toma los valores de los input
  newNote.text = noteBody.value
  newNote.user_email = user_email;
 
  let newTags = [...tags]; /// arreglar

  newNote.archived = false
/*   newNote.last_modified = dateTimeNow() */
   
  cleanInputs()
  
 let tagAdapter = {}
 let tagNoteRelation = {}
  console.log(newNote)
 /*  allNotes.push(newNote) */  // envia la nueva nota al array
   let noteId = await axios.post('http://localhost:5000/todos',newNote) 
   for (const tag of newTags) {
     tagAdapter.name = tag.tag_name
    console.log(tagAdapter);
    const response = await axios.post('http://localhost:5000/tags', tagAdapter);
    let tagNoteRelation= {
      note_id: noteId.data,
      tag_id: response.data
    }
    console.log(tagNoteRelation)
    const relation = await axios.post('http://localhost:5000/note_tag_relation', tagNoteRelation);
      
   
    
  }
  displayNotes(allNotes);  // renderiza las nuevas notas
  insertCategories(allNotes)
  saveToLocalStorage();
 
  testDialog.close()

});


function dateTimeNow () {
  return  {
    editedDate: new Date().toISOString().replace(/T.*/, '').split('-').reverse().join('-'),
    editedHour: new Date().getHours(),
    editedMinute: new Date().getMinutes()}
}

function cleanInputs(){
  tags = [];
  tagContainer.innerHTML = '';// para sacar los tags agregados
  noteTitle.value = '';
  noteBody.value = '';
  if(noteHandler.querySelector('p')!=null){
  noteHandler.querySelector('p').remove()}
}

updateBtn.addEventListener('click', async()=>{
  let id = noteHandler.querySelector('p').dataset.id;

  const updateNote = {}
  updateNote.title = noteTitle.value  // toma los valores de los input
  updateNote.text = noteBody.value
  updateNote.user_email= user_email;  //// harcode de mail aca!!!!!
  updateNote.archived = false;               // tmb harcodeo el archived!!!!
/*   updateNote.tags = [...tags]; */
/*   updateNote.lastModified = dateTimeNow(); */
 
 
  await updateOnServer(updateNote, id)
  // envia la nueva nota al server

  await displayNotes();  // renderiza las nuevas notas

  cleanInputs()
  addNote.classList.remove('hide')  
  updateBtn.classList.add('hide')
 
  testDialog.close()
})


//   a g r e g  a r     tags a la nota
addTag.addEventListener('click', function () {
 let tagToPush = newTag.value.toLowerCase()
 tagToPush = tagToPush.charAt(0).toUpperCase()+tagToPush.slice(1)
 
  let tagObject ={ tag_name : tagToPush};
  tags.push(tagObject)  // toma los valores de los input
  newTag.value = '';
  tagContainer.innerHTML = displayTags(tags);  // renderiza las nuevas notas

});



btnFilter.addEventListener('click', function () {
  categoryFilter = categoryTags.value
  console.log(categoryFilter)
  let notesFiltered = [];
  if (categoryFilter === "All") {
    displayNotes(allNotes);
  } else {
    allNotes.forEach(e => {
      e.tags.forEach(tag => {
              console.log(tag)
        if (tag.tag_name === categoryFilter) {
    
          notesFiltered.push(e)
        }

      });


    })
    displayNotes(notesFiltered);

  }
})


/// mostratr tags
function displayTags(tags) {
  let displayTags = tags.map(tag => {
    return `<span class="tag">${tag.tag_name}</span> `
  })

  displayTags = displayTags.join("");
  /*  tagContainer.innerHTML = displayTags ;  */
  return displayTags

}

// mostrar notas
const displayNotes = async () => {
  let notes = await takeNoteFromServer()
 
  allNotes = notes;
  insertCategories(allNotes)
  let displayNotes = notes.map(note => {
 
    let allTags = displayTags(note.tags)
    return ` <div class="container note">
         <h3 class="note-title"> ${note.note_title}</h3> 
<p class="note-text"><span class="text-bg">  ${note.text}</span> </p>   
<div class="note-tags"> ${allTags}
             </div>                              
             <div class="container4">
                <div>
                   <p class="note-edited">Last modified   ${formatFecha(note.last_modified)  }          </p>
                 </div>
           <div>
             <span class="cursor delete" data-id=${note.note_id}> <i
                     class="fas fa-trash sm-fa-2x icono-down"></i></span>
             <span class="cursor update" data-id=${note.note_id}> <i
                     class="fas fa-pencil-alt sm-fa-2x icono-down"></i> </span>
             <span class="cursor archived" data-id=${note.note_id} > <i
                     class="fas fa-archive sm-fa-2x icono-down"></i></span>
                     </div>
         </div>
</div>`})

  displayNotes = displayNotes.join("");
  notesContainer.innerHTML = displayNotes;

  const deleteBtns = notesContainer.querySelectorAll(".delete"); // selecciono los btns que cree para agregarle lso event listener
  const updateBtns = notesContainer.querySelectorAll(".update"); // selecciono los btns que cree para agregarle lso event listener

  function formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
  
    const horas = fecha.getUTCHours().toString().padStart(2, '0');
    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0'); // Sumamos 1 porque los meses son base 0 en JavaScript
    const anio = fecha.getUTCFullYear();
  
    return `${horas}:${minutos} hs ${dia}-${mes}-${anio}`;
  }

  ///  btn de eliminar
  deleteBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
    
      const noteId = e.currentTarget.dataset.id;
     deleteNote(noteId)


    });
  });
    /// btn de modificar
  updateBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      addNote.classList.add('hide')  
      updateBtn.classList.remove('hide')
      const noteId = e.currentTarget.dataset.id;
     updateNote(noteId)


    });
  });




}

const updateNote = (noteId) =>{
 noteToModify = allNotes.filter(note => note.note_id == noteId)[0]
 noteTitle.value =noteToModify.note_title // toma los valores de los input
  noteBody.value = noteToModify.text
  tags = noteToModify.tags
  testDialog.showModal();
  tagContainer.innerHTML = displayTags(noteToModify.tags);  // renderiza las nuevas notas
    noteHandler.innerHTML = `<p data-id=${noteId}>  ${noteId} </p>` 

  
}


function deleteNote(id){
 deleteFromServer(id)
  displayNotes(); 

}

const deleteFromServer =  async (id) =>{
  result = await axios.delete(`http://localhost:5000/todos/${id}`) 
}

const   updateOnServer = async(updateNote, id) =>{
  console.log(updateNote)
  result = await axios.put(`http://localhost:5000/todos/${id}`, updateNote) 
  console.log(result.data)

}
function tagsCategories(allNotes) {
  let allTags = [];
  allNotes.forEach(note => {
    note.tags.forEach(tags => {

      allTags.push(tags.tag_name)

      })

  });

  let uniqueCategories = new Set(allTags)
  uniqueCategories = [...uniqueCategories, "All"] // debo pasarlo a array ya que crea un objeto
 
  return uniqueCategories
}


function displayCategories(categoryArray) {
  if (categoryArray) {
    let displayCategpories = categoryArray.map(category => {
      return `<option data-id=${category}>${category}</option> `
    })

    displayCategpories = displayCategpories.join('')
    return displayCategpories
  }
}


function insertCategories(allNotes) {
  uniqueCategories = tagsCategories(allNotes)

  categoryTags.innerHTML = displayCategories(uniqueCategories)

}

////      local storage function

function saveToLocalStorage() {
  localStorage.setItem("allNotesData", JSON.stringify(allNotes));
}


newNote.addEventListener('click', () => {
  testDialog.showModal()

})


///////////////////////////////////////   n a v b a r /////////////////////////////////////////////
const navBtn = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');

navBtn.addEventListener('click', function () {
  links.classList.toggle('show-links')

})


////// close btn

closeBtn.addEventListener('click', ()=>{
  formBox.classList.toggle('hide')
  cleanInputs();
})



/* openModal.addEventListener('click',()=>{
  testDialog.showModal()

}) */

closeModal.addEventListener('click',()=>{
  testDialog.close()
  cleanInputs()

})
