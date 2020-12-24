const express = require("express");
const fs = require("fs");
const path = require("path");

let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
const app = express();
var port = process.env.PORT || 9999;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static("./public/assets"));

app.get("/api/notes", (req, res) => {
  console.log("Fetching " + notes.length + " notes.");
  notes ? res.json(notes) : res.json([{ title: "No notes." }]);
});

app.post("/api/notes", (req, res) => {
  console.log("Adding a new note." + JSON.stringify(req.body));
  let newNote = req.body;
  newNote.id = notes.length.toString();
  notes.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(notes), function (err) {
    err ? res.json("Failed to add note." + err) : res.json(notes);
  });
  res.json(notes);
});

app.delete("/api/notes/:id", (req, res) => {
  let noteId = req.params.id;
  console.log(`Deleting note with id ${noteId}`);
  let newId = 0;
  notes = notes.filter((currentNote) => {
    return currentNote.id != noteId;
  });
  for (currentNote of notes) {
    currentNote.id = newId.toString();
    newId++;
  }
  fs.writeFileSync("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.listen(port, function () {
  console.log("Server started on http://localhost:" + port);
});
