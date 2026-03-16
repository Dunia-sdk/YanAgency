import api from './api';

// ─── Shared error normaliser ─────────────────────────────────────────────────
const handleAxiosError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    let message = `Request failed with status ${status}`;
    
    if (data) {
      if (typeof data === 'string') message = data;
      else if (data.message) message = data.message;
      else if (data.title) message = data.title;
      else if (data.errors) {
        message = Object.entries(data.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join('\n');
      }
    }
    
    throw { message, status, data };
  }
  if (error.request) {
    throw {
      message: 'No response received from the server. Please check your connection.',
      status: null,
      data: null,
    };
  }
  throw { message: error.message, status: null, data: null };
};

/**
 * GET /api/agency/Bookings
 * Fetches all bookings for the agency.
 */
export const getBookings = async () => {
    try {
        const response = await api.get('/agency/Bookings');
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * POST /api/agency/Bookings
 * Creates a new booking.
 * 
 * @param {Object} bookingData - BookingCreateDto
 * @param {string} bookingData.customerId
 * @param {string} bookingData.agencyCarId
 * @param {string} bookingData.agencyId
 * @param {string} bookingData.startDate
 * @param {string} bookingData.endDate
 * @param {string} bookingData.pickupPlaceId
 * @param {string} bookingData.returnPlaceId
 * @param {number} bookingData.pricePerDay
 * @param {string} bookingData.deviseId
 */
export const createBooking = async (bookingData) => {
    try {
        const response = await api.post('/agency/Bookings', bookingData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * Mapping helper for UI representation
 */
export const mapApiToUi = (booking) => {
    return {
        id: booking.id || booking.Id || 'N/A',
        client: booking.customer?.firstName ? `${booking.customer.firstName} ${booking.customer.lastName || ''}` : booking.customerId,
        vehicle: booking.agencyCar?.model?.name || booking.agencyCarId,
        startDate: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A',
        endDate: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A',
        total: booking.totalAmount || (booking.pricePerDay * ((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))) || 0,
        status: (booking.status?.toString().toLowerCase()) || 'pending',
        // Preserve raw dates for sorting/processing if needed
        rawStartDate: booking.startDate,
        rawEndDate: booking.endDate
    };
};
