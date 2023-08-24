let btnShowUsers = document.getElementById('btnShowUsers')
let usersInfo = document.getElementById('usersInfo')
const URL = "https://reqres.in/api/users?delay=3"

const useLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const readLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

const getDataApi = (url) => {
    return fetch(url)
        .then(response => response.json())
        .then(data => data.data)
        .catch(error => {
            throw new Error(error)
        })
}

const readUsers = async () => {
    try {
        let { time = 0, data = [] } = readLocalStorage("users") || {};
        if (time > Date.now()) return showData(data);

        showSpinner()
        const users = await getDataApi(URL);
        useLocalStorage("users", {
            data: users,
            time: Date.now() + 60000,
        });
        showData(users);
    } catch (error) {
        if (error instanceof Error) {
            showError(error.message)
        }
    }
}

function cleanData() {
    usersInfo.innerHTML = ''
}

function createTable(data) {
    const table = document.createElement("table");
    const tableHead = document.createElement("thead");
    const tableBody = document.createElement("tbody");

    table.classList.add("table", "table-bordered", "text-white", "text-center", "table-dark");
    tableBody.classList.add("align-middle");

    tableHead.innerHTML = `
        <tr class="text-center">
          <th scope="col">id</th>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">e-mail</th>
          <th scope="col" class="d-none d-sm-table-cell">Image</th>
        </tr>
      `;
    data.forEach((user) => tableBody.innerHTML += `
        <tr>
          <td>${user.id}</td>
          <td>${user.email}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td class="d-none d-sm-table-cell"><img src="${user.avatar}" alt="avatar" class="rounded-circle " /></td>
        </tr>`)

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    return table
}

function showData(data) {
    cleanData()
    const table = createTable(data)
    usersInfo.appendChild(table)
}

function showSpinner() {
    cleanData()
    const spinner = document.createElement('div')
    spinner.innerHTML = `
    <div class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`
    
    usersInfo.appendChild(spinner)
}

function showError(message) {
    cleanData()
    const error = document.createElement("div");
    error.innerHTML = `
        <div class="text-center">
          <p class="text-danger fw-bold">${message}</p>
        </div>`;
    usersInfo.appendChild(error)
}

btnShowUsers.addEventListener('click', readUsers)