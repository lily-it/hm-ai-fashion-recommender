"use client";

import React, { useState, useEffect } from "react";

interface Preferences {
  favoriteCategories: string[];
  style: string;
}

const ProfilePage: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    favoriteCategories: [],
    style: "",
  });

  // Load preferences (optional)
  const fetchPreferences = async () => {
    // Example backend request (uncomment when backend ready)
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/preferences`);
    // const data = await response.json();
    // setPreferences(data);
  };

  // Handles input + select events
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setPreferences((prev) => ({
      ...prev,
      [name]:
        name === "favoriteCategories"
          ? value.split(",").map((v) => v.trim())
          : value,
    }));
  };

  // Save preferences to backend (optional)
  const handleSave = async () => {
    // Example backend POST request:
    // await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/preferences`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(preferences),
    // });
    alert("Preferences saved!");
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">User Preferences</h1>

      {/* Favorite Categories */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Favorite Categories</label>
        <input
          type="text"
          name="favoriteCategories"
          value={preferences.favoriteCategories.join(", ")}
          onChange={handleChange}
          className="border rounded p-3 w-full"
          placeholder="e.g., Jackets, Shoes, Hoodies"
        />
        <p className="text-gray-500 text-sm mt-1">
          Separate categories with commas
        </p>
      </div>

      {/* Style Preference */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Preferred Style</label>
        <select
          name="style"
          value={preferences.style}
          onChange={handleChange}
          className="border rounded p-3 w-full"
        >
          <option value="">Select Style</option>
          <option value="casual">Casual</option>
          <option value="streetwear">Streetwear</option>
          <option value="classy">Classy</option>
          <option value="sporty">Sporty</option>
        </select>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
      >
        Save Preferences
      </button>
    </div>
  );
};

export default ProfilePage;
