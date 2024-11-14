import { marshall } from '@aws-sdk/util-dynamodb';

export const createPutRequests = (rooms) => {
    return rooms.map(room => ({
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
};
