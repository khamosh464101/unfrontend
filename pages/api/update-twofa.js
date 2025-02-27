// pages/api/update-session.js
import { getSession } from "next-auth/react";
import jwt from "jsonwebtoken"; // For signing JWTs manually

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { twofa } = req.body;

    // Create a new JWT with updated `twofa` value
    const token = jwt.sign(
      {
        id: session.id,
        name: session.name,
        email: session.email,
        twofa: twofa, // Update the twofa value to true
      },
      process.env.JWT_SECRET, // Your secret key
      { expiresIn: "1h" } // Set an expiration for the JWT
    );

    // Send the updated JWT back to the client in a cookie
    res.setHeader(
      "Set-Cookie",
      `next-auth.session-token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`
    );

    return res.status(200).json({ message: "Session updated" });
  }

  return res.status(400).json({ message: "Bad Request" });
}
