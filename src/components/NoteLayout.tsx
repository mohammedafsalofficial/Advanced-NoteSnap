import React from "react";
import { Note } from "../App";
import { Navigate, Outlet, useParams } from "react-router-dom";

type NoteLayoutProps = {
  notes: Note[];
};

const NoteLayout: React.FC<NoteLayoutProps> = ({ notes }) => {
  const { id } = useParams();

  const note = notes.find((note) => note.id === id);

  if (note == null) {
    return <Navigate to="/" replace />;
  }

  return <Outlet context={note} />;
};

export default NoteLayout;
