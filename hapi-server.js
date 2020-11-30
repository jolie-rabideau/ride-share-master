// Knex
const knex = require("knex")({
  client: "pg",
  connection: {
    host: "faraday.cse.taylor.edu", // PostgreSQL server
    user: "jolie_rabideau", // Your user name
    password: "moqonoqo", // Your password
    database: "jolie_rabideau", // Your database name
  },
});

// Objection
const objection = require("objection");
objection.Model.knex(knex);

// Models
const User = require("./models/User");
const Ride = require("./models/Ride");

// Hapi
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi"); // Server

const server = Hapi.server({
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {
  // Show routes at startup.
  await server.register(require("blipp"));

  // Output logging information.
  await server.register({
    plugin: require("hapi-pino"),
    options: {
      prettyPrint: true,
    },
  });

  // Configure routes.
  server.route([
    {
      method: "GET",
      path: "/users",
      config: {
        description: "Retrieve all users",
      },
      handler: () => User.query(),
    },

    {
      method: "POST",
      path: "/users",
      config: {
        description: "Sign up",
        validate: {
          payload: Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            phone: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const existingUser = await User.query()
          .where("email", request.payload.email)
          .first();
        if (existingUser) {
          return {
            ok: false,
            msge: `User '${request.payload.email}' already exists`,
          };
        }

        const newUser = await User.query().insert({
          firstName: request.payload.firstName,
          lastName: request.payload.lastName,
          email: request.payload.email,
          phone: request.payload.phone,
          password: request.payload.password,
        });

        if (newUser) {
          return {
            ok: true,
            msge: `Created user '${request.payload.email}'`,
          };
        } else {
          return {
            ok: false,
            msge: `Couldn't create user with email '${request.payload.email}'`,
          };
        }
      },
    },

    {
      method: "POST",
      path: "/login",
      config: {
        description: "Log in",
        validate: {
          payload: Joi.object({
            email: Joi.string()
              .email()
              .required(),
            password: Joi.string()
              .min(8)
              .required(),
          }),
        },
      },
      handler: async (request) => {
        const user = await User.query()
          .where("email", request.payload.email)
          .first();
        if (user && (await user.verifyPassword(request.payload.password))) {
          return {
            ok: true,
            msge: `Logged in successfully as '${request.payload.email}'`,
            details: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
            },
          };
        } else {
          return {
            ok: false,
            msge: "Invalid email or password",
          };
        }
      },
    },
  ]);

  // Start the server.
  await server.start();
}

// Go!
init();
