const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    registration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    ticket_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    qr_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "tickets",
    timestamps: false,
  }
);

module.exports = Ticket;