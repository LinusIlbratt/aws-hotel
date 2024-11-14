import { sendResponse } from '../../responses/index.js';
import { checkAvailableRooms } from '../getAvailableRooms/index.js';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { findExactMatchRooms } from './findExactMatchRooms.js';
import { findMinimumRooms } from './findMinimumRooms.js';
import { createBooking } from './createBooking.js';


const db = new DynamoDBClient({ region: "eu-north-1" });

export const handler = async (event) => {
    try {
        const { guests, checkInDate, checkOutDate, name, email } = JSON.parse(event.body);

        if (!guests || !checkInDate || !checkOutDate || !name || !email) {
            return sendResponse(400, { message: "Enter empty fields." });
        }

        const availableRooms = await checkAvailableRooms();

        if (!Array.isArray(availableRooms) || availableRooms.length === 0) {
            return sendResponse(400, { message: "No available rooms found." });
        }

        // Sort rooms by maxGuests in descending order
        availableRooms.sort((a, b) => b.maxGuests - a.maxGuests);

        // Step 1: find the least amount of rooms to fit all the guests
        const optimalRooms = findMinimumRooms(availableRooms, guests);

        if (optimalRooms) {
            // if we find an optimal combination, book these rooms
            return await createBooking(db, optimalRooms, { guests, checkInDate, checkOutDate, name, email });
        }

        // Step 2: try and find an exact match for total rooms and total guests
        const exactMatchRooms = findExactMatchRooms(availableRooms, guests);

        if (exactMatchRooms) {
            // if we find a match, book these rooms
            return await createBooking(db, exactMatchRooms, { guests, checkInDate, checkOutDate, name, email });
        }

        return sendResponse(400, { message: "No combination of available rooms can accommodate the number of guests." });

    } catch (error) {
        console.error("something went wrong when booking", error);
        return sendResponse(500, { success: false, message: "Server Error" });
    }
};

