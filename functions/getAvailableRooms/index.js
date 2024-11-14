import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { sendResponse } from "../../responses/index.js";

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
    try {
        const roomType = event.pathParameters?.roomType;
        
        if (roomType && !isValidRoomType(roomType)) {
            return sendResponse(400, { message: "Invalid room type specified" });
        }

        const availableRooms = await checkAvailableRooms(roomType);
       
        if (!availableRooms || availableRooms.length === 0) {
            return sendResponse(404, { message: "No available rooms found" });
        }

        return sendResponse(200, availableRooms);
    } catch (error) {
        console.error("Error in handler:", error);
        return sendResponse(500, { message: "Internal server error" });
    }
};

const isValidRoomType = (type) => {
    const validRoomTypes = ["single", "double", "suite"]; 
    return validRoomTypes.includes(type);
};
