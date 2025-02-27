"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function verify() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 3: Verify the 2FA code with the backend
    const res = await fetch("http://127.0.0.1:8000/verify-2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const result = await res.json();

    if (res.ok && result.valid) {
      // Step 4: If the code is valid, finalize the authentication process
      const user = await signIn("credentials", {
        redirect: false,
        username: router.query.username, // Use query params or session to retrieve credentials
        password: router.query.password,
      });

      if (user?.error) {
        setError("Invalid credentials.");
      } else {
        router.push("/dashboard"); // Redirect to the dashboard after successful login
      }
    } else {
      setError("Invalid 2FA code.");
    }
  };

  return (
    <html>
      <body>
        <div>
          <h1>Enter the 2FA Code</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the 6-digit code"
            />
            {error && <p>{error}</p>}
            <button type="submit">Verify</button>
          </form>
        </div>
      </body>
    </html>
  );
}
