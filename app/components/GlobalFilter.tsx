import { Input } from "@headlessui/react";
import usePreferences from "../stores/Preferences";

const GlobalFilter = () => {
  const { filter, setFilter } = usePreferences();

  return (
    <Input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder="Filter candidates by name"
      className="input border border-gray-300 rounded p-2 max-w-96"
    />
  );
};

export default GlobalFilter;
