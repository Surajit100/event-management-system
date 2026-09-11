import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ================= CHECK LOGGED-IN USER =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "https://event-management-system-production-8cd2.up.railway.app/api/events"
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

  // ================= CATEGORIES =================
  const categories = [
    "All",
    ...new Set(
      events
        .map((event) => event.category)
        .filter(Boolean)
    ),
  ];

  // ================= SEARCH + FILTER =================
  const filteredEvents = events.filter((event) => {
    const searchText = search.toLowerCase().trim();

    const title = (event.title || "").toLowerCase();
    const description = (
      event.description || ""
    ).toLowerCase();
    const location = (
      event.location || ""
    ).toLowerCase();
    const eventCategory = (
      event.category || ""
    ).toLowerCase();

    const matchesSearch =
      title.includes(searchText) ||
      description.includes(searchText) ||
      location.includes(searchText) ||
      eventCategory.includes(searchText);

    const matchesCategory =
      category === "All" ||
      event.category === category;

    return matchesSearch && matchesCategory;
  });

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ================= FORMAT TIME =================
  const formatTime = (time) => {
    if (!time) {
      return "Time unavailable";
    }

    const [hours, minutes] = time.split(":");

    if (hours === undefined || minutes === undefined) {
      return time;
    }

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================= CLEAR FILTERS =================
  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600"
          >
            EventHub
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">

            {user ? (
              <>
                {/* User */}
                <span className="hidden text-sm text-gray-600 sm:block">
                  Hi, {user.name}
                </span>

                {/* Admin Dashboard */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="font-medium text-purple-600 transition hover:text-purple-800"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* My Events */}
                <Link
                  to="/my-events"
                  className="text-gray-600 transition hover:text-blue-600"
                >
                  My Events
                </Link>

                {/* Create Event */}
                <Link
                  to="/create-event"
                  className="text-gray-600 transition hover:text-blue-600"
                >
                  Create Event
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link
                  to="/login"
                  className="text-gray-600 transition hover:text-blue-600"
                >
                  Login
                </Link>

                {/* Register */}
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">

          <div className="max-w-3xl">

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-200">
              EventHub
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Discover Amazing Events
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Find and register for events happening
              around you.
            </p>

          </div>

          {/* ================= SEARCH + FILTER ================= */}
          <div className="mt-8 flex max-w-4xl flex-col gap-4 sm:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search events by name, location..."
                className="w-full rounded-xl bg-white py-4 pl-14 pr-5 text-gray-800 shadow-lg outline-none placeholder:text-gray-400 focus:ring-4 focus:ring-blue-300"
              />

            </div>

            {/* Category */}
            <div className="sm:w-56">

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full cursor-pointer rounded-xl bg-white px-5 py-4 text-gray-800 shadow-lg outline-none focus:ring-4 focus:ring-blue-300"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>
      </section>

      {/* ================= EVENTS ================= */}
      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* Heading */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Upcoming Events
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Explore events and find something
              interesting.
            </p>
          </div>

          <span className="text-sm font-medium text-gray-500">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1
              ? "event"
              : "events"}
          </span>

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading events...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl bg-red-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-red-700">
              Something went wrong
            </h3>

            <p className="mt-2 text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* No Events */}
        {!loading &&
          !error &&
          events.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                📅
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-700">
                No events yet
              </h3>

              <p className="mt-2 text-gray-500">
                Check back later for upcoming events.
              </p>

            </div>
          )}

        {/* No Matching Events */}
        {!loading &&
          !error &&
          events.length > 0 &&
          filteredEvents.length === 0 && (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

              <div className="text-5xl">
                🔍
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-700">
                No matching events
              </h3>

              <p className="mt-2 text-gray-500">
                Try a different search or category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>

            </div>
          )}

        {/* ================= EVENT CARDS ================= */}
        {!loading &&
          !error &&
          filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">

              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Card Header */}
                  <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">

                    <span className="text-6xl transition duration-300 group-hover:scale-110">
                      🎉
                    </span>

                    {/* Category */}
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                      {event.category || "General"}
                    </span>

                  </div>

                  {/* Card Content */}
                  <div className="p-6">

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 min-h-[48px] line-clamp-2 text-sm leading-6 text-gray-500">
                      {event.description ||
                        "No description available."}
                    </p>

                    {/* Event Information */}
                    <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">

                      {/* Date */}
                      <div className="flex items-start gap-3">
                        <span className="text-lg">
                          📅
                        </span>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Date
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {formatDate(
                              event.event_date
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="flex items-start gap-3">
                        <span className="text-lg">
                          ⏰
                        </span>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Time
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {formatTime(
                              event.event_time
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-start gap-3">
                        <span className="text-lg">
                          📍
                        </span>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Location
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {event.location}
                          </p>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="flex items-start gap-3">
                        <span className="text-lg">
                          👥
                        </span>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Capacity
                          </p>

                          <p className="text-sm font-medium text-gray-700">
                            {event.capacity} people
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* View Event */}
                    <Link
                      to={`/events/${event.id}`}
                      className="mt-6 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Event
                      <span className="ml-2">
                        →
                      </span>
                    </Link>

                  </div>
                </div>
              ))}

            </div>
          )}

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-gray-300">

        <div className="mx-auto max-w-7xl px-6 py-12">

          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

            {/* Brand */}
            <div>
              <h2 className="text-2xl font-bold text-white">
                EventHub
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Discover amazing events, connect with people,
                and create unforgettable experiences.
              </p>

              <div className="mt-5 flex gap-3">
                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm transition hover:bg-blue-600 hover:text-white"
                >
                  f
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm transition hover:bg-blue-600 hover:text-white"
                >
                  X
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm transition hover:bg-blue-600 hover:text-white"
                >
                  in
                </a>

                <a
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-sm transition hover:bg-pink-600 hover:text-white"
                >
                  ◎
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white">
                Quick Links
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    to="/"
                    className="transition hover:text-white"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    to="/my-events"
                    className="transition hover:text-white"
                  >
                    My Events
                  </Link>
                </li>

                <li>
                  <Link
                    to="/create-event"
                    className="transition hover:text-white"
                  >
                    Create Event
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="transition hover:text-white"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* EventHub */}
            <div>
              <h3 className="font-semibold text-white">
                EventHub
              </h3>

              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a
                    href="#"
                    className="transition hover:text-white"
                  >
                    About Us
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-white"
                  >
                    How It Works
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-white"
                  >
                    Terms & Conditions
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition hover:text-white"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white">
                Contact Us
              </h3>

              <ul className="mt-4 space-y-4 text-sm">

                <li className="flex items-start gap-3">
                  <span className="text-lg">📍</span>

                  <span>
                    Kolkata, West Bengal
                    <br />
                    India
                  </span>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-lg">📧</span>

                  <a
                    href="mailto:support@eventhub.com"
                    className="transition hover:text-white"
                  >
                    support@eventhub.com
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-lg">📞</span>

                  <a
                    href="tel:+91XXXXXXXXXX"
                    className="transition hover:text-white"
                  >
                    +91XXXXXXXXXX
                  </a>
                </li>

                <li className="flex items-center gap-3">
                  <span className="text-lg">🕐</span>

                  <span>
                    Mon - Sat: 9 AM - 6 PM
                  </span>
                </li>

              </ul>
            </div>

          </div>

          {/* Bottom */}
          <div className="mt-10 border-t border-gray-800 pt-6">

            <div className="flex flex-col items-center justify-between gap-4 text-sm md:flex-row">

              <p className="text-gray-500">
                © 2026 EventHub. All rights reserved.
              </p>

              <p className="text-gray-500">
                Made with ❤️ for event lovers
              </p>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Home;