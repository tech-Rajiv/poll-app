import { Homebtn } from "@/app/components/Homebtn";
export default function page() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <Homebtn />
        <p className="text-gray-500">
          An error occurred while authenticating. Please try again.
        </p>
      </div>
    </div>
  );
}
