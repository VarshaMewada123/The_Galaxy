import { memo } from "react";

const Loader = memo(function Loader() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
    </div>
  );
});

export default Loader;
