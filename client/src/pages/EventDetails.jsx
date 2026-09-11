import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Invalid user data");
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `https://event-management-system-production-8cd2.up.railway.app/api/events/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Event not found"
          );
        }

        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to register for this event.");
      return;
    }

    if (event.available_seats === 0) {
      setError("This event is full.");
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        "https://event-management-system-production-8cd2.up.railway.app/api/registrations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: Number(id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      setMessage(
        `Registration successful! Ticket: ${data.ticketNumber}`
      );

      // Update seat count immediately
      setEvent((previousEvent) => ({
        ...previousEvent,
        registered_count:
          Number(previousEvent.registered_count) + 1,
        available_seats:
          Math.max(
            Number(previousEvent.available_seats) - 1,
            0
          ),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `https://event-management-system-production-8cd2.up.railway.app/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete event"
        );
      }

      alert("Event deleted successfully.");

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (time) => {
    if (!time) return "Not available";

    const [hours, minutes] = time
      .split(":")
      .map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>

          <p className="text-lg text-gray-600">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
        <p className="mb-4 text-center text-red-600">
          {error}
        </p>

        <Link
          to="/"
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const isCreator =
    user &&
    Number(user.id) === Number(event.created_by);

  const isAdmin =
    user && user.role === "admin";

  const canManageEvent =
    isCreator || isAdmin;

  const isFull =
    Number(event.available_seats) === 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            EventHub
          </Link>

          <div className="flex items-center gap-4">

            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/my-events"
                className="text-gray-600 hover:text-blue-600"
              >
                My Events
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-blue-600"
              >
                Admin Dashboard
              </Link>
            )}

          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-6 py-8">

        {/* Back */}
        <div className="mb-6 flex flex-wrap gap-3">

          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back
          </button>

          {isAdmin && (
            <Link
              to="/admin"
              className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-medium text-blue-700 hover:bg-blue-100"
            >
              ← Back to Admin Dashboard
            </Link>
          )}

        </div>

        {/* Event Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white sm:p-10">

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-100">
              {event.category || "Event"}
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              {event.title}
            </h1>

          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">

            <div className="grid gap-10 md:grid-cols-2">

              {/* Description */}
              <div>

                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  About this event
                </h2>

                <p className="leading-7 text-gray-600">
                  {event.description ||
                    "No description available."}
                </p>

              </div>

              {/* Event Information */}
              <div className="space-y-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-semibold text-gray-900">
                    {formatDate(event.event_date)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p className="font-semibold text-gray-900">
                    {formatTime(event.event_time)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="font-semibold text-gray-900">
                    {event.location}
                  </p>
                </div>

                {/* Seats */}
                <div className="rounded-xl bg-gray-50 p-4">

                  <p className="text-sm text-gray-500">
                    Seats
                  </p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {event.registered_count} /{" "}
                    {event.capacity} registered
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      isFull
                        ? "text-red-600"
                        : Number(event.available_seats) <= 5
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {isFull
                      ? "Event Full"
                      : `${event.available_seats} seats available`}
                  </p>

                </div>

                {/* Organizer */}
                {event.creator_name && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Organized by
                    </p>

                    <p className="font-semibold text-gray-900">
                      {event.creator_name}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                <p className="font-medium">
                  ✓ {message}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && event && (
              <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* Register */}
              <button
                onClick={handleRegister}
                disabled={isFull}
                className={`flex-1 rounded-lg py-3 font-semibold text-white transition ${
                  isFull
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isFull
                  ? "Event Full"
                  : "Register for Event"}
              </button>

              {/* Edit */}
              {canManageEvent && (
                <Link
                  to={`/events/${id}/edit`}
                  className="flex-1 rounded-lg bg-yellow-500 py-3 text-center font-semibold text-white hover:bg-yellow-600"
                >
                  Edit Event
                </Link>
              )}

              {/* Delete */}
              {canManageEvent && (
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                >
                  Delete Event
                </button>
              )}

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default EventDetails;