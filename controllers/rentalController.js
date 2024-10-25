// exports.requestRental = (req, res) => {
//     const { serial_number, start_date, end_date } = req.body;

//     // Assuming req.user.id contains the logged-in user's ID
//     const renter_id = req.user.id;

//     // Step 1: Get the item details by serial_number
//     const itemQuery = "SELECT id, user_id, status FROM item WHERE serial_number = ?";
//     con.query(itemQuery, [serial_number], (err, itemResult) => {
//         if (err) {
//             console.error(err); // Log the error for debugging
//             return res.status(500).json({ msg: "An error occurred while retrieving the item.", error: err });
//         }

//         // Check if the item was found
//         if (itemResult.length === 0) {
//             return res.status(404).json({ msg: "Item not found." });
//         }

//         const item = itemResult[0];

//         // Step 2: Check if the item is available
//         if (item.status !== 'available') {
//             return res.status(400).json({ msg: "Item is not available for rent." });
//         }

//         // Step 3: Insert the rental request
//         const requestQuery = `
//             INSERT INTO rental_request (item_id, owner_id, renter_id, start_date, end_date)
//             VALUES (?, ?, ?, ?, ?)
//         `;
//         con.query(requestQuery, [item.id, item.user_id, renter_id, start_date, end_date], (err, result) => {
//             if (err) {
//                 console.error(err); // Log the error for debugging
//                 return res.status(500).json({ msg: "An error occurred while creating rental request.", error: err });
//             }

//             // Respond with success message and the newly created request ID
//             res.status(201).json({ msg: "Rental request created successfully", requestId: result.insertId });
//         });
//     });
// };
// const con = require("../config/database"); // Ensure this path is correct

// // Function to calculate the rental invoice based on the rental duration and item prices
// const calculateRentalInvoice = (pricePerDay, pricePerWeek, pricePerMonth, pricePerYear, startDate, endDate) => {
//     const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate total rental days
//     let totalCost = 0;

//     const months = Math.floor(totalDays / 28); // Each month is treated as 28 days
//     const remainingDays = totalDays % 28;

//     if (months > 0) {
//         totalCost += months * pricePerMonth; // Add monthly costs
//     }

//     // Calculate remaining days cost if there are any
//     if (remainingDays > 0) {
//         if (remainingDays <= 7) {
//             totalCost += remainingDays * pricePerDay; // Daily cost for leftover days
//         } else {
//             totalCost += Math.ceil(remainingDays / 7) * pricePerWeek; // Weekly cost for leftover days
//         }
//     }

//     return totalCost; // Return total rental cost
// };


// exports.requestRental = (req, res) => {
//     const { serial_number, start_date, end_date } = req.body;

//     // Assuming req.user.id contains the logged-in user's ID
//     const renter_id = req.user.id;

//     // Step 1: Get the item details by serial_number
//     const itemQuery = "SELECT id, user_id, status, price_per_day, price_per_week, price_per_month FROM item WHERE serial_number = ?";
//     con.query(itemQuery, [serial_number], (err, itemResult) => {
//         if (err) {
//             console.error(err); // Log the error for debugging
//             return res.status(500).json({ msg: "An error occurred while retrieving the item.", error: err });
//         }

//         // Check if the item was found
//         if (itemResult.length === 0) {
//             return res.status(404).json({ msg: "Item not found." });
//         }

//         const item = itemResult[0];

//         // Step 2: Check if the item is available
//         if (item.status !== 'available') {
//             return res.status(400).json({ msg: "Item is not available for rent." });
//         }






        

//         // Step 3: Calculate the rental invoice
//         const startDate = new Date(start_date);
//         const endDate = new Date(end_date);
//         if (startDate >= endDate) {
//             return res.status(400).json({ msg: "Invalid rental period." });
//         }

//         const totalCost = calculateRentalInvoice(
//             item.price_per_day,
//             item.price_per_week,
//             item.price_per_month,
//             item.price_per_year,
//             startDate,
//             endDate
//         );

