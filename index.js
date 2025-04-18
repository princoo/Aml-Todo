let data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: true,
    dueDate: "12/10/2020",
  },
  {
    userId: 1,
    id: 2,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: false,
    dueDate: "10/03/2020",
  },
  {
    userId: 1,
    id: 3,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: false,
    dueDate: "10/10/2023",
  },
];
const form = document.querySelector("form");
const addTodoBtn = document.querySelector("#addTodoBtn");
const formContainer = document.querySelector("#formContainer");
const closeFormBtn = document.querySelector("#closeFormBtn");
const filterDropdown = document.querySelector("#filterDropdown");
const sortDiv = document.querySelector("#sort");
const ascIcon = document.querySelector("#ascIcon");
const descIcon = document.querySelector("#descIcon");

closeFormBtn.addEventListener("click", () => {
  formContainer.classList.add("hidden");
});

addTodoBtn.addEventListener("click", () => {
  formContainer.classList.remove("hidden");
});

filterDropdown.addEventListener("change", (e) => {
  const value = e.target.value;
  if (value === "all") displayAllData(data);

  if (value === "completed") filterCompleted();

  if (value === "incomplete") filterUncompleted();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const date = e.target.date.value;
  const description = e.target.desc.value;
  createTodo(title, date, description);
  displayAllData(data);
  form.reset();
  formContainer.classList.add("hidden");
});


sortDiv.addEventListener("click", () => {
  ascIcon.classList.toggle("hidden");
  descIcon.classList.toggle("hidden");
  const sortedItems = sort();
  displayAllData(sortedItems);
});

function sort (items = data){
  const isAscending = ascIcon.classList.contains("hidden");
  if (!isAscending) {
    items = sortByDateAsc(items);
  } else {
    items = sortByDateDesc(items);
  }
  return items;
}
function displayAllData(todos = data) {
  const parentDiv = document.querySelector("#todoContainer");
  parentDiv.innerHTML = "";
  if (todos.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "text-center text-gray-500";
    emptyDiv.textContent = "Empty List";
    parentDiv.appendChild(emptyDiv);
    return;
  }
  todos = sort(todos);
  const fragmentDiv = document.createDocumentFragment();
  for (const task of todos) {
    const itemDiv = document.createElement("div");
    const contentDiv = document.createElement("div");
    const actionDiv = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const tasktitle = document.createElement("h3");
    const dueDate = document.createElement("span");
    const desc = document.createElement("p");
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;

    itemDiv.className = `p-3 rounded-lg border-2 flex items-start justify-between gap-4 transition-all duration-500 ease-in-out ${
      task.completed ? "bg-green-200" : "bg-white"
    }`;
    tasktitle.className = "font-medium capitalize";
    dueDate.className = "text-xs text-gray-400";
    checkBox.className = "w-5 h-5";
    actionDiv.className = "actions text-sm mx-auto flex gap-3";
    editBtn.className = "bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-400";
    deleteBtn.className = "bg-red-200 px-4 py-1 rounded-md hover:bg-red-400";
    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";
    tasktitle.textContent = task.title;
    dueDate.textContent = task.dueDate;
    desc.textContent = task.description;
    contentDiv.className = "flex-1";

    deleteBtn.addEventListener("click", () => {
      deleteTodo(task.id);
    });
    checkBox.addEventListener("change", () => {
      markComplete(task.id);
    });
    actionDiv.append(editBtn);
    actionDiv.append(deleteBtn);
    contentDiv.append(checkBox);
    contentDiv.appendChild(tasktitle);
    contentDiv.appendChild(dueDate);
    contentDiv.appendChild(desc);
    // itemDiv.append(checkBox);
    itemDiv.appendChild(contentDiv);
    if (!task.completed) {
      itemDiv.appendChild(actionDiv);
    }
    fragmentDiv.appendChild(itemDiv);
  }

  parentDiv.appendChild(fragmentDiv);
}
displayAllData(data);

function updateTodo(id, data) {
  const todo = data.find((todo) => todo.id === id);
  if (todo) {
    todo.title = title;
    todo.date = date;
    todo.completed = completed;
  }
  data.splice(index, 1, todo);
}

function deleteTodo(id) {
  const index = data.findIndex((todo) => todo.id === id);

  if (index !== -1) {
    data.splice(index, 1);
    displayAllData(data);
  }
}
function singleTodo(id) {
  const todo = data.find((todo) => todo.id === id);
}

function createTodo(title, date, description, completed = false, userId = 1) {
  const todo = {
    userId,
    id: data.length + 1,
    title,
    dueDate: date,
    description,
    completed,
  };
  data.unshift(todo);
}

function markComplete(id) {
  data = data.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
    return todo;
  });
  const event = new Event("change");
  filterDropdown.dispatchEvent(event);
  // displayAllData(data);
}

function sortByDateAsc(items) {
  return items.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
}
function sortByDateDesc(items) {
  return items.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
}

function filterCompleted() {
  const completed = data.filter((todo) => todo.completed);
  displayAllData(completed);
}
function filterUncompleted() {
  const unCompleted = data.filter((todo) => !todo.completed);
  displayAllData(unCompleted);
}
