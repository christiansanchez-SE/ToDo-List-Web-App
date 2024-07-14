// import { useState } from "react";
import React, { useState, useReducer } from "react";
import "./App.css";
import todoList from "./data/ToDoList.jsx";

// reducer function that takes 2 arguments (state, action)
// state represents the current state of the app
// action represents the action that should be performeed to change the state
const reducer = (state, action) => {
  // The part below checks the type of action being dispatched
  // If the action type is COMPLETE, it means it will want to mark a todo item complete
  switch (action.type) {
    // Below map method is being use on the state array
    //This method iterates over each item in the array and returns a new array with the modified items
    case "COMPLETE":
      // Within the map function we are checking if the id of the current todo item matches the id of specified in the action
      return state.map((todo) => {
        if (todo.id === action.id) {
          // If the id matches its creating a new object using the spread operator ('...todo') to copy all properties of the todo item [it copies the original element and unpacks the properties]
          // Then itll toggle the complete property to its opposite value ('!todo.complete')
          // This toggles the completion status of the todo item
          return { ...todo, complete: !todo.complete };
        } else {
          return todo;
        }
      });

    case "ADD":
      // Add the new todo to the state
      // It takes the current 'state' and adds the new todo object 'action.todo' to its using the spread operator '...'
      // This creates a new array containing all the existing todos plus the new todo
      return [action.todo, ...state];

    case "EDIT":
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, editing: !todo.editing };
        } else {
          return todo;
        }
      });

    // Update action was added
    // This updates the task of the todo item with the new task provided action.task
    // It sets editing to false because after updating, its assuming the editing is done
    case "UPDATE":
      return state.map((todo) => {
        if (todo.id === action.id) {
          return { ...todo, task: action.task, editing: false };
        } else {
          return todo;
        }
      });

    case "DELETE":
      // state is the current list of todos
      // filter() is a function that works on arrays. It will go through each item and decides whether to keep it or delete it
      // (todo) => todo.id !== action.id is a small callback function that is applied to each item in the list
      // (todo) represents each individual item
      // todo.id !== action.id is a condition. Its expressing that if this todo item is not the same as the id that it wants to delete, then keep it
      // When state.filter is called, its going through each todo item in the list, if the id matches the id will be deleted
      return state.filter((todo) => todo.id !== action.id);

    default:
      return state;
  }
};