//         // Step 4: Insert the rental request
//         const requestQuery = `
//             INSERT INTO rental_request (item_id, owner_id, renter_id, start_date, end_date, total_cost)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         con.query(requestQuery, [item.id, item.user_id, renter_id, startDate, endDate, totalCost], (err, result) => {
//             if (err) {
//                 console.error(err); // Log the error for debugging
//                 return res.status(500).json({ msg: "An error occurred while creating rental request.", error: err });
//             }

//             // Respond with success message and the newly created request ID
//             res.status(201).json({
//                 msg: "Rental request created successfully",
//                 requestId: result.insertId,
//                 totalCost: totalCost // Return the calculated total cost
//             });
//         });
//     });
// };

const axios = require('axios'); // Make sure axios is installed to make HTTP requests
const con = require("../config/database"); // Ensure this path is correct

// Function to calculate the rental invoice based on the rental duration and item prices
const calculateRentalInvoice = (pricePerDay, pricePerWeek, pricePerMonth, pricePerYear, startDate, endDate) => {
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate total rental days
    let totalCost = 0;

    const months = Math.floor(totalDays / 28); // Each month is treated as 28 days
    const remainingDays = totalDays % 28;

    if (months > 0) {
        totalCost += months * pricePerMonth; // Add monthly costs
    }

    // Calculate remaining days cost if there are any
    if (remainingDays > 0) {
        if (remainingDays <= 7) {
            totalCost += remainingDays * pricePerDay; // Daily cost for leftover days
        } else {
            totalCost += Math.ceil(remainingDays / 7) * pricePerWeek; // Weekly cost for leftover days
        }
    }

    return totalCost; // Return total rental cost
};

// Helper function to fetch city from latitude and longitude
async function getCityFromCoordinates(latitude, longitude) {
    const apiKey = '0aa1eb33eefd41a5bf3ba8da99e66e82'; // Replace with your actual geolocation API key (e.g., OpenCage or Google Geocoding)
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const city = response.data.results[0].components.city || response.data.results[0].components.town || 'Unknown';
        return city;
    } catch (error) {
        console.error("Error fetching city:", error);
        return 'Unknown';
    }
}


// Function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
}

