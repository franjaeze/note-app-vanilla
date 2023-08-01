 
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
/*  initializeSortable(); */

});


// funcion para agregar nota al array
addNote.addEventListener('click', async()=> {
  const newNote = {}
  newNote.title = noteTitle.value  // toma los valores de los input
  newNote.text = noteBody.value
  newNote.user_email = user_email;
 
  let newTags = [...tags]; /// arreglar
  newNote.archived = false


  /*const webAddress = 'http://localhost:5000/' */

  const webAddress = 'https://web-production-ab3a.up.railway.app/'
  cleanInputs()
  let tagAdapter = {}
   let noteId = await axios.post(`${webAddress}todos`,newNote) 

   ////     itera entre los tags para enviarlos el server
   for (const tag of newTags) {
     tagAdapter.name = tag.tag_name
 
    const tagId = await axios.post(`${webAddress}tags`, tagAdapter);
    let tagNoteRelation= {
      note_id: noteId.data,
      tag_id: tagId.data
    }

    const relation = await axios.post( `${webAddress}note_tag_relation`, tagNoteRelation); 
 
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
  
     const tagId = await axios.post(`${webAddress}tags`, tagAdapter);
     let tagNoteRelation= {
       note_id: id,
       tag_id: tagId.data
     }
     const relation = await axios.post(`${webAddress}note_tag_relation`, tagNoteRelation); 
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
    return ` <div class="container note" draggable="true">
         <h3 class="note-title"> ${note.note_title}</h3> 
<p class="note-text"><span class="text-bg">  ${note.text}</span> </p>   
<div class="note-tags"> ${allTags} 
             </div>                              
             <div class="container4">
                <div>
                   <p class="note-edited">Last modified   ${formatFecha(note.last_modified)  }          </p>
                 </div>
           <div>
             <span class="cursor delete" data-id=${note.note_id}> 
             <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg></span>
             <span class="cursor update" data-id=${note.note_id}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg> </span>
             <span class="cursor archived" data-id=${note.note_id} 
             ><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z"/></svg>
             </span>
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


  inciarDrag()

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


/// btn color

const btnColor = document.getElementById('btn-color')

btnColor.addEventListener('click', ()=>{
highlightNote()
})

btnColor.addEventListener('touchend', function(event) {
  event.preventDefault(); // Previene el comportamiento predeterminado del evento
  highlightNote();
})
const highlightNote = () =>{
  btnColor.classList.toggle("highlight")
  let color = document.querySelectorAll('.note')
color.forEach(note => {
  note.addEventListener('click', ()=>{
    note.classList.toggle('green')
})
});
}
/// btn background

const btnBg = document.getElementById('btn-bg')
const body = document.getElementsByTagName('body')[0]
btnBg.addEventListener('click', ()=>{
  
  if(body.classList.contains('bg1')){
    body.classList.remove('bg1')

  }else {
  body.classList.add('bg1')
}
})

/// btn priotities
const prioritiesBox= document.querySelector('.priorities')
const todoBox= document.querySelector('.to-do')
const finishBox= document.querySelector('.finish')

prioritiesBox.addEventListener("dragover",e =>{
  e.preventDefault();
const dragable = document.querySelector('.dragging')
  prioritiesBox.appendChild(dragable)
})
todoBox.addEventListener("dragover",e =>{
  e.preventDefault();
const dragable = document.querySelector('.dragging')
todoBox.appendChild(dragable)
})
finishBox.addEventListener("dragover",e =>{
  e.preventDefault();
const dragable = document.querySelector('.dragging')
finishBox.appendChild(dragable)
})

const dragAllNotes = document.querySelectorAll('.note')
dragAllNotes.forEach(note => {
  note.addEventListener('dragstart', ()=>{
    console.log('dragging!!!!')
     note.classList.add('dragging')
  })
  note.addEventListener('dragend', ()=>{
    note.classList.remove('dragging')
 })
  
});


function inciarDrag(){
  const dragAllNotes = document.querySelectorAll('.note')
dragAllNotes.forEach(note => {
  note.addEventListener('dragstart', ()=>{
    console.log('dragging!!!!')
     note.classList.add('dragging')
  })
  note.addEventListener('dragend', ()=>{
    note.classList.remove('dragging')
 })
  
});
}

 
const btnPriorities = document.getElementById('btn-priorities')
const canvasBox = document.querySelector('.canvas-box')
btnPriorities.addEventListener('click',()=>{
/*   canvasBox.classList.toggle('hide') */
canvasBox.classList.remove('hide')
  
})




//btn filter hide 
const filter = document.querySelector('.options')
const showFilter = document.querySelector('.show-filter')
showFilter.addEventListener('click',() =>{
    filter.classList.toggle('hide')

})


/* /// dragable

Sortable.create(notesContainer, {
  animation: 250,
  chosenClass: "selected",
  dragClass: "drag"
})

Sortable.create(prioritiesBox, {
  animation: 250,
  chosenClass: "selected",
  dragClass: "drag"
}) */

/* 
const initializeSortable = () => {
  Sortable.create(notesContainer, {
    animation: 250,
    chosenClass: "selected",
    dragClass: "drag",
    draggable: ".note", // Solo las notas dentro de notesContainer serán arrastrables
    onEnd: () => {
      // Aquí puedes realizar acciones adicionales después de arrastrar y soltar
      console.log("Se ha soltado una nota");
    },
  });

  Sortable.create(prioritiesBox, {
    animation: 250,
    chosenClass: "selected",
    dragClass: "drag",
    draggable: ".note", // Si también quieres que las notas dentro de prioritiesBox sean arrastrables, agrega esta opción
    onEnd: () => {
      // Aquí puedes realizar acciones adicionales después de arrastrar y soltar en prioritiesBox
      prioritiesBox.appendChild(dragable)
    },
  });
}; */