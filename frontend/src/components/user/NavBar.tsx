"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { useWindowSize } from 'react-use';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle
} from '../ui/drawer';
import { Menu, ShoppingCart, User, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { nav_links } from '@/lib/nav-links';
import { IconButton } from '../ui/icon-button';
import { useSession } from 'next-auth/react';
import Dropdown from './Dropdown';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const size = useWindowSize();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (size?.width && size?.width > 767 && isOpen) {
            setIsOpen(false);
        }
    }, [size, isOpen]);

  return (
    <div className='xl:max-w-7xl mx-auto sticky top-0 z-30 border mt-4 px-4 backdrop-blur-xl rounded-xl shadow-lg'>
        <div className='xl:max-w-7xl px-5 py-4 xl:px-0 mx-auto flex justify-between items-center gap-3'>
            <div className=''>
                <Link href={"/"}>
                    <Image src="/logo.png" alt='Logo' width={170} height={40} className='xl:w-42.5 w-30' />
                </Link>
            </div>

            <div className='xl:flex hidden gap-30 text-black/70 justify-between items-center'>
                {nav_links.map((item, index) => {
                    const isActive = pathname === item.link;
                    return (
                        <Link key={index} href={item.link} className={`hover:text-[#22C55E] font-medium ${isActive ? "text-[#22C55E]" : ""}`}>{item.name}</Link>
                    )
                })}
            </div>

            <div className='xl:flex hidden gap-5'>
                {status !== 'authenticated' ? (
                    <div className='flex gap-5'>
                        <Link href={"/login"}><Button variant={"outline"} className='rounded-md'>Login</Button></Link>
                        <Link href={"/registration"}><Button className='rounded-md'>Sign up</Button></Link>
                    </div>
                ) : (
                    <div className='flex gap-4'>
                        <IconButton>
                            <ShoppingCart className='w-5 h-5'/>
                        </IconButton>
                        <div className='bg-black/20 w-px h-full'></div>
                        <Dropdown/>
                    </div>
                )}
            </div>

            <Drawer open={isOpen} onOpenChange={setIsOpen} direction='right'>
                <DrawerTrigger asChild className='flex xl:hidden'>
                    <IconButton>
                        <Menu/>
                    </IconButton>
                </DrawerTrigger>
                <VisuallyHidden>
                    <DrawerTitle></DrawerTitle>
                </VisuallyHidden>
                <DrawerContent>
                    <div>
                        <div className="flex justify-between items-center p-4 border-b">
                            <Link href={"/"}>
                                <Image src={"/logo.png"} alt='logo' width={100} height={50} />
                            </Link>
                            <DrawerClose asChild>
                                <IconButton>
                                    <X/>
                                </IconButton>
                            </DrawerClose>
                        </div>

                        <div className="p-4 border-b">
                            <ul className="flex flex-col gap-2 font-medium dark:text-white text-gray-600">
                                {nav_links.map((item, index) => {
                                    const isActive = pathname === item.link;
                                    return (
                                        <li key={index}>
                                            <Link href={item.link} onClick={() => {
                                                const timeoutId = setTimeout(() => {
                                                setIsOpen(false);
                                                clearTimeout(timeoutId);
                                                }, 500)}}
                                                className={`hover:text-[#22C55E] flex flex-col gap-10 ? ${isActive ? "text-[#22C55E]" : ""}`}
                                                >{item.name}</Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        <div className='p-4 flex flex-col gap-4'>
                            {status !== 'authenticated' ? (
                                <div className='flex flex-col gap-4'>
                                    <Link href={"/login"}><Button variant={"outline"} className='w-full'>Login</Button></Link>
                                    <Link href={"/registration"}><Button className='w-full'>Sign up</Button></Link>
                                </div>
                            ) : (
                                <div className='flex flex-col gap-4'>
                                    <Link href={"/profile"}><Button variant={"outline"} className='w-full'>Profile</Button></Link>
                                    <Link href={"/cart"}><Button className='w-full'><ShoppingCart/> Cart</Button></Link>
                                </div>
                            )}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    </div>
  )
}

export default NavBar
