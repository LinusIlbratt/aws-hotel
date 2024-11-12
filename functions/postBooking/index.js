import { sendResponse } from '../../responses/index.js';
import { checkAvailableRooms } from '../getAvailableRooms/index.js';


export const handler = async (event) => {
  
      
   
try {
    const { guests, roomType, checkInDate, checkOutDate, name, email } = JSON.parse(event.body);


    if (!guests || !roomType || !checkInDate || !checkOutDate || !name || !email) {
        return sendResponse(400, { message: 'Enter empty fields.' });
    }
    const availableRooms = checkAvailableRooms(roomType);
    if (availableRooms < guests) {
        return sendResponse(400, { message: "No available rooms"});
    }

    const booking = {
        id: generateUniqueId(),
        name,
        email,
        guests,
        roomType,
        checkInDate,
        checkOutDate,
        status : "Booking confirmed"
    };

    return sendResponse(201, { message: "Booking confirmed",booking});
}catch (error) {
    console.error("something went wrong when booking",error)
    return sendResponse(500,{success: false, message: " Server Error "});
}
    
};

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);

}