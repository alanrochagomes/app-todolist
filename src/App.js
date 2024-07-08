import React from "react";
import "./App.css";
import TodoList from "./TodoList";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <div className="App">
      <TodoList /> {/* Componente principal da sua aplicação */}
      <Header />
      <Footer />
    </div>
  );
}

export default App;
