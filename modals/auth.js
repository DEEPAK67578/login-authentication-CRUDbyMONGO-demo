const db = require("../data/database");
const mongodb = require("mongodb");
const objectId = mongodb.ObjectId;


class auth {
    constructor(email,confirmEmail,password) {
        this.email = email;
        this.confirmEmail = confirmEmail
        this.password = password
    }

    async existingUser() {
    const existingUser = await db
    .getDb()
    .collection("user")
    .findOne({ email: this.email })
    return existingUser
    }

    async signup() {
    const result = await db
    .getDb()
    .collection("user")
    .insertOne({ email: this.email, password: this.password })
    return result
    }

    async login() {
    const userData = await db
    .getDb()
    .collection("user")
    .findOne({ email: this.email });
    return userData
    }
}

module.exports = auth