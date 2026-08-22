import ProcessesView from "@/components/page/(administration)/ProcessesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processes",
};

const Processes = () => {
  return (
    <ProcessesView />
  );
};

export default Processes;