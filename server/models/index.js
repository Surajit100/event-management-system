const User = require("./User");
const Event = require("./Event");
const Registration = require("./Registration");
const Ticket = require("./Ticket");

// User → Event
User.hasMany(Event, {
  foreignKey: "created_by",
  as: "events",
});

Event.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

// User → Registration
User.hasMany(Registration, {
  foreignKey: "user_id",
  as: "registrations",
});

Registration.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Event → Registration
Event.hasMany(Registration, {
  foreignKey: "event_id",
  as: "registrations",
});

Registration.belongsTo(Event, {
  foreignKey: "event_id",
  as: "event",
});

// Registration → Ticket
Registration.hasOne(Ticket, {
  foreignKey: "registration_id",
  as: "ticket",
});

Ticket.belongsTo(Registration, {
  foreignKey: "registration_id",
  as: "registration",
});

module.exports = {
  User,
  Event,
  Registration,
  Ticket,
};