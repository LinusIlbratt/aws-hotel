import { sendResponse } from '../../responses/index.js';

export const cancelBooking = async (event) => {
    try {
        const { bookingId } = event.pathParameters;
        console.log(`Avbokar bokning med ID: ${bookingId}`);
        
        return sendResponse(200, { 
            success: true, 
            message: `Din bokning med ID ${bookingId} är avbokad.`
        });
    } catch (error) {
        console.error('Kunde inte avboka bokning:', error);
        
        return sendResponse(500, { 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};