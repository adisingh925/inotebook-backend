const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
var Note = require("../models/Note");
const { validationResult, body } = require("express-validator");

//ROUTE 1 : Get all the notes : GET api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const allNotes = await Note.find({ user: req.user.id });
    return res.status(200).json(allNotes);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

//ROUTE 2 : Delete an existing note : DELETE : api/notes/deletenote
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Resource not found!" });
    }

    if (note.user.toString() != req.user.id) {
      return res.status(403).json({ error: "Access Denied!" });
    }

    await Note.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Note successfully deleted!" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

//ROUTE 3 : Update an existing note : PUT : api/notes/updatenote
router.put(
  "/updatenote/:id",
  fetchuser,
  [
    body("title", "Title cannot be empty").trim().notEmpty(),
    body("description", "Description cannot be empty").trim().notEmpty(),
  ],
  async (req, res) => {
    const result = validationResult(req);

    //If there are errors, return Bad request and the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { title, description, tag } = req.body;

      var newNote = {};

      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }

      const note = await Note.findById(req.params.id);

      if (!note) {
        return res.status(404).json({ error: "Resource not found!" });
      }

      if (note.user.toString() != req.user.id) {
        return res.status(403).json({ error: "Access Denied!" });
      }

      await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );

      return res.status(200).json({ message: "Note successfully updated!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

//ROUTE 4 : Add a new note : POST api/notes/createnote
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Title cannot be empty").trim().notEmpty(),
    body("description", "Description cannot be empty").trim().notEmpty(),
  ],
  async (req, res) => {
    const result = validationResult(req);

    //If there are errors, return Bad request and the errors
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Note({ title, description, tag, user: req.user.id });
      await note.save();
      return res.status(200).json({ message: "Note successfully saved!" });
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error!" });
    }
  }
);

module.exports = router;
