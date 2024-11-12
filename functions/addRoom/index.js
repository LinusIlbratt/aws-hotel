import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { sendResponse } from '../../responses/index.js';

const db = new DynamoDBClient({ region: 'eu-north-1' });

export const handler = async (event) => {
    try {
        const rooms = JSON.parse(event.body);

        // creates an array of `PutRequest`-objekt for each room
        const putRequests = rooms.map(room => ({
            PutRequest: {
                Item: marshall({
                    RoomID: room.roomId,
                    RoomType: room.roomType,
                    available: room.available ? 1 : 0,
                    pricePerNight: room.pricePerNight,
                    maxGuests: room.maxGuests
                })
            }
        }));

        const params = {
            RequestItems: {
                'HotelRooms': putRequests
            }
        };

        // sends batchrequest to DynamoDB
        const command = new BatchWriteItemCommand(params);
        await db.send(command);

        return sendResponse(200, { message: "Rooms added successfully in batch" });
    } catch (error) {
        console.error('Error adding rooms to DynamoDB:', error);
        return sendResponse(500, { message: "Internal Server Error" });
    }
};
