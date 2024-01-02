import React, { useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NoteList from "./pages/NoteList";
import NewNote from "./pages/NewNote";
import useLocalStorage from "./hooks/useLocalStorage";
import { v4 as uuidV4 } from "uuid";
import NoteLayout from "./components/NoteLayout";
import Note from "./pages/Note";
import EditNote from "./pages/EditNote";

export type Tag = {
  id: string;
  label: string;
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Note = {
  id: string;
} & NoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type RawNote = {
  id: string;
} & RawNoteData;

export type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
};

const App: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes: RawNote[]) => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) }];
    });
  };

  const onUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes: RawNote[]) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  };

  const onDeleteNote = (id: string) => {
    setNotes((prevNotes: RawNote[]) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  const addTag = (tag: Tag) => {
    setTags((prevTags: Tag[]) => [...prevTags, tag]);
  };

  const updateTag = (id: string, label: string) => {
    setTags((prevTags: Tag[]) => {
      return prevTags.map((tag: Tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  };

  const deleteTag = (id: string) => {
    setTags((prevTags: Tag[]) => {
      return prevTags.filter((tag: Tag) => tag.id !== id);
    });
  };

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              notes={notesWithTags}
              availableTags={tags}
              onUpdateTag={updateTag}
              onDeleteTag={deleteTag}
            />
          }
        />
        <Route
          path="/new"
          element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />}
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