exports.requestRental = async (req, res) => {
    const { serial_number, start_date, end_date, delivery_method, pickup_id } = req.body;
    const renter_id = req.user.id;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Step 1: Get the item details by serial_number and check availability range
    const itemQuery = `
        SELECT id, user_id, status, price_per_day, price_per_week, price_per_month, price_per_year, available_from, available_until
        FROM item
        WHERE serial_number = ?;
    `;

    con.query(itemQuery, [serial_number], async (err, itemResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving the item.", error: err });
        }

        if (itemResult.length === 0) {
            return res.status(404).json({ msg: "Item not found." });
        }

        const item = itemResult[0];
        const availabilityStart = new Date(item.available_from);
        const availabilityEnd = new Date(item.available_until);

        if (startDate < availabilityStart || endDate > availabilityEnd) {
            return res.status(400).json({
                msg: `Item is only available from ${availabilityStart.toISOString().split('T')[0]} to ${availabilityEnd.toISOString().split('T')[0]}.`
            });
        }

        // Step 2: Check for rental conflicts
        const rentalCheckQuery = `
            SELECT *
            FROM rental
            WHERE item_id = ? AND status = 'rented'
            AND (
                (start_date <= ? AND end_date >= ?) OR 
                (start_date <= ? AND end_date >= ?) OR 
                (start_date >= ? AND end_date <= ?)
            );
        `;

        con.query(rentalCheckQuery, [item.id, endDate, startDate, endDate, startDate, startDate, endDate], (err, rentalResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "An error occurred while checking rental conflicts.", error: err });
            }

            if (rentalResult.length > 0) {
                return res.status(400).json({ msg: "Item is rented during the requested period." });
            }

            if (item.status !== 'available') {
                return res.status(400).json({ msg: "Item is not available for rent." });
            }

            if (startDate >= endDate) {
                return res.status(400).json({ msg: "Invalid rental period." });
            }

            // Step 3: Get geographical locations from the users table
            let renterLocation, ownerLocation;

            const userQuery = `
                SELECT address FROM users WHERE userID IN (?, ?);
            `;

            con.query(userQuery, [renter_id, item.user_id], (err, userResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: "An error occurred while retrieving user addresses.", error: err });
                }

                if (userResult.length < 2) {
                    return res.status(404).json({ msg: "Owner or renter not found." });
                }

                renterLocation = userResult[0].address;
                ownerLocation = userResult[1].address;

                // Extract latitude and longitude from addresses
                const renterCoords = renterLocation.match(/\(([^)]+)\)/)[1].split(',').map(Number);
                const ownerCoords = ownerLocation.match(/\(([^)]+)\)/)[1].split(',').map(Number);

                const [renterLat, renterLon] = renterCoords;
                const [ownerLat, ownerLon] = ownerCoords;

                let totalCost = calculateRentalInvoice(
                    item.price_per_day,
                    item.price_per_week,
                    item.price_per_month,
                    item.price_per_year,
                    startDate,
                    endDate
                );

                // Step 4: Calculate distance if delivery method is chosen
                if (delivery_method === "delivery") {
                    const distance = calculateDistance(renterLat, renterLon, ownerLat, ownerLon);
                    // Calculate delivery cost based on distance
                    const deliveryCost = calculateDeliveryCost(distance);
                    // Add delivery cost to total cost
                    totalCost += deliveryCost;
                }

                // Step 5: Insert the rental request
                const requestQuery = `
                    INSERT INTO rental_request (item_id, owner_id, renter_id, start_date, end_date, total_cost, pickup_id, geographical_location)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
                `;

                con.query(requestQuery, [item.id, item.user_id, renter_id, startDate, endDate, totalCost, pickup_id, `${ownerLocation} to ${renterLocation}`], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ msg: "An error occurred while creating rental request.", error: err });
                    }

                    res.status(201).json({
                        msg: "Rental request created successfully",
                        requestId: result.insertId,
                        totalCost: totalCost,
                        geographical_location: `${ownerLocation} to ${renterLocation}`
                    });
                });
            });
        });
    });
};

// Function to calculate delivery cost based on distance
function calculateDeliveryCost(distance) {
    if (distance < 20) {
        return 10; // Cost is 10 if distance is less than 20 km
    } else {
        // Calculate cost based on 20 km increments
        const increments = Math.ceil(distance / 20); // Round up to the nearest 20 km
        return increments * 20; // Cost is 20 for each increment
    }
}






exports.getRentalRequests = (req, res) => {
    const renter_id = req.user.id;

    const requestsQuery = `
    SELECT rr.id AS request_id, rr.start_date, rr.end_date, rr.total_cost, rr.serial_number, 
           i.name AS item_name, rr.status AS item_status, 
           u.name AS owner_name
    FROM rental_request rr
    JOIN item i ON rr.item_id = i.id
    JOIN users u ON rr.owner_id = u.userId
    WHERE rr.renter_id = ?;
    `;

    con.query(requestsQuery, [renter_id], (err, requestsResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving rental requests.", error: err });
        }

        if (requestsResult.length === 0) {
            return res.status(404).json({ msg: "No rental requests found for this user." });
        }

        const rentalRequests = requestsResult.map(request => {
            return {
                serial_number: request.serial_number,
                item_name: request.item_name,
                owner_name: request.owner_name,
                item_status: request.item_status,
                start_date: request.start_date,
                end_date: request.end_date,
                total_cost: request.total_cost
            };
        });

        res.status(200).json({
            msg: "Rental requests retrieved successfully.",
            rental_requests: rentalRequests
        });
    });
};




