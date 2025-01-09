"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPanel({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [newUserEmail, setNewUserEmail] = useState("");

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Send a POST request to the /api/users endpoint with the new user's email in the request body.
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newUserEmail }),
    });
    const newUser = await response.json();
    setUsers([...users, newUser]);
    setNewUserEmail("");
  };

  const removeUser = async (userId: string) => {
    // Send a DELETE request to the /api/users/${userId} endpoint.
    await fetch(`/api/users/${userId}`, { method: "DELETE" });
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={addUser} className="mb-4">
        <Label htmlFor="newUserEmail">Add User</Label>
        <div className="flex gap-2">
          <Input
            id="newUserEmail"
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />
          <Button type="submit">Add</Button>
        </div>
      </form>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center">
            <span>
              {user.email} ({user.role})
            </span>
            <Button onClick={() => removeUser(user.id)} variant="destructive">
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
