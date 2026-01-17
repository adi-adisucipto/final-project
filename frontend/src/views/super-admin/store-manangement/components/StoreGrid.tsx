"use client"

import StoreCard from "./StoreCard"
import { StoreProps } from "../types/store";

interface StoreGridProps {
  stores: StoreProps[];
  onDelete: (id:string) => void;
  onEditStore?: (store: StoreProps) => void;
  onAssignAdmin?: (store: StoreProps) => void;
}

function StoreGrid({stores, onDelete, onEditStore, onAssignAdmin}: StoreGridProps) {
  return (
    <div className="grid xl:grid-cols-3 gap-4 grid-cols-1">
      {stores.map((store, index) => (
        <div key={index}>
            <StoreCard
                store={store}
                index={index}
                onDelete={onDelete}
                onEditStore={onEditStore}
                onAssignAdmin={onAssignAdmin}
            />
        </div>
      ))}
    </div>
  )
}

export default StoreGrid
