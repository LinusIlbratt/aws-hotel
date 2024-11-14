import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const db = new DynamoDBClient({ region: 'eu-north-1' });

export const checkRoomLimit = async (tableName, limit = 20) => {
    const scanParams = {
        TableName: tableName,
        Select: 'COUNT'
    };
    const scanCommand = new ScanCommand(scanParams);
    const scanResult = await db.send(scanCommand);
    return scanResult.Count >= limit;
};
