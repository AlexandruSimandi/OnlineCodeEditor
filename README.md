OnlineCodeEditor
================

Node.js project
---------------

Live version [robertsandu.me/codeeditor](http://robertsandu.me/codeeditor).

Table of contents
-----------------

- [List of used packages](#list-of-packages)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Running the app](#running-the-app)

List of packages
----------------

| Package           | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| compression       | Express 4 middleware.                                                       |
| codemirror        | Versatile text editor implemented in JavaScript for the browser.            |
| express           | Sinatra inspired web development framework for node.js.                     |
| mongodb           | cross-platform document-oriented database                                   |
| mongoose          | MongoDB ODM.                                                                |
| morgan            |                                                                             |
| serve-favicon     | Express 4 middleware offering favicon serving and caching                   |
| moniker           | Random name generator                                                       |
| socket.io         | JavaScript library for realtime web applications                            |
| supertest         | HTTP assertion library.                                                     |
| chai              | BDD/TDD assertion library.                                                  |
| mocha             | Test framework.                                                             |

Project structure
------------------

| Name                              | Description                                                                   |
|-----------------------------------|-------------------------------------------------------------------------------|
| **config**/_index.js_             |                                                                               |
| **config**/_development.json_     | development  settings                                                         |
| **config**/_production.json_      | production settings                                                           |
| **config**/_test.json_            | test settings                                                                 |

Prerequisites
-------------

- [Node.js](http://nodejs.org)
- [MongoDB](https://www.mongodb.org/downloads)

Running the app
----------------

```bash
git clone --depth=1 https://github.com/AlexandruSimandi/OnlineCodeEditor.git someproject

# change the directory to the project one
cd someproject

# required for mongo-morgan
sudo apt-get install build-essential

# install node package manager dependecies
npm install

# install bower dependencies
bower install

# run the default gulp
gulp

# start the server
node server.js
```

In production you can use pm2 or forever (production process managers for Node.js applications)

```bash

# use this instead of server.js
pm2 start server.js

```

When you develop the app you can use [nodemon](https://www.npmjs.com/package/nodemon), install it `sudo npm install -g nodemon`
and then replace `node server.js` with `nodemon server.js`. [Nodemon](https://www.npmjs.com/package/nodemon) will watch for changes
in the app and then automatically restarts the server.