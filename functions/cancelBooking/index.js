import { sendResponse } from '../../responses/index.js';
import { DynamoDBClient, DeleteItemCommand, GetItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const db = new DynamoDBClient({ region: "eu-north-1" });

export const cancelBooking = async (event) => {
    try {
        // Get bookingId from request body
        const bookingId = event.pathParameters?.bookingId;

        if (!bookingId) {
            return sendResponse(400, { success: false, message: "Inget bookingId angivet." });
        }

        // Get bookinginfo from DynamoDB
        const getParams = {
            TableName: "HotelBookings",
            Key: marshall({ bookingID: bookingId })
        };

        const getCommand = new GetItemCommand(getParams);
        const result = await db.send(getCommand);

        if (!result.Item) {
            return sendResponse(404, { success: false, message: "Bokningen finns inte." });
        }

        const booking = unmarshall(result.Item);

        // Error handling if no rooms in booking
        if (!booking.roomIds || booking.roomIds.length === 0) {
            return sendResponse(400, { success: false, message: "Inga rum associerade med bokningen." });
        }

        // Resetting room availability
        for (let roomId of booking.roomIds) {
            const updateParams = {
                TableName: "HotelRooms",
                Key: marshall({ RoomID: roomId }),
                UpdateExpression: "SET available = :newAvailable",
                ExpressionAttributeValues: {
                    ":newAvailable": { N: "1" } // Setting availability to 1 (available)
                }
            };

            const updateCommand = new UpdateItemCommand(updateParams);
            await db.send(updateCommand);
        }

        // Delete from DynamoDB
        const deleteParams = {
            TableName: "HotelBookings",
            Key: marshall({ bookingID: bookingId })
        };
        
        await db.send(new DeleteItemCommand(deleteParams));

        return sendResponse(200, { 
            success: true, 
            message: `Din bokning med ID ${bookingId} är avbokad.`
        });
    } catch (error) {
        console.error('Kunde inte avboka bokning:', error);
        
        return sendResponse(500, { 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};