import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function UserHeader({ setOpen }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/users/logout", {});
      if (res.data.message) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default UserHeader;