const { Model } = require("objection");
const { hash, compare } = require("bcrypt");

const SALT_ROUNDS = 10;

class Ride extends Model {
  static get tableName() {
    return "ride";
  }
}

module.exports = Ride;
