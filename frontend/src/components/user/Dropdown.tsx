import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

function Dropdown() {
    const { data: session, status } = useSession();
  return (
    <div>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='w-10 cursor-pointer h-10 rounded-full bg-gray-100 flex justify-center items-center border-2 border-black/20'>
            {session?.user?.avatar !== null ? (
                <Image src={session?.user?.avatar!} alt='cover' width={40} height={40} />
            ) : (
                <User className='w-6 h-6'/>
            )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
            <Link href={"/profile"}>Profile</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
            <Link href={"/orders"}>My Orders</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
            <Link href={"/address"}>Manage Address</Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
            <Link href={"/password"}>Password Manager</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}

export default Dropdown
