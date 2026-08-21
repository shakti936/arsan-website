import { notFound } from "next/navigation";

/** Unknown routes under a valid locale render the localized 404. */
export default function CatchAll() {
  notFound();
}
