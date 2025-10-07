import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-6 shadow-inner">
      <p className="text-sm md:text-base">
        © {currentYear} <span className="font-bold text-blue-500">Password Vault</span>. All rights reserved.
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
}
