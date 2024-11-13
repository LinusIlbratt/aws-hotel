import { sendResponse } from '../../responses/index.js';
import { checkAvailableRooms } from '../getAvailableRooms/index.js';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, ScanCommand, UpdateItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
  
      
   
try {
    const { guests, checkInDate, checkOutDate, name, email } = JSON.parse(event.body);


    if (!guests || !checkInDate || !checkOutDate || !name || !email) {
        return sendResponse(400, { message: "Enter empty fields." });
    }
    const availableRooms = await checkAvailableRooms();
  
   


    
    if (!Array.isArray(availableRooms) || availableRooms.length === 0) {
        return sendResponse(400, { message: "No available rooms found." });
    }

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

    
   
    if (totalCapacity < guests) {
        return sendResponse(400, { message: "No combination of available rooms can accommodate the number of guests." });
    }

for (let room of selectedRooms) {
    const updateParams = {
        TableName: "HotelRooms",
        Key: marshall({ RoomID: room.RoomID }),
        UpdateExpression: "SET available = :newAvailable",
        ExpressionAttributeValues: {
            ":newAvailable": { N: "0" }
        }
    };
    const updateCommand = new UpdateItemCommand(updateParams);
    await db.send(updateCommand)
}
    
    const booking = {
        bookingID: generateUniqueId(),
        roomIds: selectedRooms.map(room => room.RoomID),
        roomTypes: selectedRooms.map(room => room.RoomType),
        name,
        email,
        guests,
        checkInDate,
        checkOutDate,
        bookingStatus: "confirmed",
        totalPricePerNight: selectedRooms.reduce((total, room) => total + room.pricePerNight, 0)
    };
    const putParams = {
        TableName: "HotelBookings",
        Item: marshall(booking)
    };
    
    const putCommand = new PutItemCommand(putParams);
    await db.send(putCommand);


    return sendResponse(201, { message: "Booking confirmed",booking});
}catch (error) {
    console.error("something went wrong when booking",error)
    return sendResponse(500,{success: false, message: " Server Error "});
}
    
};

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);

}