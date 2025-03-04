import { Link, useLocation } from "wouter";
import { Home, Plus, User } from "lucide-react";

export default function NavigationBar() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="max-w-screen-md mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link href="/">
            <a className={`flex flex-col items-center p-2 min-h-[40px] ${location === "/" ? "text-[#4CAF50]" : "text-gray-500"}`}>
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          <Link href="/post">
            <a className={`flex flex-col items-center p-2 min-h-[40px] ${location === "/post" ? "text-[#4CAF50]" : "text-gray-500"}`}>
              <Plus className="w-6 h-6" />
              <span className="text-xs mt-1">Post</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`flex flex-col items-center p-2 min-h-[40px] ${location === "/profile" ? "text-[#4CAF50]" : "text-gray-500"}`}>
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}