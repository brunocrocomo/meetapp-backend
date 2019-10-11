# Meetapp back end

Back end of the project proposed as exercise on GoStack Bootcamp by [Rocketseat](https://rocketseat.com.br/).

Written in [Node.js](https://nodejs.org/en/).

### How to run?

As prerequisite you need to host the `Postgres` and `Redis` databases on your machine. It's recommended to use [Docker](https://www.docker.com/) containers once they're really easy to install and run, as shown below:

#### Postgres

```
docker run --name meetapp-database -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres
```

#### Redis

```
docker run --name meetapp-redis -p 6379:6379 -d -t redis:alpine
```

Once the containers are up, you just need to:

1. Clone this repository:

```
$ git clone https://github.com/brunocrocomo/meetapp-backend.git
```

2. Move into `meetapp-backend` directory:

```
$ cd meetapp-backend
```

3. Run `yarn` to install the dependencies

```
$ yarn
```

4. Make a copy of the `.env.example` file and rename it to `.env`

5. Set the values of the `.env` file as required

6. Run the ORM migrations:

```
$ yarn sequelize db:migrate
```

7. If you want some random data, run the ORM seeds with the command below. The generated users passwords are all set as `123456`.

```
$ yarn sequelize db:seed:all
```

8. Run `yarn dev` to start the server (at `http://localhost:3333/`):

```
$ yarn dev
```

9. Run `yarn queue` to start the email sending background job:

```
$ yarn queue
```

### Back end production features

-   Web server based on [Express](https://github.com/expressjs/express) with security resources provided by [Express Rate Limit](https://github.com/nfriedly/express-rate-limit) e [Helmet](https://github.com/helmetjs/helmet) libraries.

-   [Postgres](https://www.postgresql.org/) database handled by [Sequelize](https://github.com/sequelize) ORM features.

-   Object schema validation with [Yup](https://github.com/jquense/yup) library.

-   Date and time formatting and validation with [date-fns](https://github.com/date-fns/date-fns) library.

-   Password hashing with [bcryptjs](https://github.com/dcodeIO/bcrypt.js) library.

-   JSON Web Token authentication with [JWT](https://github.com/auth0/node-jsonwebtoken) library.

-   `multipart/form-data` handling with [Multer](https://github.com/expressjs/multer) middleware, allowing image upload to server.

-   Process queues and background jobs handled by [Bee Queue](https://github.com/bee-queue/bee-queue) library with [Redis](https://github.com/antirez/redis) support.

-   E-mail sending feature (using background jobs!) with [Nodemailer](https://nodemailer.com/about/) library.

-   Cache of relevant routes using [Redis](https://github.com/antirez/redis) as support.

-   Error abstractions and pretty reports supported by [Boom](https://github.com/hapijs/boom) and [Youch](https://github.com/poppinss/youch) libraries.

-   Application monitoring and error tracking supported by [Sentry](https://sentry.io/welcome/) services.

-   Single and easy configuration file of the whole backend using environment variables supported by [dotenv](https://github.com/motdotla/dotenv) module.

### Back end development features

-   Code linting and formatting with [ESlint](https://github.com/eslint/eslint), [Prettier](https://github.com/prettier/prettier) and [EditorConfig](https://editorconfig.org/).

-   Source code compiling supported by [Sucrase](https://github.com/alangpierce/sucrase).

-   File changes monitor and application auto-reload supported by [nodemon](https://github.com/remy/nodemon).

-   Random data generator (for seeds creation with Sequelize) supported by [faker.js](https://github.com/marak/Faker.js/).
