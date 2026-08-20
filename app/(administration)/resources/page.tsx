import ResourcesView from "@/components/page/(administration)/ResourcesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
};

const Resources = () => {
  return (
    <ResourcesView />
  );
};

export default Resources;