import React, { useState } from "react";
import generator from "password-generator";

export default function PasswordGenerator({ onGenerate }) {
  const [password, setPassword] = useState("");

  const generate = () => {
    const pwd = generator(12, false); 
    setPassword(pwd);
    onGenerate(pwd);
  };

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setPassword("");
    onGenerate("");         
  };

  return (
    <div className="p-4 border rounded shadow-md mb-4 flex flex-col gap-2">
      <button
        onClick={generate}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Generate Password
      </button>

      {password && (
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={password}
            className="border px-2 py-1 rounded flex-grow"
          />
          <button
            onClick={copyToClipboard}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}
