const crypto = require("crypto");

const { sequelize } = require("../config/database");

const {
  User,
  Event,
  Registration,
  Ticket,
} = require("../models");



const {
  sendRegistrationEmail,
} = require("../utils/email");


// REGISTER FOR EVENT
const registerForEvent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Event ID is required",
      });
    }

    const user = await User.findByPk(userId, {
      transaction,
    });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        message: "User not found",
      });
    }

    const event = await Event.findByPk(eventId, {
      transaction,
    });

    if (!event) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Event not found",
      });
    }

    const existingRegistration = await Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
      },
      transaction,
    });

    if (existingRegistration) {
      await transaction.rollback();

      return res.status(409).json({
        message: "You are already registered for this event",
      });
    }

    const registeredCount = await Registration.count({
      where: {
        event_id: eventId,
      },
      transaction,
    });

    if (registeredCount >= event.capacity) {
      await transaction.rollback();

      return res.status(400).json({
        message: "This event is full",
      });
    }

    const registration = await Registration.create(
      {
        user_id: userId,
        event_id: eventId,
      },
      {
        transaction,
      }
    );

    const ticketNumber =
      `EVT-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

    await Ticket.create(
      {
        registration_id: registration.id,
        ticket_number: ticketNumber,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    await sendRegistrationEmail({
      email: user.email,
      name: user.name,
      eventTitle: event.title,
      eventDate: event.event_date,
      eventTime: event.event_time,
      location: event.location,
      ticketNumber,
    });

    res.status(201).json({
      message: "Successfully registered for event",
      registrationId: registration.id,
      ticketNumber,
    });

  } catch (error) {
    await transaction.rollback();

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET MY REGISTRATIONS
const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await Registration.findAll({
      where: {
        user_id: userId,
      },

      include: [
        {
          model: Event,
          as: "event",
          attributes: [
            "id",
            "title",
            "description",
            "category",
            "event_date",
            "event_time",
            "location",
          ],
        },

        {
          model: Ticket,
          as: "ticket",
          attributes: [
            "ticket_number",
          ],
        },
      ],

      order: [
        [
          {
            model: Event,
            as: "event",
          },
          "event_date",
          "ASC",
        ],
        [
          {
            model: Event,
            as: "event",
          },
          "event_time",
          "ASC",
        ],
      ],
    });

    
    const formattedRegistrations = registrations.map(
      (registration) => {
        const data = registration.toJSON();

        return {
          registration_id: data.id,

          event_id: data.event?.id,
          title: data.event?.title,
          description: data.event?.description,
          category: data.event?.category,
          event_date: data.event?.event_date,
          event_time: data.event?.event_time,
          location: data.event?.location,

          ticket_number: data.ticket?.ticket_number,

          registered_at: data.registered_at,
        };
      }
    );

    res.json(formattedRegistrations);

  } catch (error) {
    console.error(
      "Get my registrations error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// CANCEL REGISTRATION
const cancelRegistration = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      where: {
        user_id: userId,
        event_id: eventId,
      },
    });

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    await registration.destroy();

    res.json({
      message: "Registration cancelled successfully",
    });

  } catch (error) {
    console.error(
      "Cancel registration error:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
};