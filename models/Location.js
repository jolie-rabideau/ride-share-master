const { Model } = require("objection");
const { hash, compare } = require("bcrypt");

class Location extends Model {
  static get tableName() {
    return "location";
  }

module.exports = Location;
