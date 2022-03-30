<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>

## Description

Step by step guidance to install and run the API 
## Installation

```bash
$ npm install
```

## Database SetUp
This API runs on a MySQL Database

First generate the database tables by running the command
```bash
$ npm run prisma:migrate
```

Then deploy the database for development or test purposes
```bash
$ npm run prisma:migrate:deploy:dev     or    npm run prisma:migrate:deploy:test
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Environment Variables
This project requires some environment variables in order to function -
Please find them below with example values

These variables should be set in a '.env' file at the source of the project, and in a '.env.test' file for test-related environment variables

```dotenv
DATABASE_URL="mysql://<user>:<password>@localhost:3306/innovorder"

JWT_KEY="secret-key"

LOGGER_LEVEL="error"
```


## Routes

### Users

Returns the information about the current user
```http request
# GET
# JWT-PROTECTED

users/me
```
Returns the information about the user corresponding to the 'id' param

```http request
# GET
# JWT-PROTECTED
# @Param - id: string

users/:id
```
Updates the User corresponding to the 'id' param

```http request
# PATCH
# JWT-PROTECTED
# @Param - id: string
# @Body - (optional params) {email: string, firstName: string, lastName: string, password: string}

users/:id
```

### Auth
_Creates a user in the database and returns a jwt token_

```http request
# POST
# @Param - {email: string, firstName: string, lastName: string, password: string}

auth/signup
```
_Logs in a user and returns a jwt token if email & password are correct_

```http request
# POST
# @Param - {email: string, password: string}

auth/login
```

### Products
_Returns the information about the product corresponding to the @id param  |   Cached for 5 minutes with key: 'offApiCalls - id'_
```
# GET
# JWT-PROTECTED
# @Param - {id: string}

products/:id
```


## License

Nest is [MIT licensed].
