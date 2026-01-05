import { useState, useEffect } from "react"

interface LocationState {
    loaded: boolean;
    coordinates: {lat: number | string, lng: number | string};
    error: { code: number, message: string } | null;
}

const useGeolocation = () => {
    const [location, setLocation] = useState<LocationState>({
        loaded: false,
        coordinates: { lat: "", lng: "" },
        error: null,
    });

    const onSuccess = (location: GeolocationPosition) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
            error: null,
        });
    };

    const onError = (error: GeolocationPositionError | { code: number; message: string }) => {
        setLocation({
            loaded: true,
            coordinates: { lat: "", lng: "" },
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    useEffect(() => {
        if (!("geolocation" in navigator)) {
        onError({
            code: 0,
            message: "Geolocation tidak didukung oleh browser Anda",
        });
        return;
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }, []);

    return location;
}

export default useGeolocation;