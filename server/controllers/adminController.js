const {
  User,
  Event,
  Registration,
  Ticket,
} = require("../models");

const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: Event,
          as: "event",
          attributes: [
            "id",
            "title",
            "event_date",
            "event_time",
            "location",
          ],
        },
        {
          model: Ticket,
          as: "ticket",
          attributes: ["ticket_number"],
        },
      ],

      order: [["registered_at", "DESC"]],
    });

    const formattedRegistrations = registrations.map(
      (registration) => {
        const data = registration.toJSON();

        return {
          id: data.id,
          registered_at: data.registered_at,

          user_name: data.user?.name,
          user_email: data.user?.email,

          event_id: data.event?.id,
          event_title: data.event?.title,
          event_date: data.event?.event_date,
          event_time: data.event?.event_time,
          location: data.event?.location,

          ticket_number: data.ticket?.ticket_number,
        };
      }
    );

    res.json(formattedRegistrations);
  } catch (error) {
    console.error(
      "Get all registrations error:",
      error
    );

    res.status(500).json({
      message: "Failed to load registrations",
    });
  }
};

module.exports = {
  getAllRegistrations,
};