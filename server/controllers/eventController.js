const { User, Event, Registration } = require("../models");

// CREATE EVENT
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      event_date,
      event_time,
      location,
      capacity,
    } = req.body;

    if (!title || !event_date || !event_time || !location || !capacity) {
      return res.status(400).json({
        message: "Please provide all required event details",
      });
    }

    const event = await Event.create({
      title,
      description: description || null,
      category: category || null,
      event_date,
      event_time,
      location,
      capacity,
      created_by: req.user.id,
    });

    res.status(201).json({
      message: "Event created successfully",
      eventId: event.id,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET ALL EVENTS
const getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["name"],
        },
        {
          model: Registration,
          as: "registrations",
          attributes: ["id"],
        },
      ],
      order: [
        ["event_date", "ASC"],
        ["event_time", "ASC"],
      ],
    });

    const formattedEvents = events.map((event) => {
      const data = event.toJSON();

      const registeredCount = data.registrations.length;

      return {
        ...data,
        creator_name: data.creator?.name,
        registered_count: registeredCount,
        available_seats: Math.max(
          Number(data.capacity) - registeredCount,
          0
        ),
      };
    });

    res.json(formattedEvents);
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// GET SINGLE EVENT
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["name"],
        },
        {
          model: Registration,
          as: "registrations",
          attributes: ["id"],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const data = event.toJSON();

    const registeredCount = data.registrations.length;

    res.json({
      ...data,
      creator_name: data.creator?.name,
      registered_count: registeredCount,
      available_seats: Math.max(
        Number(data.capacity) - registeredCount,
        0
      ),
    });
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// UPDATE EVENT
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      event_date,
      event_time,
      location,
      capacity,
    } = req.body;

    if (!title || !event_date || !event_time || !location || !capacity) {
      return res.status(400).json({
        message: "Please provide all required event details",
      });
    }

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (
      event.created_by !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this event",
      });
    }

    const registeredCount = await Registration.count({
      where: {
        event_id: id,
      },
    });

    if (Number(capacity) < registeredCount) {
      return res.status(400).json({
        message:
          `Capacity cannot be less than ${registeredCount} registered users`,
      });
    }

    await event.update({
      title,
      description: description || null,
      category: category || null,
      event_date,
      event_time,
      location,
      capacity,
    });

    res.json({
      message: "Event updated successfully",
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// DELETE EVENT
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (
      event.created_by !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this event",
      });
    }

    await event.destroy();

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};