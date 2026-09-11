import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  

  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(true);

  const [error, setError] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "admin") {
        navigate("/");
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/events"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load events"
          );
        }

        setEvents(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/registrations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load registrations"
          );
        }

        setRegistrations(data);
      } catch (error) {
        console.error(error);
        setRegistrationError(
          error.message || "Unable to load registrations"
        );
      } finally {
        setRegistrationLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const handleDelete = async (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}`,
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

      setEvents((currentEvents) =>
        currentEvents.filter(
          (event) => Number(event.id) !== Number(eventId)
        )
      );

      setRegistrations((currentRegistrations) =>
        currentRegistrations.filter(
          (registration) =>
            Number(registration.event_id) !== Number(eventId)
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to delete event");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

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
            <span className="hidden text-sm text-gray-600 sm:block">
              Hi, {user.name}
            </span>

            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/create-event"
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Create Event
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage events and view event registrations.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Events
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {events.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Registrations
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {registrations.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Account Role
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              Admin
            </p>
          </div>
        </div>

        {/* Events */}
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Manage Events
            </h2>

            <Link
              to="/create-event"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              + Create Event
            </Link>
          </div>

          {loading && (
            <p className="text-gray-500">
              Loading events...
            </p>
          )}

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-500">
                No events found.
              </p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[800px]">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Event
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Location
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Capacity
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">
                          {event.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {event.category || "General"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.event_date}
                        <br />
                        {event.event_time}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.location}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.capacity}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/events/${event.id}`}
                            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                          >
                            View
                          </Link>

                          <Link
                            to={`/events/${event.id}/edit`}
                            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(event.id)
                            }
                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Registrations */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Event Registrations
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View users who have registered for your events.
            </p>
          </div>

          {registrationLoading && (
            <p className="text-gray-500">
              Loading registrations...
            </p>
          )}

          {registrationError && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">
              {registrationError}
            </div>
          )}

          {!registrationLoading &&
            !registrationError &&
            registrations.length === 0 && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">
                  No registrations yet.
                </p>
              </div>
            )}

          {!registrationLoading &&
            !registrationError &&
            registrations.length > 0 && (
              <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
                <table className="w-full min-w-[900px]">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Event
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Location
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Ticket
                      </th>

                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        Registered
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {registrations.map((registration) => (
                      <tr
                        key={registration.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-800">
                            {registration.user_name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {registration.user_email}
                          </p>
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {registration.event_title}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {registration.event_date}
                          <br />
                          {registration.event_time}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {registration.location}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {registration.ticket_number ||
                              "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(
                            registration.registered_at
                          ).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;