# PostStream

PostStream is an undesigned social network. It is a text-based response to the majority of modern social media platforms. This is certainly not for everyone as you will be interacting with others exclusively through text posts. You will notice several features intentionally left out in order to promote meaningful engagement. We hope you enjoy something a little different!

## Text-Based Social Network
Tentative example post:

    [real name] [username] [time stamp]
    [post]

    Bill Atkinson billatkinson 2016.07.24 10:27:29
    I invented the double-click.

## Prerequisites
- [Node](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

## Setup Your Project

Download and unpack [PostStream](https://github.com/JoeKarlsson/post-stream). Or alternatively checkout from source:

    git clone git@github.com:JoeKarlsson/post-stream.git
    cd post-stream

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

Setup up Postgres, make a new data base and add your DB info to `config.json`

    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"

Run the seed scripts to enter the default data in the DB.

    sequelize db:seed:all

You will then need to setup Auth0 credentials and put them in the `.env` file. You can go to [auth0](https://auth0.com/docs/overview) for details on setting up an account.

And you should now be ready to spin up a development build of your new project:

    npm start

Navigate to [http://localhost:3000](http://localhost:3000) in your browser of choice.

## Update Your Project

In order to get an update from this repo, open your directory and type this command:

    git pull

### Important concepts
- No public metrics
  - No visible follower/following numbers
  - No visible like/dislike numbers
- No global public feed
  - No "moments" or news-related feeds
  - No trending topics to browse
- Character limit
  - Brevity
  - Accessibilty
  - Stream shows 256 characters with "read more" expandable to 2048 character limit
- No video/images/gifs
  - Unicode support 🆗
- Contextual responses
  - agree
  - agree for $reason
  - disagree
  - disagree for $reason
  - tell me more about $thought / $opinion
  - thank you for sharing
  - brilliant
- No ads or sponsored posts

## Stretch Goals
  - Possible fuzzy metrics (Your engagement is {very high} {high} {average})
  - SMS-support
  - Filtering of topics
    - Mute options for keywords
    - Signup categories - subscribe to posts from only certain categories
    - Autofilter based on keywords, hashtags
  - Keybase Verification
  - Highlight text [medium.com]
  - Permalinks - jump to comment or highlight
  - Customize appearance
    - Theme support (Github, Solarized, Tomorrow, etc.)

## Inspiration

- [Little Voices](http://www.littlevoicesapp.com)
- [Rainbow Stream](http://www.rainbowstream.org)

##Contributing
1. Fork it!
2. Create your feature branch: ```git checkout -b my-new-feature```
3. Commit your changes: ```git commit -am 'Add some feature'```
4. Push to the branch: ````git push origin my-new-feature````
5. Submit a pull request :D

## Credits
- Ray Farias
- Jacoby Young
- Joe Karlsson

--------------------

### Routes

request

    GET /post

response - Returns an array of all the posts in the DB

    [
      {
        "id": 1,
        "body": "JohnDoe131 post 1",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1
      },
      {
        "id": 2,
        "body": "JohnDoe131 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1
      },
      {
        "id": 3,
        "body": "JohnDoe131 post 3",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1
      },
      ...
    ]

request

    GET /post/{:id}

response - Returns an object of a post with :id

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

request

    GET /post/{:id}

response - Returns an object of a post with :id

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

request

    DELETE /post/{:id}

response - Returns an object with whether the command succeded

    {
      "success": true
    }

request

    PUT /post/{:id}/edit

response - Returns the updated post object

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

request

    POST /post/new

response - Returns the new post object

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

request

    GET /post/{:id}/comments

response - Returns the array of all the comments on a post

    [
      {
        "id": 2,
        "body": "JohnDoe131 comment 1 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 1,
        "PostId": 2
      },
      {
        "id": 5,
        "body": "JaneDoe343 comment 2 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 2,
        "PostId": 2
      },
      {
        "id": 8,
        "body": "JoeJoeBinks131 comment 2 post 2",
        "createdAt": "2016-07-28T01:37:36.809Z",
        "updatedAt": "2016-07-28T01:37:36.809Z",
        "UserId": 3,
        "PostId": 2
      }
    ]

request

    POST /{:PostId}/comments/{:CommentId}/newPost

response - Returns the new comment object on a post

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }

request

    PUT /{:PostId}/comments/{:CommentId}/edit

response - Returns the updated comment object on a post

    {
      "id": 1,
      "body": "JohnDoe131 post 1",
      "createdAt": "2016-07-28T01:37:36.809Z",
      "updatedAt": "2016-07-28T01:37:36.809Z",
      "UserId": 1
    }
