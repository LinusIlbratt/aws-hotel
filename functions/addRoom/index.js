import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDbClient = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const { roomId, roomType, available, pricePerNight, maxGuests } = JSON.parse(event.body);

        const room = {
            RoomID: roomId,
            RoomType: roomType,
            available: available === true ? 1 : 0,
            pricePerNight: pricePerNight,
            maxGuests: maxGuests
        };

        console.log("Room object:", room);  

        const params = {
            TableName: "HotelRooms",  
            Item: marshall(room, { removeUndefinedValues: true })
        };
        

        const command = new PutItemCommand(params);
        await dynamoDbClient.send(command);

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Room added to the database successfully" })
        };
    } catch (error) {
        console.error("Error adding room:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
};
