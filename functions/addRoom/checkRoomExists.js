export const checkRoomExists = async (roomId) => {
    const getItemParams = {
        TableName: 'HotelRooms',
        Key: marshall({ RoomID: roomId })
    };
    const existingRoom = await db.send(new GetItemCommand(getItemParams));
    return !!existingRoom.Item;
};