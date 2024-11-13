import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });


export const checkAvailableRooms = async (roomType = null) => {
    
    const params = {
        TableName: "HotelRooms",
        ExpressionAttributeValues: {
            ":available": { N: "1" }
        },
    };

    
    if (roomType) {
        params.IndexName = "RoomTypeAvailableIndex";
        params.KeyConditionExpression = "RoomType = :roomType AND available = :available";
        params.ExpressionAttributeValues[":roomType"] = { S: roomType };
    } else {
        params.IndexName = "AvailableIndex";
        params.KeyConditionExpression = "available = :available";
    }

    try {
        const command = new QueryCommand(params);
        const result = await dynamoDbClient.send(command);

        return result.Items ? result.Items.map((item) => unmarshall(item)) : [];
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        throw error;
    }
};


export const handler = async (event) => {
    const roomType = event.pathParameters?.roomType;
    return await checkAvailableRooms(roomType);
};
