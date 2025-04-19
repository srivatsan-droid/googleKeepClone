const addTitle = document.getElementById("addTitle");
const addText = document.getElementById("addText");
const addNoteButton = document.getElementById("addNote");
const notesDiv = document.getElementById("notes");

const showArchivedBtn = document.getElementById("showArchived");
const showDeletedBtn = document.getElementById("showDeleted");
const showActiveBtn = document.getElementById("showActive");

let currentView = "active"; // Can be 'active', 'archived', or 'deleted'

addNoteButton.addEventListener("click", addNotes);
showArchivedBtn.addEventListener("click", () => showNotes("archived"));
showDeletedBtn.addEventListener("click", () => showNotes("deleted"));
showActiveBtn.addEventListener("click", () => showNotes("active"));

function getNotes(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setNotes(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function addNotes() {
  if (addText.value.trim() === "") {
    alert("Please add a title to the text area.");
    return;
  }

  const newNote = {
    title: addTitle.value,
    text: addText.value,
    created: new Date().toISOString()
  };

  const notes = getNotes("notes");
  notes.push(newNote);
  setNotes("notes", notes);

  addTitle.value = "";
  addText.value = "";
  showNotes("active");
}

function showNotes(type = "active") {
  currentView = type;
  let notes = getNotes(type === "active" ? "notes" : type);
  notesDiv.innerHTML = "";

  if (notes.length === 0) {
    notesDiv.innerHTML = `<div class="noNotes">No ${type} notes found.</div>`;
    return;
  }

  notes.forEach((note, index) => {
    let html = `<div class="note notes">
      <div class="title">${note.title || "Note"}</div>
      <div class="text">${note.text}</div>`;

    if (type === "active") {
      html += `<button class="deleteNode" onclick="archiveNote(${index})">Archive</button>
               <button class="deleteNode" onclick="deleteNote(${index})">Delete</button>`;
    }

    html += `</div>`;
    notesDiv.innerHTML += html;
  });
}

function deleteNote(index) {
  let notes = getNotes("notes");
  const deletedNotes = getNotes("deleted");

  deletedNotes.push(notes[index]);
  notes.splice(index, 1);

  setNotes("notes", notes);
  setNotes("deleted", deletedNotes);

  showNotes("active");
}

function archiveNote(index) {
  let notes = getNotes("notes");
  const archivedNotes = getNotes("archived");

  archivedNotes.push(notes[index]);
  notes.splice(index, 1);

  setNotes("notes", notes);
  setNotes("archived", archivedNotes);

  showNotes("active");
}

// Initialize
showNotes("active");
