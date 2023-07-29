 
import { takeNoteFromServer, formatFecha, updateOnServer,deleteFromServer, displayTags } from "./functions.js";

const notesContainer = document.querySelector('#notes');
const addNote = document.querySelector('.note-btn')
const addTag = document.querySelector('.tag-btn')
const tagContainer = document.querySelector('.tag-container')
const categoryTags = document.querySelector('.options')
const btnFilter = document.querySelector('#btn-filter')
const newNotetn = document.querySelector('.add-note');
 
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
let newTags =[]

window.addEventListener("DOMContentLoaded",  async ()=> {  /// para ejecutar ni bien se carge la pagina
  allNotes = await takeNoteFromServer()

 await displayNotes(allNotes);
});


// funcion para agregar nota al array
addNote.addEventListener('click', async()=> {
  const newNote = {}
  newNote.title = noteTitle.value  // toma los valores de los input
  newNote.text = noteBody.value
  newNote.user_email = user_email;
 
  let newTags = [...tags]; /// arreglar
  newNote.archived = false

  cleanInputs()
  let tagAdapter = {}
   let noteId = await axios.post('http://localhost:5000/todos',newNote) 

   ////     itera entre los tags para enviarlos el server
   for (const tag of newTags) {
     tagAdapter.name = tag.tag_name
 
    const tagId = await axios.post('http://localhost:5000/tags', tagAdapter);
    let tagNoteRelation= {
      note_id: noteId.data,
      tag_id: tagId.data
    }

    const relation = await axios.post('http://localhost:5000/note_tag_relation', tagNoteRelation); 
 
  }
  allNotes =  await takeNoteFromServer()
  displayNotes(allNotes);  // renderiza las nuevas notas
  insertCategories(allNotes)

  testDialog.close()

});


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
   
   let tagWithoutId = [];
   for (const objeto of tags) {
     if (!objeto.hasOwnProperty("tag_id")) {
      tagWithoutId.push(objeto);
        
     }
   }
      let tagAdapter = {};
    ////     itera entre los tags para enviarlos el server
    for (const tag of tagWithoutId) {
      tagAdapter.name = tag.tag_name
  
     const tagId = await axios.post('http://localhost:5000/tags', tagAdapter);
     let tagNoteRelation= {
       note_id: id,
       tag_id: tagId.data
     }
     const relation = await axios.post('http://localhost:5000/note_tag_relation', tagNoteRelation); 
 }

  await updateOnServer(updateNote, id)
  // envia la nueva nota al server
  allNotes= await takeNoteFromServer()
  await displayNotes(allNotes);  // renderiza las nuevas notas

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


////            filtrado de notas
btnFilter.addEventListener('click', function () {
  let categoryFilter = categoryTags.value
 
  let notesFiltered = [];
  if (categoryFilter === "All") {
    displayNotes(allNotes);
  } else {
    allNotes.forEach(e => {
      e.tags.forEach(tag => {
            
        if (tag.tag_name === categoryFilter) {
    
          notesFiltered.push(e)
        }

      });


    })
    displayNotes(notesFiltered);

  }
})




// mostrar notas
const displayNotes = async (notes) => {

 

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
 let noteToModify = allNotes.filter(note => note.note_id == noteId)[0]
 noteTitle.value =noteToModify.note_title // toma los valores de los input
  noteBody.value = noteToModify.text
  tags = noteToModify.tags
  testDialog.showModal();
  tagContainer.innerHTML = displayTags(noteToModify.tags);  // renderiza las nuevas notas
    noteHandler.innerHTML = `<p data-id=${noteId}>  ${noteId} </p>` 

  
}


const deleteNote = async(id)=> {
  await deleteFromServer(id)
  allNotes = await takeNoteFromServer()
  displayNotes(allNotes); 

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
 let uniqueCategories = tagsCategories(allNotes)

  categoryTags.innerHTML = displayCategories(uniqueCategories)

}



newNotetn.addEventListener('click', () => {
  testDialog.showModal()

})


///////////////////////////////////////   n a v b a r /////////////////////////////////////////////
const navBtn = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');

navBtn.addEventListener('click', function () {
  links.classList.toggle('show-links')

})


////// close btn

/* closeBtn.addEventListener('click', ()=>{
  console.log('cerrando')
 
  cleanInputs();
  testDialog.close()
  console.log('cerrando')
}) */

closeModal.addEventListener('click',()=>{
  console.log('cerrando')
  testDialog.close()
  cleanInputs()

})


/// dragable

Sortable.create(notesContainer, {
  animation: 250,
  chosenClass: "selected",
  dragClass: "drag"
})

/// btn color

const btnColor = document.getElementById('btn-color')

btnColor.addEventListener('click', ()=>{
  let color = document.querySelectorAll('.note')
color.forEach(note => {
  note.addEventListener('click', ()=>{
    note.classList.add('green')
})
});


})