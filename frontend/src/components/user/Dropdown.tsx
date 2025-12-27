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
    console.log(session?.user?.avatar)
  return (
    <div>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='w-10 cursor-pointer h-10 rounded-full bg-gray-100 flex justify-center items-center border-2 border-black/20'>
            {session?.user?.avatar !== null  && session?.user?.avatar !== undefined ? (
                <Image src={session?.user?.avatar!} alt='cover' width={40} height={40} />
            ) : (
                <User className='w-6 h-6'/>
            )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <Link href={"/profile"}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>

        <Link href={"/orders"}>
          <DropdownMenuItem>Orders</DropdownMenuItem>
        </Link>

        <Link href={"/address"}>
          <DropdownMenuItem>Address</DropdownMenuItem>
        </Link>

        <Link href={"/password"}>
          <DropdownMenuItem>Password Manager</DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  )
}

export default Dropdown
