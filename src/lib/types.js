
// This file previously contained TypeScript interfaces
// Now we'll use JSDoc comments for documentation

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {boolean} isAdmin
 */

/**
 * @typedef {Object} Movie
 * @property {string} id
 * @property {string} title
 * @property {string} imageUrl
 * @property {number} rating
 * @property {string} duration
 * @property {string[]} genre
 * @property {string} releaseDate
 * @property {string} director
 * @property {string[]} cast
 * @property {string} description
 * @property {ShowTime[]} showTimes
 */

/**
 * @typedef {Object} ShowTime
 * @property {string} id
 * @property {string} movieId
 * @property {string} date
 * @property {string} time
 * @property {string} theater
 * @property {number} seatsBooked
 * @property {number} totalSeats
 */

/**
 * @typedef {Object} Seat
 * @property {string} id
 * @property {string} row
 * @property {number} number
 * @property {'standard' | 'premium' | 'vip'} type
 * @property {number} price
 * @property {'available' | 'selected' | 'booked'} status
 */

/**
 * @typedef {Object} SeatRow
 * @property {string} row
 * @property {Seat[]} seats
 */

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} userId
 * @property {string} movieId
 * @property {string} showTimeId
 * @property {string[]} seats
 * @property {number} totalPrice
 * @property {'pending' | 'completed' | 'failed'} paymentStatus
 * @property {string} bookingDate
 */

/**
 * @typedef {Object} PaymentDetails
 * @property {string} cardNumber
 * @property {string} expiryDate
 * @property {string} cvv
 * @property {string} nameOnCard
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} message
 * @property {'info' | 'warning' | 'success' | 'error'} type
 * @property {string} createdAt
 * @property {boolean} read
 */

/**
 * @typedef {Object} AdminSettings
 * @property {Object} seatLayout
 * @property {number} seatLayout.rows
 * @property {number} seatLayout.seatsPerRow
 * @property {Object} seatPricing
 * @property {number} seatPricing.standard
 * @property {number} seatPricing.premium
 * @property {number} seatPricing.vip
 * @property {Object} notificationThresholds
 * @property {number[]} notificationThresholds.bookingPercentage
 */
