import { sendResponse } from '../../responses/index.js';

export const handler = async () => {
    try {
        return sendResponse(200, { message: "Det finns 10 lediga enkel rum" });
    } catch (error) {
        console.error('Du hittade inga lediga rum:', error);
        
        return sendResponse(500, { success: false, message: 'Internal Server Error' });
    }

}