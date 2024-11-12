import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendResponse } from '../../responses/index.js';

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        // GET roomType from path parameters (e.g., /available-rooms/single)
        const roomType = event.pathParameters?.roomType;

        let command;
        
        if (roomType) {
            // Query if a specific room type is provided
            const params = {
                TableName: "HotelRooms",
                IndexName: "RoomTypeAvailableIndex",
                KeyConditionExpression: "RoomType = :roomType AND available = :available",
                ExpressionAttributeValues: {
                    ":roomType": { S: roomType },
                    ":available": { N: "1" }
                }
            };
            command = new QueryCommand(params);
        } else {
            // Scan to get all available rooms if no specific room type is provided
            const params = {
                TableName: "HotelRooms",
                FilterExpression: "available = :available",
                ExpressionAttributeValues: {
                    ":available": { N: "1" }
                }
            };
            command = new ScanCommand(params);
        }

        const result = await dynamoDbClient.send(command);
        const rooms = result.Items.map((item) => unmarshall(item));

        return sendResponse(200, { rooms });
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        return sendResponse(500, { success: false, message: "Internal Server Error" });
    }
};
