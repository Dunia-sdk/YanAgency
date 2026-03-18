import api, { handleAxiosError } from './api';


/**
 * GET /api/agency/Bookings/{id}
 * Fetches a single booking by its ID.
 */
export const getBookingById = async (id) => {
    try {
        const response = await api.get(`agency/Bookings/${id}`);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

/**
 * GET /api/agency/Bookings
 * Fetches all bookings for the agency.
 */
export const getBookings = async () => {
    try {
        const response = await api.get('agency/Bookings');
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
        const response = await api.post('agency/Bookings', bookingData);
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
        clientFirstName: booking.customer?.firstName || '',
        clientLastName: booking.customer?.lastName || '',
        vehicle: booking.agencyCar?.model?.name || booking.agencyCarId,
        vehicleBrand: booking.agencyCar?.model?.mark?.name || '',
        vehicleCategory: booking.agencyCar?.model?.category || 'Berline',
        vehiclePrice: booking.agencyCar?.pricePerDay || booking.pricePerDay || 0,
        startDate: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A',
        endDate: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A',
        startTime: booking.startDate ? new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00',
        endTime: booking.endDate ? new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:00',
        pickupPlace: booking.pickupPlace?.name || 'Agence Centrale',
        returnPlace: booking.returnPlace?.name || 'Agence Centrale',
        total: booking.totalAmount || (booking.pricePerDay * ((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))) || 0,
        status: (booking.status?.toString().toLowerCase()) || 'pending',
        rawStartDate: booking.startDate,
        rawEndDate: booking.endDate
    };
};
