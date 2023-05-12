Example of API


### __Get all Answers to a specific Question (by Id)__

URL: `/api/questions/<id>/answers`

Method: GET

Description: Returns all answers to a specific question

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (if question not found), or `500 Internal Server Error` (if something went wrong)

Response body: JSON array of Answer objects
```
[{
    "id": 1,
    "text": "Answer 1",
    "respondent": "Respondent 1",
    "date": "2020-11-30",
    "score": 1,
    "questionId": 1
},
...
]
```

### __Add a New Answer__

URL: `/api/answers`

Method: POST

Description: Add a new answer to the list of the answers of a given question.

Request body: An object representing an answer (Content-Type: `application/json`).
```
{
    "text": "for of",
    "respondent": "Alice",
    "score": 3,
    "date": "2023-03-07",
    "questionId": 1
}
```

Response: `201 Created` (success) or `503 Service Unavailable` (generic error, e.g., when trying to insert an already existent answer by the same user). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: An object representing the inserted answer, notably with the newly assigned id by the database (Content-Type: `application/json`).
```
{
    "id": 15,
    "text": "for of",
    "respondent": "Alice",
    "score": 3,
    "date": "2023-03-07",
    "questionId": 1
}
```