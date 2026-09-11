const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRegistrationEmail = async ({
  email,
  name,
  eventTitle,
  eventDate,
  eventTime,
  location,
  ticketNumber,
}) => {
  try {
    await transporter.sendMail({
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Event Registration Confirmed - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2 style="color: #2563eb;">
            Event Registration Confirmed 🎉
          </h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            Your registration has been successfully confirmed.
          </p>

          <div style="
            background: #f3f4f6;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          ">
            <h3>${eventTitle}</h3>

            <p>📅 <strong>Date:</strong> ${eventDate}</p>
            <p>⏰ <strong>Time:</strong> ${eventTime}</p>
            <p>📍 <strong>Location:</strong> ${location}</p>

            <p>
              🎟️ <strong>Ticket Number:</strong>
              ${ticketNumber}
            </p>
          </div>

          <p>
            Please keep this email for your records.
          </p>

          <p>
            Thank you for using <strong>EventHub</strong>.
          </p>
        </div>
      `,
    });

    console.log(`Confirmation email sent to ${email}`);
  } catch (error) {
    console.error(
      "Email sending failed:",
      error.message
    );
  }
};

module.exports = {
  sendRegistrationEmail,
};