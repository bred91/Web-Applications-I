# `Lab 8`

## APIs
Hereafter, we report the designed HTTP APIs, also implemented in the project.

### __Retrieve List Films__
GET `/api/films` <br>
Returns the list of all films in the database filtered by filterName <br>
Request body: None <br>
Request query parameters: `?filter=filterName` filter name of the filter to apply (filter-all, filter-favorite, filter-best, filter-lastmonth, filter-unseen)<br>
Response: `200 OK` (success) <br>
Response body: An array of objects, each describing a film.
```
[{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
},
...
]
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`400 Bad Request` (invalid filter name) <br>

### __Retrieve a Film by its Id__
GET `/api/films/:id` <br>
Returns the film with the specified id <br>
Request body: None <br>
Response: `200 OK` (success) <br>
Response body: An object describing the film.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`404 Not Found` (film not found) <br>
`400 Bad Request` (invalid id eg. not a number) <br>

### __Add a Film__
POST `/api/films` <br>
Adds a new film to the database <br>
Request body: An object describing the film to add.
```
{
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Response: `201 Created` (success) <br>
Response body: An object describing the film added.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`400 Bad Request` (invalid film data) <br>

### __Update a Film__
PUT `/api/films/:id` <br>
Updates the film with the specified id <br>
Request body: An object describing the film to update.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Response: `200 OK` (success) <br>
Response body: An object describing the film updated.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`404 Not Found` (film not found) <br>
`400 Bad Request` (invalid id eg. not a number) <br>

### __Update a Rating of a Film__
PUT `/api/films/:id/rating` <br>
Updates the rating of the film with the specified id <br>
Request body: An object describing the film to update.
```
{
    "rating": 5
}
```
Response: `200 OK` (success) <br>
Response body: An object describing the film updated.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": false,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`404 Not Found` (film not found) <br>
`400 Bad Request` (invalid id eg. not a number) <br>

### __Update a Favorite of a Film__
PUT `/api/films/:id/favorite` <br>
Updates the favorite of the film with the specified id <br>
Request body: An object describing the film to update.
```
{
    "favorite": true
}
```
Response: `200 OK` (success) <br>
Response body: An object describing the film updated.
```
{
    "id": 1,
    "title": "The Shawshank Redemption",
    "favorite": true,
    "watchdate": "2023-02-28",
    "rating": 5,
    "user": 2
}
```
Error: <br>
`500 Internal Server Error` (generic error) <br>
`404 Not Found` (film not found) <br>
`400 Bad Request` (invalid id eg. not a number) <br>


### __Delete a Film__
DELETE `/api/films/:id` <br>
Deletes the film with the specified id <br>
Request body: None <br>
Response: `200 OK` (success) <br>
Response body: None <br>
Error: <br>
`500 Internal Server Error` (generic error) <br>
`404 Not Found` (film not found) <br>
`400 Bad Request` (invalid id eg. not a number) <br>