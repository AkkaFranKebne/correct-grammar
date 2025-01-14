"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

/*
Client Component, which cannot directly access the server-side resources.
Client Components need to make API calls to interact with the server and database.
This approach provides a clear separation of concerns and can be reused by other client components.
It allows for easier testing and mocking of the API

API route approach sis necessary for client-side components that need to interact with the server. It's particularly useful for:

1. Dynamic data fetching based on user interactions.
2. Operations that need to be performed after the initial page load.
3. Reusable API endpoints that might be called from multiple components or even external services.
*/

type User = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPanel({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    // Send a POST request to the /api/users endpoint with the new user's email in the request body.
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newUserEmail }),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setNewUserEmail("");
        setMessage("User added successfully");
      } else {
        const data = await response.json();
        setError(data.message || "Error adding user");
      }
    } catch (err) {
      setError("Error adding user");
    }
  };

  const removeUser = async (userId: string) => {
    setError("");
    setMessage("");
    // Send a DELETE request to the /api/users/${userId} endpoint.
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        setMessage("User removed successfully");
      } else {
        const data = await response.json();
        setError(data.message || "Error removing user");
      }
    } catch (err) {
      setError("Error removing user");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Admin Panel</h1>
      <form onSubmit={addUser} className="mb-4">
        <Label
          htmlFor="newUserEmail"
          className="text-base font-medium text-gray-900"
        >
          Add User
        </Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="newUserEmail"
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
            className="flex-grow text-base text-gray-900 bg-gray-50 focus:ring-2 focus:ring-blue-500"
            aria-describedby="add-user-description"
          />
          <span id="add-user-description" className="sr-only">
            Enter a valid email address for the new user (minimum 8 characters)
          </span>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
          >
            Add
          </Button>
        </div>
      </form>
      {message && (
        <Alert className="mb-4">
          <AlertDescription id="admin-success">{message}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription id="admin-error">{error}</AlertDescription>
        </Alert>
      )}
      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="text-base text-gray-900">
              {user.email} ({user.role})
            </span>
            <Button
              onClick={() => removeUser(user.id)}
              variant="destructive"
              className="focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-base font-medium"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
