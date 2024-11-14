import { marshall } from '@aws-sdk/util-dynamodb';
import { UpdateItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { sendResponse } from '../../responses/index.js';

// Funktion för att skapa bokningen
export async function createBooking(db, selectedRooms, bookingDetails) {
    const { guests, checkInDate, checkOutDate, name, email } = bookingDetails;

    // Uppdatera tillgänglighet för valda rum i databasen
    for (let room of selectedRooms) {
        const updateParams = {
            TableName: "HotelRooms",
            Key: marshall({ RoomID: room.RoomID }),
            UpdateExpression: "SET available = :newAvailable",
            ConditionExpression: "available = :available", // check if the room is still available
            ExpressionAttributeValues: {
                ":newAvailable": { N: "0" },
                ":available": { N: "1" }
            }
        };
        const updateCommand = new UpdateItemCommand(updateParams);
        await db.send(updateCommand);
    }

    // Skapa bokningen med valda rum
    const totalNights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    const totalPricePerNight = selectedRooms.reduce((total, room) => total + room.pricePerNight, 0);
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
        totalPricePerNight,
        totalCost: totalPricePerNight * totalNights
    };
    const putParams = {
        TableName: "HotelBookings",
        Item: marshall(booking)
    };

    const putCommand = new PutItemCommand(putParams);
    await db.send(putCommand);

    return sendResponse(201, { message: "Booking confirmed", booking });
}

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}
