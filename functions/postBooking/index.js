import { sendResponse } from '../../responses/index.js';
import { checkAvailableRooms } from '../getAvailableRooms/index.js';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBClient, ScanCommand, UpdateItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
  
      
   
try {
    const { guests, roomType, checkInDate, checkOutDate, name, email } = JSON.parse(event.body);


    if (!guests || !roomType || !checkInDate || !checkOutDate || !name || !email) {
        return sendResponse(400, { message: "Enter empty fields." });
    }
    const availableRooms = await checkAvailableRooms(roomType);
    const availableRoom = availableRooms.find(room => room.maxGuests >= guests);


    
    if (!availableRoom) {
        return sendResponse(400, { message: "No available rooms can accommodate the number of guests." });
    }

    const updateParams = {
        TableName: "HotelRooms",
        Key: marshall({ RoomID: availableRoom.RoomID }),
        UpdateExpression: "SET available = :newAvailable",
        ExpressionAttributeValues: {
            ":newAvailable": { N: "0" }
        }
    };
    
    const updateCommand = new UpdateItemCommand(updateParams);
    await db.send(updateCommand);

    const booking = {
        bookingID: generateUniqueId(),
        roomId: availableRoom.RoomID,
        roomType: availableRoom.RoomType,
        name,
        email,
        guests,
        checkInDate,
        checkOutDate,
        bookingStatus: "confirmed",
        pricePerNight: availableRoom.pricePerNight
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