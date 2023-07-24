const notesContainer = document.querySelector('#notes');
const addNote = document.querySelector('.note-btn')
const addTag = document.querySelector('.tag-btn')
const tagContainer = document.querySelector('.tag-container')
const categoryTags = document.querySelector('.options')
const btnFilter = document.querySelector('#btn-filter')
const newNote = document.querySelector('.add-note');
const formBox = document.getElementById('form-box')

const noteTitle = document.querySelector('#title')
const noteBody = document.querySelector('#body')
const newTag = document.querySelector('#new-tag')


let allNotes = [];

let tags = []

window.addEventListener("DOMContentLoaded", function () {  /// para ejecutar ni bien se carge la pagina
  const storedNotes = localStorage.getItem("allNotesData");
  if (storedNotes) {
    allNotes = JSON.parse(storedNotes);
    displayNotes(allNotes);
    insertCategories(allNotes);
  }

  displayNotes(allNotes);
  /*  displayMenuButtons(); */
  insertCategories(allNotes)
});






// funcion para agregar nota al array
addNote.addEventListener('click', function () {
  const newNote = {}
  newNote.title = noteTitle.value  // toma los valores de los input
  newNote.body = noteBody.value
  newNote.tags = [...tags];
  tags = [];
  tagContainer.innerHTML = '';// para sacar los tags agregados
  noteTitle.value = '';
  noteBody.value = '';
  allNotes.push(newNote)  // envia la nueva nota al array
  displayNotes(allNotes);  // renderiza las nuevas notas
  insertCategories(allNotes)
  saveToLocalStorage();

});



//   a g r e g  a r     tags a la nota
addTag.addEventListener('click', function () {
  tags.push(newTag.value)  // toma los valores de los input
  newTag.value = '';
  tagContainer.innerHTML = displayTags(tags);  // renderiza las nuevas notas

});



btnFilter.addEventListener('click', function () {
  categoryFilter = categoryTags.value
  let notesFiltered = [];
  if (categoryFilter === "All") {
    displayNotes(allNotes);
  } else {
    allNotes.forEach(e => {
      e.tags.forEach(category => {
        if (category === categoryFilter) {
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
    return `<span class="tag">${tag}</span> `
  })

  displayTags = displayTags.join("");
  /*  tagContainer.innerHTML = displayTags ;  */
  return displayTags

}

// mostrar notas
function displayNotes(notes) {
  let displayNotes = notes.map(note => {

    let allTags = displayTags(note.tags)
    return ` <div class="container note">
         <h3 class="note-title"> ${note.title}</h3>
<p class="note-text"> ${note.body} </p>
<div class="note-tags"> ${allTags}
             </div>                              
             <div class="container3">
    
             <span class="cursor delete" data-id=${notes.indexOf(note)}> <i
                     class="fas fa-trash sm-fa-2x icono-down"></i></span>
             <span class="cursor update" data-id=${notes.indexOf(note)}> <i
                     class="fas fa-pencil-alt sm-fa-2x icono-down"></i> </span>
             <span class="cursor archived" data-id=${notes.indexOf(note)} > <i
                     class="fas fa-archive sm-fa-2x icono-down"></i></span>
       
         </div>
</div>`})

  displayNotes = displayNotes.join("");
  notesContainer.innerHTML = displayNotes;

  const deleteBtns = notesContainer.querySelectorAll(".delete"); // selecciono los btns que cree para agregarle lso event listener
  console.log(deleteBtns)



  deleteBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // aca agregamos el data-id en el html para que pueda rastrearse el evento con ese id
      // filtramos por categoria que matecha con el id, que es el mismo nombre de la categoria
      const noteIndex = e.currentTarget.dataset.id;
     deleteNote(noteIndex)


    });
  });




}

function deleteNote(noteIndex){
  allNotes.splice(noteIndex,1)
  displayNotes(allNotes);  // renderiza las nuevas notas
  insertCategories(allNotes)
  saveToLocalStorage();
}




function tagsCategories(allNotes) {
  let allTags = [];
  allNotes.forEach(note => {
    note.tags.forEach(tags => {

      allTags.push(tags)

    })

  });

  let uniqueCategories = new Set(allTags)
  uniqueCategories = [...uniqueCategories, "All"] // debo pasarlo a array ya que crea un objeto
  console.log(uniqueCategories)
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
  formBox.classList.toggle('hide')

})


///////////////////////////////////////   n a v b a r /////////////////////////////////////////////
const navBtn = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');

navBtn.addEventListener('click', function () {
  links.classList.toggle('show-links')

})