exports.getRentalRequestsAsOwner = (req, res) => {
    const owner_id = req.user.id; // Get the owner's ID from the authenticated user

    const requestsQuery = `
     SELECT rr.id AS request_id, rr.start_date, rr.end_date, rr.total_cost , rr.serial_number, 
           i.name AS item_name, rr.status AS item_status, 
           u.name AS renter_name  -- Updated to use the correct column name
    FROM rental_request rr
    JOIN item i ON rr.item_id = i.id
    JOIN users u ON rr.renter_id = u.userId
    WHERE rr.owner_id = ?
    `;

    con.query(requestsQuery, [owner_id], (err, requestsResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving rental requests.", error: err });
        }

        if (requestsResult.length === 0) {
            return res.status(404).json({ msg: "No rental requests found for this owner." });
        }

        const rentalRequests = requestsResult.map(request => ({
            serial_number: request.serial_number,
            item_name: request.item_name,
            owner_username: request.owenr_name, // Ensure this matches the column name from the database
            item_status: request.item_status,
            start_date: request.start_date,
            end_date: request.end_date,
            total_cost: request.total_cost
        }));

        res.status(200).json({
            msg: "Rental requests retrieved successfully.",
            rental_requests: rentalRequests
        });
    });
};

exports.approveDeclineRequest = (req, res) => {
    const { serial_number, action } = req.body; // action can be "approve" or "decline"
    const owner_id = req.user.id; // Get the owner's ID from the authenticated user

    // Step 1: Get the rental request based on the serial number
    const requestQuery = `
        SELECT rr.id AS request_id, rr.item_id, rr.renter_id, rr.start_date, rr.end_date, rr.total_cost, rr.status 
        FROM rental_request rr
        JOIN item i ON rr.item_id = i.id
        WHERE rr.serial_number = ? AND rr.owner_id = ?;
    `;

    con.query(requestQuery, [serial_number, owner_id], (err, requestResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving the rental request.", error: err });
        }

        if (requestResult.length === 0) {
            return res.status(404).json({ msg: "No rental request found for this serial number." });
        }

        const rentalRequest = requestResult[0];

        // Check if the rental request status is 'pending'
        if (rentalRequest.status !== 'pending') {
            return res.status(400).json({ msg: "Rental request is not pending and cannot be approved or declined." });
        }

        // Step 2: Check if the item is already rented during the requested dates
        const overlapCheckQuery = `
            SELECT COUNT(*) AS count 
            FROM rental 
            WHERE item_id = ? 
            AND status = 'rented' 
            AND (
                (start_date <= ? AND end_date >= ?) OR
                (start_date <= ? AND end_date >= ?)
            );
        `;

        con.query(overlapCheckQuery, [rentalRequest.item_id, rentalRequest.end_date, rentalRequest.start_date, rentalRequest.start_date, rentalRequest.end_date], (err, overlapResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "An error occurred while checking rental overlaps.", error: err });
            }

            if (overlapResult[0].count > 0) {
                return res.status(400).json({ msg: "The item is already rented during the requested dates and cannot be approved." });
            }

            // Step 3: Handle approval or decline
            if (action === "approve") {
                // Ensure that start_date and end_date are not null
                if (!rentalRequest.start_date || !rentalRequest.end_date) {
                    return res.status(400).json({ msg: "Start date and end date must be provided." });
                }

                // Step 4: Insert the rental into the rental table
                const rentalInsertQuery = `
                    INSERT INTO rental (item_id, renter_id, start_date, end_date, status, created_at, owner_id, total_cost)
                    VALUES (?, ?, ?, ?, 'rented', NOW(), ?, ?);
                `;

                con.query(rentalInsertQuery, [rentalRequest.item_id, rentalRequest.renter_id, rentalRequest.start_date, rentalRequest.end_date, owner_id, rentalRequest.total_cost], (err, rentalResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ msg: "An error occurred while creating the rental.", error: err });
                    }

                    // Step 5: Update the rental request status to 'approved'
                    const updateRequestStatusQuery = `
                        UPDATE rental_request 
                        SET status = 'approved' 
                        WHERE id = ?;
                    `;

                    con.query(updateRequestStatusQuery, [rentalRequest.request_id], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ msg: "An error occurred while updating the rental request status.", error: err });
                        }

                        res.status(200).json({ msg: "Rental request approved and rental created successfully." });
                    });
                });
            } else if (action === "decline") {
                // Step 6: Update the rental request status to 'declined'
                const updateRequestStatusQuery = `
                    UPDATE rental_request 
                    SET status = 'declined' 
                    WHERE id = ?;
                `;

                con.query(updateRequestStatusQuery, [rentalRequest.request_id], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ msg: "An error occurred while updating the rental request status.", error: err });
                    }

                    res.status(200).json({ msg: "Rental request declined successfully." });
                });
            } else {
                return res.status(400).json({ msg: "Invalid action specified. Use 'approve' or 'decline'." });
            }
        });
    });
};


