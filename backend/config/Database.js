import { Sequelize } from "sequelize";

const db = new Sequelize('belajar_authnode', 'root', 'password', {
    host: "localhost",
    dialect: "mysql"
})

export default db;