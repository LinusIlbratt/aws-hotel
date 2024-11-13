import { sendResponse } from '../../responses/index.js';
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({ region: "eu-north-1" });

export const cancelBooking = async (event) => {
    try {
        const { bookingId } = JSON.parse(event.body);

        if (!bookingId) {
            return sendResponse(400, { success: false, message: "Inget bookingId angivet." });
        }

        // DynamoDB-request 
        const deleteParams = {
            TableName: "HotelBookings",
            Key: { bookingID: { S: bookingId } }
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