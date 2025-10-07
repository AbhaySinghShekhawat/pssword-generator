import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function WebLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
