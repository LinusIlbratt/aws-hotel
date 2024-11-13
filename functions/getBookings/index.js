import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendResponse } from '../../responses/index.js';

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async () => {
    try {
        const params = {
            TableName: "HotelBookings"
        };

        const command = new ScanCommand(params);
        const result = await dynamoDbClient.send(command);

        // Bearbeta bokningslistan för att bara inkludera relevanta fält
        const bookings = result.Items.map((item) => {
            const unmarshalledItem = unmarshall(item);
            return {
                bookingId: unmarshalledItem.bookingID,
                name: unmarshalledItem.name,
                email: unmarshalledItem.email,
                checkInDate: unmarshalledItem.checkInDate,
                checkOutDate: unmarshalledItem.checkOutDate,
                guests: unmarshalledItem.guests,
                rooms: unmarshalledItem.roomId,
                type: unmarshalledItem.roomType                
            };
        });

        return sendResponse(200, { bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return sendResponse(500, { success: false, message: "Internal Server Error" });
    }
};
