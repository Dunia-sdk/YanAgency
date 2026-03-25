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
 * @param {Object} bookingData - CreateBookingPortalDto
 * @param {string} bookingData.firstName
 * @param {string} bookingData.lastName
 * @param {string} bookingData.eMail
 * @param {string} bookingData.nbrPhone
 * @param {string} bookingData.agencyCarId
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
    // Map status from integer to string if necessary
    // 0: pending, 1: confirmed, 2: completed, 3: cancelled
    const statusMap = {
        '0': 'pending',
        '1': 'confirmed',
        '2': 'completed',
        '3': 'cancelled'
    };
    
    let mappedStatus = booking.status?.toString().toLowerCase() || 'pending';
    if (statusMap[mappedStatus]) {
        mappedStatus = statusMap[mappedStatus];
    }

    // Client name fallbacks
    const clientName = booking.customer?.firstName 
        ? `${booking.customer.firstName} ${booking.customer.lastName || ''}` 
        : (booking.customerFirstName ? `${booking.customerFirstName} ${booking.customerLastName || ''}` : null);

    // Vehicle name fallbacks
    const vehicleName = booking.agencyCar?.model?.name 
        ? booking.agencyCar.model.name 
        : (booking.carModelName || booking.vehicleName || null);

    return {
        id: booking.id || booking.Id || 'N/A',
        client: clientName || booking.customerId || 'N/A',
        clientFirstName: booking.customer?.firstName || booking.customerFirstName || '',
        clientLastName: booking.customer?.lastName || booking.customerLastName || '',
        vehicle: vehicleName || booking.agencyCarId || 'N/A',
        vehicleBrand: booking.agencyCar?.model?.mark?.name || booking.carMarkName || '',
        vehicleCategory: booking.agencyCar?.model?.category || 'Berline',
        vehiclePrice: booking.agencyCar?.pricePerDay || booking.pricePerDay || 0,
        startDate: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A',
        endDate: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A',
        startTime: booking.startDate ? new Date(booking.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00',
        endTime: booking.endDate ? new Date(booking.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:00',
        pickupPlace: booking.pickupPlace?.name || 'Agence Centrale',
        returnPlace: booking.returnPlace?.name || 'Agence Centrale',
        total: booking.totalAmount || (booking.pricePerDay * ((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))) || 0,
        status: mappedStatus,
        rawStartDate: booking.startDate,
        rawEndDate: booking.endDate
    };
};