exports.returnItem = (req, res) => {
    const { serial_number } = req.body; // Get the serial number from the request body
    const user_id = req.user.id; // Get the authenticated user's ID

    // Step 1: Retrieve the rental record
    const rentalQuery = `
        SELECT id, item_id, renter_id, start_date, end_date, status 
        FROM rental 
        WHERE serial_number = ? AND renter_id = ? AND status = 'rented';
    `;

    con.query(rentalQuery, [serial_number, user_id], (err, rentalResult) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving the rental record.", error: err });
        }

        if (rentalResult.length === 0) {
            return res.status(404).json({ msg: "No active rental found for this serial number." });
        }

        const rental = rentalResult[0];

        // Step 2: Check if the return is late
        const returnDate = new Date(); // Current date
        const endDate = new Date(rental.end_date); // Rental end date

        let lateFee = 0;
        const lateDays = Math.floor((returnDate - endDate) / (1000 * 60 * 60 * 24)); // Calculate late days

        // Step 3: Calculate late fees if applicable
        if (lateDays > 0) {
            // Assume a late fee of $5 per day
            lateFee = lateDays * 5; 
        }

        // Step 4: Update rental status to 'returned'
        const updateRentalQuery = `
            UPDATE rental 
            SET status = 'returned', return_date = NOW(), late_fee = ?, total_cost = total_cost + ? 
            WHERE id = ?;
        `;

        con.query(updateRentalQuery, [lateFee, lateFee, rental.id], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: "An error occurred while updating the rental status.", error: err });
            }
           
            // Step 5: (Optional) Notify user about the return status
            res.status(200).json({
                 
                msg: "Item returned successfully.", 
                lateFee: lateFee > 0 ? lateFee : 0 // Include late fee if applicable
            });
        });
    });
};


// Function to get all rented items for the user
exports.getRentedItems = (req, res) => {
    const renter_id = req.user.id; // Get the renter's ID from the authenticated user

    const rentedItemsQuery = `
        SELECT r.serial_number, i.name AS item_name, u.name AS owner_name, 
               r.start_date, r.end_date, r.total_cost
        FROM rental r
        JOIN item i ON r.item_id = i.id
        JOIN users u ON r.owner_id = u.userId
        WHERE r.renter_id = ? AND r.status = 'rented';
    `;

    con.query(rentedItemsQuery, [renter_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: "An error occurred while retrieving rented items.", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ msg: "No rented items found." });
        }

        // Map the results to the desired format
        const rentedItems = results.map(item => {
            return {
                serial_number: item.serial_number,
                item_name: item.item_name,
                owner_name: item.owner_name,
                start_date: item.start_date,
                end_date: item.end_date,
                total_cost: item.total_cost
            };
        });

        res.status(200).json({
            msg: "Rented items retrieved successfully.",
            rented_items: rentedItems
        });
    });
};



