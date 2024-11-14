import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb';
import { sendResponse } from '../../responses/index.js';
import { checkRoomLimit } from './checkRoomLimit.js';
import { createPutRequests } from './createPutRequests.js';
import { checkRoomExists } from './checkRoomExists.js';

const db = new DynamoDBClient({ region: 'eu-north-1' });

export const handler = async (event) => {
    try {
        // check room limit
        const roomLimitReached = await checkRoomLimit('HotelRooms');
        if (roomLimitReached) {
            return sendResponse(400, { message: "Maximum room capacity reached. Cannot add more rooms." });
        }

        const rooms = JSON.parse(event.body);

        // check if room id already exists
        for (const room of rooms) {
            const roomExists = await checkRoomExists(room.roomId);
            if (roomExists) {
                return sendResponse(400, { message: `Room with ID ${room.roomId} already exists.` });
            }
        }

        // create a put request for each room
        const putRequests = createPutRequests(rooms);

        const params = {
            RequestItems: {
                'HotelRooms': putRequests
            }
        };

        // send batch request to DynamoDb
        const command = new BatchWriteItemCommand(params);
        await db.send(command);

        return sendResponse(200, { message: "Rooms added successfully in batch" });
    } catch (error) {
        console.error('Error adding rooms to DynamoDB:', error);
        return sendResponse(500, { message: "Internal Server Error" });
    }
};
