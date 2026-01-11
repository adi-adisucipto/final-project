import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Tag,
  ShoppingCart,
  ClipboardList,
} from "lucide-react"

export const storeadminsideLinks = [
    {icon: ShoppingCart, label: "Orders", href: "/storeadmin/store-orders"},
    {icon: Package, label: "Product & Stock", href: "/storeadmin/store-product-stock"},
    {icon: Tag, label: "Discount", href: "/storeadmin/store-discount"},
    {icon: TrendingUp, label: "Sales Report", href: "/storeadmin/store-sales-report"},
    {icon: ClipboardList, label: "Inventory Report", href: "/storeadmin/store-inventory-report"}, 
]