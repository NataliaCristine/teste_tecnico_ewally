const development = {
  type: "postgres",
  host: "localhost",
  port: "5432",
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.PASSWORD,
  entities: ["./src/entities/**/*.ts"],
  migrations: ["./src/database/migrations/*.ts"],
  cli: {
    migrationsDir: "./src/database/migrations",
  },
  logging: true,
};

const testEnv = {
  type: "sqlite",
  database: ":memory:",
  entities: ["./src/entities/**/*.ts"],
  synchronize: true,
};

module.exports = process.env.NODE_ENV === "test" ? testEnv : development;
