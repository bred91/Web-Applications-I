import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';


// API
function getContent() {
    // GET /api/content
    return new Promise((resolve, reject) => {
        fetch(URL + '/content')
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(content => resolve(content))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err => reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function getUsers() {
    // GET /api/users
    return new Promise((resolve, reject) => {
        fetch(URL + '/users', {
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(users => resolve(users))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err = reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function getSiteName() {
    // GET /api/siteName
    return new Promise((resolve, reject) => {
        fetch(URL + '/siteName')
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(siteName => resolve(siteName))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err => reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function changeSiteName(siteName) {
    // PUT /api/siteName
    return new Promise((resolve, reject) => {
        fetch(URL + '/siteName', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ siteName })
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(data => resolve(data))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err => reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}

function getPages() {
    // GET /api/pages
    return new Promise((resolve, reject) => {
        fetch(URL + '/pages')
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(pages => {
                            const mappedPages = pages.map(page => {
                                return {
                                    id: page.id, title: page.title, author: page.author, authorId: page.authorId,
                                    creationDate: dayjs(page.creationDate),
                                    publicationDate: page.publicationDate ? dayjs(page.publicationDate) : null,
                                    status: page.publicationDate == null ? "DRAFT" :
                                        dayjs(page.publicationDate).isAfter(dayjs()) ? "PROGRAMMED"
                                            : "PUBLISHED",
                                    blocks: page.blocks.map(block => { return { ...block, saved: 1 } })
                                };
                            });
                            resolve(mappedPages);
                        })
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err => reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}

function createPage(page) {
    // POST /api/pages
    const newPage = Object.assign({}, page, {
        creationDate: page.creationDate.format("YYYY-MM-DD"),
        publicationDate: page.publicationDate ? page.publicationDate.format("YYYY-MM-DD") : null
    });

    return new Promise((resolve, reject) => {
        fetch(URL + '/pages', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPage)
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(page => resolve(page))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err = reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}

function updatePage(page) {
    // POST /api/pages/:idPage
    const newPage = Object.assign({}, page, {
        creationDate: page.creationDate.format("YYYY-MM-DD"),
        publicationDate: page.publicationDate ? page.publicationDate.format("YYYY-MM-DD") : null
    });

    return new Promise((resolve, reject) => {
        fetch(URL + '/pages/' + page.id, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPage)
        })
            .then(response => {
                if (response.ok) {
                    response.json()
                        .then(page => resolve(page))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                } else {
                    response.json()
                        .then(err = reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function deletePage(idPage) {
    // DELETE /api/pages/:idPage
    return new Promise((resolve, reject) => {
        fetch(URL + '/pages/' + idPage, {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    resolve();
                } else {
                    response.json()
                        .then(err = reject(err.error))
                        .catch(() => { reject({ error: "Cannot parse server response." }) });
                }
            }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


// User API
async function logIn(credentials) {
    let response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', {
        credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

const API = {
    getSiteName, changeSiteName, getContent, getUsers,
    getPages, createPage, deletePage, updatePage,
    logIn, logOut, getUserInfo
};
export default API;