import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import "./App.css";
import { db } from "./firebase"; // Import your Firebase configuration
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  // Fetch todos from Firebase on component mount
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "todos"), (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, [db]); // Dependency array ensures the effect runs only once on mount

  // Add Todo from state, doesnt persist to the db
  // const addTodo = async () => {
  //   try {
  //     if (input.trim() !== "") {
  //       setTodos([...todos, { id: new Date(), todoName: input }]);
  //       setInput("");
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // Persist Add Todo to db
  const addTodo = async () => {
    try {
      if (input.trim() !== "") {
        await addDoc(collection(db, "todos"), { todoName: input });
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // ... rest of your code for setting edit, updating, and removing todos ...
  const setEdit = (index) => {
    setInput(todos[index].todoName); //Brings the name of the todo to the input field for
    setEditIndex(index); //for editing once the edit button is clicked
  };

  // Update Todo from state, doesnt persist to the db
  // const updateTodo = async () => {
  //   try {
  //     if (input.trim() !== "") {
  //       const updatedTodos = [...todos];
  //       updatedTodos[editIndex].todoName = input;
  //       setTodos(updatedTodos);
  //       setEditIndex(-1);
  //       setInput("");
  //     }
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };

  // Update Todo Persisted to the db
  const updateTodo = async () => {
    try {
      if (input.trim() !== "") {
        // Get the document ID of the todo to update
        const todoId = todos[editIndex].id;

        // Update the document in Firestore
        await updateDoc(doc(db, "todos", todoId), {
          todoName: input,
        });

        setEditIndex(-1);
        setInput("");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Delete Todo from state, doesnt persist to the db
  // const removeTodo = async (id) => {
  //   let filteredTodos = todos.filter((todo) => todo.id !== id);
  //   setTodos(filteredTodos);
  // };

  // Delete Todo persisted tot the db
  const removeTodo = async (id) => {
    try {
      // Get the document reference
      const todoRef = doc(db, "todos", id);

      // Delete the document from Firestore
      await deleteDoc(todoRef);
    } catch (error) {
      console.error(error.message);
    }
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
                  key={todo.id}
                  className="flex flex-row items-center justify-between p-3 rounded bg-white shadow-md mb-3"
                >
                  <span className="text-lg">{todo.todoName}</span>
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
