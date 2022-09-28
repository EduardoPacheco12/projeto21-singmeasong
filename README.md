<div align="center">
  <a href="https://github.com/DarlonGomes/sing-a-song-test">
    <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f399-fe0f.svg" alt="JavaScriptLogo" width="100">
  </a>

  <h3 align="center">Sing me a Song</h3>
  <div align="center">
    21th Project of Driven Education
    <br />
  </div>
  <div align="center">
    A project for testing an existing application
    <br />
  </div>
</div>

<div align="center">
  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white" height="30px" />

  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

<!-- Table of Contents -->

<div align="center" style="margin-top: 50px">
    <h1> Project Guide</h1>
</div>

## Features

- Get the recommendations list
- Create a recommendation
- Upvote and Downvote any recommendation
- Remove a song when the score is lower than -5
- Get the top list
- Get a random recommendation

</br>

<div align="center" >
    <h1> API Reference</h1>
</div>

### Create a song recommendation

```http
POST /recommendations
```

#### Request:

| Body          | Type     | Description                                 |
| :------------ | :------- | :------------------------------------------ |
| `name`        | `string` | **Required**.                               |
| `youtubeLink` | `string` | **Required**. must conform to youtube regex |

####

</br>

#

### Upvote a song

```http
POST /recommendations/:id/upvote
```

#### Request:

| Params | Type      | Description   |
| :----- | :-------- | :------------ |
| `id`   | `integer` | **Required**. |

#

### Downvote a song

```http
POST /recommendations/:id/downvote
```

#### Request:

| Params | Type      | Description   |
| :----- | :-------- | :------------ |
| `id`   | `integer` | **Required**. |

#

### Gather recommendations

```http
GET /recommendations
```

#### Response:

```json
[
  {
    "id": 1,
    "name": " I Was Never There - The Weeknd feat. Gesaffelstein",
    "youtubeLink": "https://www.youtube.com/watch?v=OlStmta0Vh4&ab",
    "score": 9
  },
  {
    "id": 2,
    "name": "Die For You - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=mTLQhPFx2nM&ab",
    "score": 10
  },
  {
    "id": 3,
    "name": "Save Your Tears - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=XXYlFuWEuKI&ab",
    "score": 13
  }
]
```

#

### Get a recommendation by id

```http
GET /recommendations/:id
```

#### Request:

| Params | Type      | Description   |
| :----- | :-------- | :------------ |
| `id`   | `integer` | **Required**. |

### Example:

`id: 3`

#### Response:

```json
[
  {
    "id": 3,
    "name": "Save Your Tears - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=XXYlFuWEuKI&ab",
    "score": 13
  }
]
```

#

### Get a random recommendation

```http
GET /recommendations/random
```

#### Response:

```json
[
  {
    "id": 2,
    "name": "Die For You - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=mTLQhPFx2nM&ab",
    "score": 10
  }
]
```

#

### Get a ranked list of song recommendations

```http
GET /recommendations/top/:amount
```

#### Request:

| Params   | Type      | Description   |
| :------- | :-------- | :------------ |
| `amount` | `integer` | **Required**. |

### Example:

`amount: 3`

#### Response:

```json
[
  {
    "id": 3,
    "name": "Save Your Tears - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=XXYlFuWEuKI&ab",
    "score": 13
  },
  {
    "id": 2,
    "name": "Die For You - The Weeknd",
    "youtubeLink": "https://www.youtube.com/watch?v=mTLQhPFx2nM&ab",
    "score": 10
  },
  {
    "id": 1,
    "name": " I Was Never There - The Weeknd feat. Gesaffelstein",
    "youtubeLink": "https://www.youtube.com/watch?v=OlStmta0Vh4&ab",
    "score": 9
  }
]
```

#

## Run Locally

Clone the project

```bash
    git clone https://github.com/EduardoPacheco12/projeto21-singmeasong.git
```

Go to the project directory

```bash
    cd sing-me-a-song
```

#

### Back-end

Go to the back-end directory

```bash
    cd back-end
```

Install dependencies

```bash
    npm install
```

Run prisma migrations

```bash
     npx prisma migrate dev
```

Start the server

```bash
     npm run start
```

Start Jest test

```bash
    npm run test
```

#

### Front-end

<br/>

Go to the front-end directory

```bash
    cd front-end
```

Install dependencies

```bash
    npm install
```

Start the server

```bash
    npm start
```

Start Cypress

```bash
    npx cypress open
```

</br>

#

## Lessons Learned

- Integration tests(Jest)
- Unit tests(Jest)
- E2E tests(Cypress)

#

## Acknowledgements

- [Badges for Github](https://dev.to/envoy_/150-badges-for-github-pnk)
- [README inspiration](https://github.com/DarlonGomes/sing-a-song-test)

#

## Authors

- Eduardo Pacheco - Driven Education
  <br/>
