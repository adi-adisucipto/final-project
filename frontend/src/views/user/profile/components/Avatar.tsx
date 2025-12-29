"use client"

import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react"

interface FileProps {
  name: string;
  setFieldValue: (field:string, value: File | null) => void;
}

function Avatar({name, setFieldValue}: FileProps) {
  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] ?? null;
    if(file && file.type.startsWith('image/')) {
      setFieldValue(name, file);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <div
      className="w-37.5 h-37.5 rounded-full bg-gray-100 mb-6 border border-black/30"
      onClick={() => fileInputRef.current?.click()}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="text-[10px] text-center text-gray-500 flex justify-center items-center h-full w-full">
          {session?.user?.avatar !== null ? (
            <Image src={session?.user?.avatar || "/default-avatar.png"} alt="avatar" width={150} height={150} className="rounded-full"/>
          ) : (
            <User size={40}/>
          )}
        </span>
      )}
      <input
        type="file"
        name={name}
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}

export default Avatar
