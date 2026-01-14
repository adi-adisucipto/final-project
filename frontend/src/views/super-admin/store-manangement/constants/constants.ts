import { StoreProps } from "../types/store";

export const STORES: StoreProps[] = [
  {
    name: 'Groceria Jakarta Selatan',
    address: 'Jl. RS. Fatmawati Raya No.15, Gandaria Sel., Kec. Cilandak, Jakarta Selatan',
    admin: { name: 'Budi Santoso', email: 'budi@gmail.com', avatar: null },
    status: true,
    location: { lat: -6.273, lng: 106.797 }
  },
  {
    name: 'Groceria Bandung Pusat',
    address: 'Jl. Braga No.22, Braga, Kec. Sumur Bandung, Kota Bandung',
    admin: { name: 'Siti Aminah', email: 'siti.a@gmail.com', avatar: null },
    status: false,
    location: { lat: -6.917, lng: 107.609 }
  },
  {
    name: 'Groceria Surabaya Timur',
    address: 'Jl. Raya Gubeng No.45, Gubeng, Kota Surabaya, Jawa Timur',
    admin: { name: 'Dimas Pratama', email: 'dimas.p@gmail.com', avatar: null },
    status: true,
    location: { lat: -7.275, lng: 112.744 }
  },
  {
    name: 'Groceria Medan',
    address: 'Jl. Gajah Mada No.10, Petisah Hulu, Kota Medan, Sumatera Utara',
    admin: null,
    status: false,
    location: { lat: 3.585, lng: 98.667 }
  },
  {
    name: 'Groceria Bali Sunset',
    address: 'Jl. Sunset Road No.101, Kuta, Kabupaten Badung, Bali',
    admin: { name: 'Rina Kartika', email: 'rina.k@gmail.com', avatar: null },
    status: true,
    location: { lat: -8.706, lng: 115.178 }
  },
  {
    name: 'Groceria Lampung',
    address: 'Jl. Kapten Abdul Haq No. 17, Lampung, Kota Bandar Lampung',
    admin: { name: 'Adi Sucipto', email: 'suciptoadi550@gmail.com', avatar: null },
    status: false,
    location: { lat: -5.35, lng: 115.178 }
  }
];