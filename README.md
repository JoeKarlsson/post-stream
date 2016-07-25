# Post Stream

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

Download and unpack [Post Stream](https://github.com/JoeKarlsson1/post-stream). Or alternatively checkout from source:

    git clone git@github.com:JoeKarlsson1/post-stream.git
    cd bechdel-test

Next, inside the project, you need to install the project's various NPM dependencies:

    npm install

And you should now be ready to spin up a development build of your new project:

    npm start

Navigate to [http://localhost:3000](http://localhost:3000) in your browser of choice.


### Important concepts
- No public metrics
  - No visible follower/following numbers
  - No visible like/dislike numbers
  - Possible fuzzy metrics (Your engagement is {very high} {high} {average})
- No public feed
  - No Moments
  - No Trending Topics
- Character limit
  - Brevity
  - Accessibilty
  - SMS-support
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
  - Donation model if anything
- Filtering of topics
  - Mute options for keywords


### Handling posts
#### Viewing shared links:

- collapsible (a la http://www.foldingtext.com)
- plain-text reader mode stripped of images for articles
- viewable highlights/annotations from share

#### Idea on infinite nested comments: http://ux.stackexchange.com/a/1736

- collapseable
- one comment at a time
- nested comments display below


## Inspiration

- [Little Voices](http://www.littlevoicesapp.com)
- [Rainbow Stream](http://www.rainbowstream.org)


## Questions 🤔

Unsure on:

* [ ] User sign-up
* [ ] User sign-out
* [ ] Identity verification (http://keybase.io)
* [ ] Customization of appearance
* [ ] Alternative to “@”  for usernames
* [ ] Identity/permalink for posts?

##Contributing
1. Fork it!
2. Create your feature branch: ```git checkout -b my-new-feature```
3. Commit your changes: ```git commit -am 'Add some feature'```
4. Push to the branch: ````git push origin my-new-feature````
5. Submit a pull request :D

##Credits
- Ray Farias
- Jacoby Young
- Joe Carlson