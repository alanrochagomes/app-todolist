import React from "react";
import "./App.css";
import TodoList from "./TodoList";
import Header from "./Header";

function App() {
  return (
    <div className="App">
      <TodoList /> {/* Componente principal da sua aplicação */}
      <Header />
    </div>
  );
}

export default App;
