"use client";

import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        const redirectByRole = async () => {
            const session = await getSession();

            if (!session?.user) {
                router.replace("/");
                return;
            }

            const { role, isStoreAdmin, storeAdminId } = session.user;

            if (role === "super") {
                router.replace("/admin");
                return;
            }

            if (role === "admin") {
                if (isStoreAdmin || storeAdminId) {
                    router.replace("/storeadmin");
                } else {
                    router.replace("/");
                }
                return;
            }

            if (role === "user") {
                router.replace("/");
                return;
            }

            router.replace("/");
        };

        redirectByRole();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Redirecting...</p>
        </div>
    );
}
