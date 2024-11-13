import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const checkAvailableRooms = async (roomType) => { 
    try {
        let command;

        if (roomType) {
            
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

        return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    } catch (error) {
        console.error("Error fetching available rooms:", error);

        throw error;
    }
};
