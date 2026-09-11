import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyEvents() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyEvents = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://event-management-system-production-8cd2.up.railway.app/api/registrations/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load registrations");
      }

      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleCancel = async (eventId) => {
    const token = localStorage.getItem("token");

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this registration?"
    );

    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `https://event-management-system-production-8cd2.up.railway.app/api/registrations/${eventId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cancellation failed");
      }

      setRegistrations((current) =>
        current.filter((registration) => registration.event_id !== eventId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading your events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            EventHub
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            Home
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          My Events
        </h1>

        <p className="mb-8 text-gray-600">
          Events you have registered for.
        </p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <h2 className="mb-2 text-xl font-semibold">
              No registered events
            </h2>

            <p className="mb-6 text-gray-500">
              You haven't registered for any events yet.
            </p>

            <Link
              to="/"
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {registrations.map((registration) => (
              <div
                key={registration.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <h2 className="mb-3 text-xl font-bold text-gray-900">
                  {registration.title}
                </h2>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      registration.event_date
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {registration.event_time}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {registration.location}
                  </p>
                </div>

                <div className="mt-5 rounded-lg bg-blue-50 p-4">
                  <p className="text-sm text-gray-500">
                    Ticket Number
                  </p>

                  <p className="mt-1 font-mono font-bold text-blue-700">
                    {registration.ticket_number}
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleCancel(registration.event_id)
                  }
                  className="mt-5 w-full rounded-lg border border-red-300 py-2 font-medium text-red-600 hover:bg-red-50"
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyEvents;