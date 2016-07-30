import React, { Component } from 'react';
import NewsStream from './components/NewsStream';

const streamData = [
  {
    "id": 1,
    "body": "I invented the double-click.",
    "real_name": "Bill Atkinson",
    "username": "billatkinson1337",
    "created_at": "2016.07.24 10:27:29",
    "comments": [
      {
        "id": 234,
        "body": "I invented the hotdog",
        "real_name": "Ray Farias",
        "username": "sgnl",
        "created_at": "2016.07.24 10:27:29",
        "comments": [
          {
            "id": 1,
            "body": "WOCKA WOCKA",
            "real_name": "Fozzie Bear",
            "username": "F.Bearsociety",
            "created_at": "2016.07.24 10:27:29"
          }
        ]
      },
      {
        "id": 2,
        "body": "I invented Surf Rock",
        "real_name": "Bill Hicks",
        "username": "Hill Bicks",
        "created_at": "2016.07.24 10:27:29",
        "comments": [
          {
            "id": 1,
            "body": "WOCKA WOCKA",
            "real_name": "Fozzie Bear",
            "username": "F.Bearsociety",
            "created_at": "2016.07.24 10:27:29",
            "comments": [
              {
                "id": 234,
                "body": "I invented the hotdog",
                "real_name": "Ray Farias",
                "username": "sgnl",
                "created_at": "2016.07.24 10:27:29"
              },
              {
                "id": 2,
                "body": "I invented Surf Rock",
                "real_name": "Bill Hicks",
                "username": "Hill Bicks",
                "created_at": "2016.07.24 10:27:29",
                "comments": [
                  {
                    "id": 1,
                    "body": "WOCKA WOCKA",
                    "real_name": "Fozzie Bear",
                    "username": "F.Bearsociety",
                    "created_at": "2016.07.24 10:27:29"
                  }
                ]
              }
            ]

          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "body": "I invented the square burger.",
    "real_name": "Dave Thomas",
    "username": "redhaireddevil",
    "created_at": "2016.07.25 10:27:29",
    comments: [
      {
        "id": 1,
        "body": "I invented the double-click.",
        "real_name": "Bill Atkinson",
        "username": "billatkinson1337",
        "created_at": "2016.07.24 10:27:29"
      }
    ]
  },
  {
    "id": 3,
    "body": "I invented the light bulb.",
    "real_name": "Thomas Edison",
    "username": "confEddy1776",
    "created_at": "2016.07.26 10:27:29"
  },
  {
    "id": 4,
    "body": "I invented peanut butter",
    "real_name": "George Washington Carver",
    "username": "GeeDubCeePB",
    "created_at": "2016.07.29 10:27:29"
  },
  {
    "id": 5,
    "body": "I invented self-driving car",
    "real_name": "Elon Musk",
    "username": "elonmusk",
    "created_at": "2016.07.30 10:27:29"
  }
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { streamData };
  }

  render() {
    return (
      <div className="App">
        <h1>Post Stream</h1>
        <NewsStream data={this.state.streamData} />
      </div>
    );
  }
}

export default App;
