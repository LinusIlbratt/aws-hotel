import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendResponse } from '../../responses/index.js';

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async () => {
    try {
        const params = {
            TableName: "HotelBookings"
        };

        // TODO: ändra hur sökningen fungerar efter alvins Table design
        const command = new ScanCommand(params);
        const result = await dynamoDbClient.send(command);

        
        const bookings = result.Items.map((item) => {
            const unmarshalledItem = unmarshall(item);
            return {
                id: unmarshalledItem.BookingID,
                name: unmarshalledItem.name,
                email: unmarshalledItem.email,
                guests: unmarshalledItem.guests,
                roomType: unmarshalledItem.roomType,
                checkInDate: unmarshalledItem.checkInDate,
                checkOutDate: unmarshalledItem.checkOutDate,
                status: unmarshalledItem.status
            };
        });

        return sendResponse(200, { bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return sendResponse(500, { success: false, message: "Internal Server Error" });
    }
};
