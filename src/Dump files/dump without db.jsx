import { useState } from "react";
import { useEffect } from "react";
import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore"
import { collection, onSnapshot } from "firebase/firestore";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import bgImage from './assets/bronish bg.jpg'
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import "./App.css";

function App() {
  // These states doesnt give you a persistent data because when the page is refreshed,
  // all the data on the screen is gone. To have a persistent data, you need some form of
  // database, like the firebase.
  // To use firebase, goto: console.firebase.google.com
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(
        snapshot.docs.map((doc) => ({ id: doc.id, todo: doc.data().todoName }))
      );
    });

    return () => unsubscribe();
  }, []);

  const addTodo = async () => {
    try {
      if (input.trim() !== "") {
        setTodos([
          ...todos,
          { id: new Date(), todoName: input, completed: true },
        ]);
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const setEdit = (index) => {
    setInput(todos[index].todoName); //Brings the name of the todo to the input field for
    setEditIndex(index); //for editing once the edit button is clicked
  };

  const updateTodo = async () => {
    try {
      if (input.trim() !== "") {
        const updatedTodos = [...todos];
        updatedTodos[editIndex].todoName = input;
        setTodos(updatedTodos);
        setEditIndex(-1);
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const removeTodo = async (id) => {
    let filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4 bg-custom-background bg-center bg-cover">
        <div className="bg-amber-100 p-6 rounded shadow-md w-full max-w-lg lg:w-1/4">
          <h1 className="text-3xl font-bold text-center mb-4">Doist App</h1>

          <div className=" flex mt-10">
            <input
              type="text"
              className="py-2 px-4 border rounded w-full"
              placeholder="Add a Todo"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={editIndex === -1 ? addTodo : updateTodo}
              className="bg-gradient-to-r from-blue-400 to-blue-600 py-2 px-4 text-white rounded"
            >
              {editIndex === -1 ? <FaPlus /> : <FaPencilAlt />}
            </button>
          </div>
        </div>

        {todos.length > 0 && (
          <div className="bg-white-600 p-3 shadow-md rounded w-full max-w-lg lg:w-1/4">
            <ul>
              {/* Note that the index below is the same thing as todo.id */}
              {todos.map((todo, index) => (
                <li
                  key={index}
                  className="flex flex-row items-center justify-between p-3 rounded bg-white shadow-md mb-3"
                >
                  <span
                    className="text-lg"
                    style={{ textDecoration: todo.completed && "line-through" }}
                  >
                    {todo.todoName}
                  </span>
                  <div className="">
                    <button
                      onClick={() => setEdit(index)}
                      className="mx-2 p-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded hover:from-gray-500 hover:to-gray-700"
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="p-2 bg-gradient-to-r from-rose-500 to-rose-700 text-white rounded hover:from-rose-600 hover:to-rose-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
