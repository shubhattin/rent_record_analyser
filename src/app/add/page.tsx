import type { Metadata } from "next";
import AddForm from "./AddForm";

export const metadata: Metadata = {
  title: "Add New Rent Record",
};

export default function Add() {
  return <AddForm />;
}
