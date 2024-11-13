import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendResponse } from '../../responses/index.js';

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        
        const { bookingId } = JSON.parse(event.body);        
        if (!bookingId) {
            return sendResponse(400, { message: "Booking ID is required" });
        }

        const params = {
            TableName: "HotelBookings",
            Key: {
                bookingID: { S: bookingId }
            }
        };

        const command = new GetItemCommand(params);
        const result = await dynamoDbClient.send(command);

        if (!result.Item) {
            return sendResponse(404, { message: "Booking not found" });
        }

        const unmarshalledItem = unmarshall(result.Item);
        const booking = {
            id: unmarshalledItem.BookingID,
            name: unmarshalledItem.name,
            email: unmarshalledItem.email,
            guests: unmarshalledItem.guests,
            roomType: unmarshalledItem.roomType,
            checkInDate: unmarshalledItem.checkInDate,
            checkOutDate: unmarshalledItem.checkOutDate,
            status: unmarshalledItem.status
        };

        return sendResponse(200, { booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        return sendResponse(500, { success: false, message: "Internal Server Error" });
    }
};
