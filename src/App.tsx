import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import NoteList from "./pages/NoteList";

const App: React.FC = () => {
  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList />} />
      </Routes>
    </Container>
  );
};

export default App;
