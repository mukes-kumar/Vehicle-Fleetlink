const transporter = require("../configs/mailConfig");

// ✅ HTML Email Template
const subscriptionTemplate = (email) => `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#f4f8fb; color:#333;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:#2d89ef; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">🚗 Welcome to GoRent Car!</h1>
      </div>
      <div style="padding:20px;">
        <p>Hi <b>${email}</b>,</p>
        <p>Thank you for subscribing to <b>GoRent Car</b>. You’re now part of our community of smart travelers and explorers!</p>
        <p>
          With GoRent Car, you can enjoy:
        </p>
        <ul style="line-height:1.6;">
          <li>✔ Affordable car rentals for a few hours, days, or even weeks.</li>
          <li>✔ Wide range of vehicles – from budget rides to luxury cars.</li>
          <li>✔ Easy booking & secure payments.</li>
          <li>✔ Exclusive discounts for subscribers like you.</li>
        </ul>
        <p>Plan your next trip with us and never miss an adventure again.</p>
        <div style="text-align:center; margin:30px 0;">
          <a href="https://rentmyrider-car.vercel.app/" 
            style="background:#2d89ef; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">
            Book Your Ride Now
          </a>
        </div>
        <p>If you have any questions, feel free to contact us anytime.</p>
      </div>
      <div style="background:#f0f0f0; padding:15px; font-size:12px; text-align:center; color:#555;">
        <p>This is an automated email. Please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} GoRent Car. All rights reserved.</p>
      </div>
    </div>
  </div>
`;


const adminNotificationTemplate = (email) => `
  <div style="font-family: Arial, sans-serif; padding:20px; background:#fff8f8; color:#333;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1); overflow:hidden;">
      <div style="background:#e74c3c; padding:20px; text-align:center; color:#fff;">
        <h1 style="margin:0;">📩 New Subscription Alert</h1>
      </div>
      <div style="padding:20px;">
        <p>Hello Admin,</p>
        <p>A new user has subscribed to the GoRent Car newsletter.</p>
        <p><b>Email:</b> ${email}</p>
        <p>Encourage them to book rides and provide more offers!</p>
        <div style="text-align:center; margin:30px 0;">
          <a href="https://rentmyrider-car.vercel.app/" 
            style="background:#e74c3c; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold;">
            Visit Dashboard
          </a>
        </div>
      </div>
      <div style="background:#f0f0f0; padding:15px; font-size:12px; text-align:center; color:#555;">
        <p>This is an automated email notification for admin use only.</p>
      </div>
    </div>
  </div>
`;


const sendMail = async (req, res) => {
  const { email } = req.body;

  try {
    // ✅ Send to User
    await transporter.sendMail({
      from: `"GoRent Car 🚗" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to GoRent Car!",
      html: subscriptionTemplate(email),
    });

    // ✅ Send to Admin
    await transporter.sendMail({
      from: `"GoRent Car 🚗" <${process.env.EMAIL_USER}>`,
      to: 'mukesh.vin99@gmail.com',
      subject: "New Newsletter Subscription",
      html: adminNotificationTemplate(email),
    });

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email", error });
  }
};

module.exports = { sendMail };
