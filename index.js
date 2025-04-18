let data = [
  {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: true,
    dueDate: "10/10/2024",
  },
  {
    userId: 1,
    id: 2,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: false,
    dueDate: "10/10/2024",
  },
  {
    userId: 1,
    id: 3,
    title: "delectus aut autem",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, repellendus.",
    completed: false,
    dueDate: "10/10/2024",
  },
];
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const date = e.target.date.value;
  const description = e.target.desc.value;
  console.log(title, date, description);
  createTodo(title, date, description);
  displayAllData(data);
  form.reset();
})
function displayAllData(data) {
  const parentDiv = document.querySelector("#todoContainer");
  parentDiv.innerHTML = "";
  const fragmentDiv = document.createDocumentFragment();
  for (const task of data) {
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

    itemDiv.className = `p-3 rounded-lg border-2 flex items-start gap-4 transition-all duration-500 ease-in-out ${
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

    deleteBtn.addEventListener("click", () => { 
      deleteTodo(task.id);
    });
    checkBox.addEventListener("change", () => {
      markComplete(task.id);
    })
    actionDiv.append(editBtn);
    actionDiv.append(deleteBtn);
    contentDiv.appendChild(tasktitle);
    contentDiv.appendChild(dueDate);
    contentDiv.appendChild(desc);
    itemDiv.append(checkBox);
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
    displayAllData(data)
  }
}
function singleTodo(id) {
  const todo = data.find((todo) => todo.id === id);
}

function createTodo(title, date, description, completed = false,userId=1) {
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
    return todo
  });
  displayAllData(data);
}

function sortByDate() {
  data.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function filterCompleted() {
  data.filter((todo) => todo.completed);
}
function filterUncompleted() {
  data.filter((todo) => !todo.completed);
}


