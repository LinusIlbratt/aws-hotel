// find the minimum amounts of rooms to fit all the guests
export function findMinimumRooms(availableRooms, guests) {
    
    availableRooms.sort((a, b) => b.maxGuests - a.maxGuests);

    let selectedRooms = [];
    let totalCapacity = 0;

    for (let room of availableRooms) {
        if (totalCapacity < guests) {
            selectedRooms.push(room);
            totalCapacity += room.maxGuests;
        }
        if (totalCapacity >= guests) break;
    }

    if (totalCapacity >= guests) {
        return selectedRooms;
    }
    return null;
}