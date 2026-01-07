"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface SearchItem<T> {
    items: T[];
    labelKey: string;
    placeholder: string;
    onSelect: (item: T) => void;
    value?: number;
}

function DropDown<T extends Record<string, any>>({
    items,
    labelKey,
    placeholder,
    onSelect,
    value
}: SearchItem<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, []);

    const filteredItems = useMemo(() => {
      if(!searchTerm.trim()) return items;
      const lowerSearch = searchTerm.toLocaleLowerCase();
      return items.filter(item => 
        item[labelKey].toLowerCase().includes(lowerSearch)
      );
    }, [items, searchTerm])

    const seletedItem = useMemo(() =>
        items.find((item) => item.id === value),
        [items, value]
    );

    const handleSelect = (item: T) => {
        onSelect(item);
        setIsOpen(false);
    }
  return (
    <div className="relative w-full" ref={dropdownRef}>
        <div
            onClick={() => setIsOpen(!isOpen)}
            className={`px-4 py-3 flex bg-[#F7FBFF] mt-2 mb-1 justify-between border rounded-xl transition-all duration-200 cursor-pointer ${isOpen ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300"}`}
        >
            <div className="flex justify-between items-center w-full transition-all duration-200">
                <div>
                    {!seletedItem ? (
                        <p className="text-gray-500 italic">{placeholder}</p>
                    ) : (
                        <div>{seletedItem[labelKey]}</div>
                    )}
                </div>
                {!isOpen ? (<ChevronDown/>) : (<ChevronUp/>)}
            </div>
        </div>

        {isOpen && (
            <div className="rounded-md shadow-xl p-3 absolute z-50 w-full max-w-7xl bg-white border border-slate-200 slide-in-from-top-2">
                <div
                    className="border-b border-slate-100 flex gap-2 justify-center items-center pb-3 w-full"
                >
                    <div className="relative w-full flex items-center">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                        <input
                            autoFocus
                            className="bg-slate-100 w-full py-2 rounded-xl pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>

                <div className="max-h-60 overflow-y-auto mt-2">
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className={`
                                flex flex-col px-4 py-3 cursor-pointer transition-colors border-b border-slate-50 last:border-none
                                ${value === item.id ? 'bg-green-50' : 'hover:bg-slate-50'}
                            `}
                            onClick={() => handleSelect(item)}
                        >
                            <div className={`text-sm font-semibold ${value === item.id ? 'text-green-500' : 'text-slate-800'}`}>
                                {item[labelKey]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  )
}

export default DropDown
