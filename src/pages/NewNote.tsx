import React from "react";
import NoteForm from "../components/NoteForm";

const NewNote: React.FC = () => {
  return (
    <>
      <h1 className="mb-4">New Note</h1>
      <NoteForm />
    </>
  );
};

export default NewNote;
