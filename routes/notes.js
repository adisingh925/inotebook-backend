const express = require("express");
const router = express.Router();
var fetchuser = require("../Middleware/fetchuser");
var Note = require("../models/Note");
const { validationResult, body } = require("express-validator");

//ROUTE 1 : Get all the notes : GET api/notes/fetchallnotes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const allNotes = await Note.find({ user: req.user.id });
    return res
      .status(200)
      .json({ msg: "Data Successfully Fetched!", data: allNotes, code: 1 });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

//ROUTE 2 : Delete an existing note : DELETE : api/notes/deletenote
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Resource not found!", code: -1 });
    }

    if (note.user.toString() != req.user.id) {
      return res.status(403).json({ msg: "Access Denied!", code: -1 });
    }

    await Note.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Note successfully deleted!", code: 1 });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
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
      return res.status(400).json({ errors: result.array(), code: -1 });
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
        return res.status(404).json({ msg: "Resource not found!", code: -1 });
      }

      if (note.user.toString() != req.user.id) {
        return res.status(403).json({ msg: "Access Denied!", code: -1 });
      }

      await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );

      return res
        .status(200)
        .json({ msg: "Note successfully updated!", code: 1 });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
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
      return res.status(400).json({ errors: result.array(), code: -1 });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Note({ title, description, tag, user: req.user.id });
      await note.save();
      return res
        .status(200)
        .json({ data: note, code: 1, msg: "Note successfully added!" });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

//ROUTE 5 : read a note in new screen it will also be used for sharing of the notes
router.get("/readnote/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ msg: "Resource not found!", code: -1 });
    }

    return res
      .status(200)
      .json({ msg: "Note successfully Fetched!", data: note, code: 1 });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

module.exports = router;
