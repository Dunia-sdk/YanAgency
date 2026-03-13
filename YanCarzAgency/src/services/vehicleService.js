import api from './api';

// ─── Enum reference ───────────────────────────────────────────────────────────

/**
 * FuelType enum  (integer sent to the API)
 * @readonly @enum {number}
 */
export const FuelType = Object.freeze({
  Unknown:  0,
  Petrol:   1,
  Diesel:   2,
  Electric: 3,
  Hybrid:   4,
});

/**
 * VehicleStatus enum  (integer sent to the API)
 * @readonly @enum {number}
 */
export const VehicleStatus = Object.freeze({
  Available:   0,
  Rented:      1,
  Maintenance: 2,
  Inactive:    3,
});

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * POST /api/agency/AgencyCar
 *
 * Creates a new AgencyCar and returns the created vehicle object.
 *
 * @param {Object} vehicleData                     - AgencyCarCreateDto
 * @param {number} vehicleData.year                - Manufacturing year         (int32, required)
 * @param {string} vehicleData.modelId             - Car-model UUID             (uuid,  required)
 * @param {string} [vehicleData.plateNumber]       - Plate number               (nullable)
 * @param {string} [vehicleData.color]             - Colour description         (nullable)
 * @param {FuelType} vehicleData.fuelType          - Fuel type enum value       (0-4,  required)
 * @param {number} vehicleData.seats               - Number of seats            (int32, required)
 * @param {number} vehicleData.pricePerDay         - Price per day              (double, required)
 * @param {string} vehicleData.agencyId            - Agency UUID                (uuid,  required)
 * @param {VehicleStatus} vehicleData.status       - Vehicle status enum value  (0-3,  required)
 *
 * @returns {Promise<Object>} The created vehicle (AgencyCarDto)
 * @throws  {Object}          Normalised error with `message`, `status`, and `data` fields
 *
 * @example
 * const newVehicle = await createVehicle({
 *   year:         2023,
 *   modelId:      "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   plateNumber:  "100-ALG-16",
 *   color:        "Midnight Black",
 *   fuelType:     FuelType.Diesel,        // 2
 *   seats:        5,
 *   pricePerDay:  4500,
 *   agencyId:     "3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *   status:       VehicleStatus.Available, // 0
 * });
 */
// ─── Shared error normaliser ─────────────────────────────────────────────────

/**
 * Converts an Axios error into a plain, predictable object and re-throws it.
 * @param {import('axios').AxiosError} error
 */
const handleAxiosError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    let message = `Request failed with status ${status}`;
    
    // Extract message from common API error formats
    if (data) {
      if (typeof data === 'string') message = data;
      else if (data.message) message = data.message;
      else if (data.title) message = data.title;
      else if (data.errors) {
        // Handle ASP.NET Core Validation Errors
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
 * GET /api/agency/AgencyCar
 *
 * Fetches all vehicles for the current agency.
 *
 * @returns {Promise<Array>} List of vehicles (AgencyCarDto[])
 */
export const getVehicles = async () => {
  try {
    const response = await api.get('/agency/AgencyCar');
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * POST /api/agency/AgencyCar
 *
 * Creates a new AgencyCar and returns the created vehicle object.
 *
 * @param {Object} vehicleData
 * @returns {Promise<Object>} The created vehicle (AgencyCarDto)
 */
export const createVehicle = async (vehicleData) => {
  try {
    const response = await api.post('/agency/AgencyCar', vehicleData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * PUT /api/agency/AgencyCar/{id}
 *
 * Updates an existing AgencyCar and returns the updated vehicle object.
 *
 * @param {string} vehicleId                       - UUID of the vehicle to update
 * @param {Object} vehicleData                     - AgencyCarUpdateDto
 * @param {number} vehicleData.year                - Manufacturing year         (int32)
 * @param {string} vehicleData.modelId             - Car-model UUID             (uuid)
 * @param {string} [vehicleData.plateNumber]       - Plate number               (nullable)
 * @param {string} [vehicleData.color]             - Colour description         (nullable)
 * @param {FuelType} vehicleData.fuelType          - Fuel type enum value       (0-4)
 * @param {number} vehicleData.seats               - Number of seats            (int32)
 * @param {number} vehicleData.pricePerDay         - Price per day              (double)
 * @param {string} vehicleData.agencyId            - Agency UUID                (uuid)
 * @param {VehicleStatus} vehicleData.status       - Vehicle status enum value  (0-3)
 *
 * @returns {Promise<Object>} The updated vehicle (AgencyCarDto)
 * @throws  {Object}          Normalised error with `message`, `status`, and `data` fields
 *
 * @example
 * const updated = await updateVehicle("3fa85f64-5717-4562-b3fc-2c963f66afa6", {
 *   year: 2024, modelId: "<uuid>", plateNumber: "200-ALG-16",
 *   color: "Pearl White", fuelType: FuelType.Electric,
 *   seats: 5, pricePerDay: 5500,
 *   agencyId: "<uuid>", status: VehicleStatus.Available,
 * });
 */
export const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await api.put(`/agency/AgencyCar/${vehicleId}`, vehicleData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * DELETE /api/agency/AgencyCar/{id}
 *
 * Deletes a vehicle by its UUID.
 *
 * @param {string} vehicleId - UUID of the vehicle to delete
 * @returns {Promise<boolean>} true if the deletion succeeded
 * @throws  {Object}          Normalised error with `message`, `status`, and `data` fields
 *
 * @example
 * await deleteVehicle("3fa85f64-5717-4562-b3fc-2c963f66afa6");
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    await api.delete(`/agency/AgencyCar/${vehicleId}`);
    return true;
  } catch (error) {
    handleAxiosError(error);
  }
};

// ─── Mapping Helpers ─────────────────────────────────────────────────────────

export const mapApiToUi = (vehicle) => ({
  ...vehicle,
  id: vehicle.id,
  brand: vehicle.model?.brand?.name || 'Unknown',
  model: vehicle.model?.name || 'Unknown',
  status: {
    [VehicleStatus.Available]: 'available',
    [VehicleStatus.Rented]: 'rented',
    [VehicleStatus.Maintenance]: 'maintenance',
    [VehicleStatus.Inactive]: 'maintenance'
  }[vehicle.status] || 'available',
  fuel: {
    [FuelType.Petrol]: 'Essence',
    [FuelType.Diesel]: 'Diesel',
    [FuelType.Electric]: 'Électrique',
    [FuelType.Hybrid]: 'Hybride'
  }[vehicle.fuelType] || 'Essence',
  price: vehicle.pricePerDay,
  mileage: vehicle.mileage || 0,
  category: vehicle.model?.category || 'Berline'
});

export const mapUiToApi = (form, agencyId) => ({
  year: Number(form.year),
  modelId: form.modelId || "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  plateNumber: form.plateNumber || "",
  color: form.color || "Unknown",
  fuelType: {
    'Essence': FuelType.Petrol,
    'Diesel': FuelType.Diesel,
    'Électrique': FuelType.Electric,
    'Hybride': FuelType.Hybrid
  }[form.fuel] || FuelType.Petrol,
  seats: Number(form.seats || 5),
  pricePerDay: Number(form.price),
  agencyId: agencyId,
  status: {
    'available': VehicleStatus.Available,
    'rented': VehicleStatus.Rented,
    'maintenance': VehicleStatus.Maintenance
  }[form.status] || VehicleStatus.Available
});
