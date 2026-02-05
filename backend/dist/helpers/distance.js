"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDistance = calculateDistance;
function calculateDistance(latUser, lngUser, latStore, lngStore) {
    const dLat = (latUser - latStore) * (Math.PI / 180);
    const dLng = (lngUser - lngStore) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(latUser * (Math.PI / 180)) * Math.cos(latStore * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c;
    return distance;
}
;
