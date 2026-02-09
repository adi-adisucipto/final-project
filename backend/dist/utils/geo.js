"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistanceKm = void 0;
const EARTH_RADIUS_KM = 6371;
const toRad = (value) => (value * Math.PI) / 180;
const calculateDistanceKm = (from, to) => {
    const dLat = toRad(to.lat - from.lat);
    const dLng = toRad(to.lng - from.lng);
    const lat1 = toRad(from.lat);
    const lat2 = toRad(to.lat);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
exports.calculateDistanceKm = calculateDistanceKm;
