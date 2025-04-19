let data = [
  // {
  //   userId: 1,
  //   id: 1,
  //   title: "delectus aut autem",
  //   completed: false,
  //   dueDate: "2023-10-01",
  // },
  // {
  //   userId: 1,
  //   id: 2,
  //   title: "delectus aut autem",
  //   completed: false,
  //   dueDate: "2025-10-01",
  // },
];

const now = new Date();
const thirtyDaysFromNow = new Date();
thirtyDaysFromNow.setDate(now.getDate() + 30);

fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((json) => {
    data = json.slice(0, 10).map((todo) => ({
      ...todo,
      dueDate: getRandomDate(now, thirtyDaysFromNow)
        .toISOString()
        .split("T")[0],
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }));
    displayAllData(data);
  })
  .catch((error) => console.error("Error fetching data:", error));
let isEditMode = false;
let editId = null;

const form = document.querySelector("form");
const addTodoBtn = document.querySelector("#addTodoBtn");
const addBtn = document.querySelector("#addBtn");
const formContainer = document.querySelector("#formContainer");
const closeFormBtn = document.querySelector("#closeFormBtn");
const filterDropdown = document.querySelector("#filterDropdown");
const sortDiv = document.querySelector("#sort");
const ascIcon = document.querySelector("#ascIcon");
const descIcon = document.querySelector("#descIcon");
const formTitle = document.querySelector("#formTitle");
const errorParagraph = document.querySelector("#error");

closeFormBtn.addEventListener("click", () => {
  form.reset();
  errorParagraph.classList.add("hidden");
  isEditMode = false;
  editId = null;
  formContainer.classList.add("hidden");
});

addTodoBtn.addEventListener("click", () => {
  isEditMode = false;
  editId = null;
  addBtn.textContent = "Add";
  formTitle.textContent = "New Task";
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
  errorParagraph.classList.add("hidden");
  const title = e.target.title.value;
  const date = e.target.date.value;
  const description = e.target.desc.value;
  if (isFormInvalid()) {
    errorParagraph.textContent = isFormInvalid();
    errorParagraph.classList.remove("hidden");
    return;
  }
  if (isEditMode) {
    editTodo({ title, dueDate: date, description, id: editId });
  } else {
    createTodo(title, date, description);
  }
  form.reset();
  formContainer.classList.add("hidden");
  displayAllData(data);
});

function startEdit(todo) {
  isEditMode = true;
  editId = todo.id;
  form.reset();
  addBtn.textContent = "Save";
  formTitle.textContent = "Edit Task";
  form.title.value = todo.title;
  form.date.value = formatDateForInput(todo.dueDate);
  form.desc.value = todo.description;
  formContainer.classList.remove("hidden");
}
function editTodo({ title, dueDate, description, id }) {
  data = data.map((todo) => {
    if (todo.id === editId) {
      todo.title = title;
      todo.dueDate = dueDate;
      todo.description = description;
    }
    return todo;
  });
  isEditMode = false;
  editId = null;
}
sortDiv.addEventListener("click", () => {
  ascIcon.classList.toggle("hidden");
  descIcon.classList.toggle("hidden");
  const sortedItems = sort();
  displayAllData(sortedItems);
});

function sort(items = data) {
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
      task.completed ? "bg-cyan-200 border-cyan-400" : "bg-white"
    }`;
    tasktitle.className = "font-bold capitalize";
    dueDate.className = "text-xs text-gray-400";
    checkBox.className = "w-5 h-5 mb-1 cursor-pointer";
    desc.className = "mt-2";
    actionDiv.className = "actions text-sm mx-auto flex gap-3";
    editBtn.className =
      "editBtn bg-gray-200 px-4 py-1 rounded-md hover:bg-gray-400";
    deleteBtn.className = "bg-red-200 px-4 py-1 rounded-md hover:bg-red-400";
    contentDiv.className = "flex-1";
    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";
    tasktitle.textContent = task.title;
    dueDate.textContent = task.dueDate.split("-").reverse().join("/");
    desc.textContent = task.description;
    if (isDateInPast(new Date(task.dueDate)) && !task.completed) {
      dueDate.classList.add("text-red-500");
    }
    editBtn.addEventListener("click", () => {
      startEdit(task);
    });
    deleteBtn.addEventListener("click", () => {
      deleteTodo(task.id);
    });
    checkBox.addEventListener("change", () => {
      markComplete(task.id);
    });
    contentDiv.append(checkBox);
    contentDiv.appendChild(tasktitle);
    contentDiv.appendChild(dueDate);
    contentDiv.appendChild(desc);
    itemDiv.appendChild(contentDiv);
    if (!task.completed) {
      actionDiv.append(editBtn);
      actionDiv.append(deleteBtn);
    } else {
      actionDiv.append(deleteBtn);
    }
    itemDiv.appendChild(actionDiv);
    fragmentDiv.appendChild(itemDiv);
  }

  parentDiv.appendChild(fragmentDiv);
}

// displayAllData(data);

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
  data.push(todo);
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

function formatDateForInput(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function isFormInvalid() {
  const title = form.title.value;
  const date = form.date.value;
  const description = form.desc.value;
  if (!title || !date || !description) {
    return "Please fill all the fields";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(form.date.value);
  selectedDate.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    return "Date can not be in the past";
  }
  return null;
}

function isDateInPast(dateToCheck) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateToCheck.setHours(0, 0, 0, 0);

  return dateToCheck < today;
}
function getRandomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  date.setHours(0, 0, 0, 0);
  return date;
}