function App() {
  // This is a useReducer hook to manage state in my component
  // We are initalizing the todos state by calling useReducer with our reducer fuction and the inital todoList array
  // todos will hold the current state of our todo list
  // dispatch is a function that we can use to send actions to our reducer, trigger state updates
  const [todos, dispatch] = useReducer(reducer, todoList);

  // Added a new state variable editedText to hold the text that is being edited in the todo item
  const [editedText, setEditedText] = useState("");

  const [addTask, setAddTask] = useState("");

  // This function takes a todo object as an argument
  // When called, it dispatches an action of type "COMPLETE" to the reducer, along with the todo item that needs to be marked as complete
  const handleComplete = (todo) => {
    const completed = "Completed";
    dispatch({ type: "COMPLETE", id: todo.id, todo: completed });
  };

  const handleAdd = () => {
    // Generate a new unique id for the new task
    // It counts the number if existing tasks 'todo.length' and adds 1 to it ti create a new id
    const newId = todos.length + 1;
    // Create a new todo object with the provided task and a default title
    // It includes new id, a default title, the task content taken from addTask state(what the user types into the input field) and default values for completion
    const newTodo = {
      id: newId,
      title: "Todo:",
      task: addTask,
      complete: false,
      editing: false,
    };
    // Dispatch an "ADD" action with the new todo
    // This tells the reducer to add this new todo to the existing list of todos
    dispatch({ type: "ADD", todo: newTodo });
    // Clear the input field after adding the task
    setAddTask("");
  };

  // When the edit button is clicked, it dispatches an EDIT action to toggle the editing property of the todo item
  // It also sets the editedText state to the current task text. This ensures that the input field shows the current task text when editing starts
  const handleEdit = (todo) => {
    dispatch({ type: "EDIT", id: todo.id });
    setEditedText(todo.task); // Set the initial edited text to the current task
  };

  //When save is clicked, it dispatches the UPDATE action with the edited text 'editedText' and updates the task of the todo item
  const handleUpdate = (todo) => {
    dispatch({ type: "UPDATE", id: todo.id, task: editedText });
  };

  const handleDelete = (todo) => {
    dispatch({ type: "DELETE", id: todo.id });
  };

  return (
    <div className="app">
      <div className="createTodo">
        <h1 className="mainTitle">Create A Todo List</h1>
        {/* - - - - - - - First label of adding task - - - - - - - */}
        <div>
          <label className="search">
            <input
              className="searchTerm"
              type="text"
              placeholder="Add task"
              value={addTask}
              onChange={(e) => setAddTask(e.target.value)}
            />
            <button className="mainBtn" onClick={handleAdd}>
              <span className="addBtn">Add</span>
            </button>
          </label>
        </div>
      </div>

      <div className="activeList">
        <h1>Todo List:</h1>

        {/* - - - - - - - Second label of marking the task COMPLETE - - - - - - - */}
        {/* Map is being used to iterate over the todos array
          For each todo item, its returning a JSX element */}
        {todos.map((todo) => (
          // Each todo item is wrapped in a <div> element with a unique key attribute set to the todo items id
          // This is required by react for efficient rendering
          <div className="compTaskContainer" key={todo.id}>
            {/* Within each <div> we have a <label> element containg an <input> checkbox
                The "checked" attribute of the checkbox is set to the "complete" property of the todo item
                  This ensures that the checkbox reflects the completion status of the todo item
                    The "onChange" event handler is triggered when the checkbox is clicked
                      It calls the "handleComplete" function, passing the current todo item as an argument */}
            <label className="compTask">
              {/* Check if the todo item is complete */}
              {todo.complete ? (
                <>
                  {/* If completed, display the checkbox as checked */}
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => handleComplete(todo)}
                  />
                  {/* Display the "Complete" text */}
                  <div className="checkMark"></div>
                  <div>Completed</div>
                </>
              ) : (
                <>
                  {/* If not completed, display the checkbox as unchecked */}
                  <input
                    className="checkbox"
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => handleComplete(todo)}
                  />
                  {/* Display the "Complete" text */}
                  <div className="checkMark"></div>
                  {todo.complete ? <div>Completed</div> : null}
                </>
              )}
            </label>

            {/* - - - - - - - Third label of editing task - - - - - - - */}
            <div className="todoContent">
              {/* Conditionally render todo text or input field */}
              {/* This determines whether to show the Edit or the Save button based on whether the todo item is being editied 'todo.editing'
                  If its being edited it shows the Save button otherwise it shows the Edit button */}
              {todo.editing ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <>
                  <span className="todoTitle">{todo.title}</span>
                  <span className="todoTask">{todo.task}</span>
                </>
              )}
            </div>

            {todo.editing ? (
              // Used a ternary statement, if handleUpdate button doesnt meet the requirement then it will not show  
              <button className="btn" onClick={() => handleUpdate(todo)}>
                <span className="saveBtn">Save</span>
              </button>
            ) : (
              <button className="btn" onClick={() => handleEdit(todo)}>
                <span className="editBtn">Edit</span>
              </button>
            )}

            {/* - - - - - - - Fourth label of deleting task - - - - - - - */}
            {/* todo.complete ? (...) : (...) This is a conditional(ternary) operator in js determining whether the logic is true or false
                  If todo.complete is true, the first part before the : is executed
                  If todo.complete is false, the second part before the : is executed */}
            {todo.complete ? (
              // When onClick is clciked the handleDelete function is called with the todo object as an argument
              // It renders the button to true
              // Used a ternary statement, if handleDelete button doesnt meet the requirement then it will be disabled 
              <button className="btn" onClick={() => handleDelete(todo)}>
                <span className="deleteBtn">Delete</span>
              </button>
            ) : (
              <button className="disDeleteBtn" disabled>
                <span className="addDeleteBtn">Delete</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;