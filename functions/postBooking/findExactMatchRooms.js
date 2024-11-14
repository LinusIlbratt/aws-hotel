export function findExactMatchRooms(availableRooms, guests) {
    
    function findCombination(index, remainingGuests, currentRooms) {
        if (remainingGuests === 0) {
            return currentRooms;
        }
        if (index >= availableRooms.length || remainingGuests < 0) {
            return null;
        }
        
        const withRoom = findCombination(index + 1, remainingGuests - availableRooms[index].maxGuests, [...currentRooms, availableRooms[index]]);
        if (withRoom) {
            return withRoom;
        }
       
        return findCombination(index + 1, remainingGuests, currentRooms);
    }

    return findCombination(0, guests, []);
}