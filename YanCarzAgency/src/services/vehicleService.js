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
 *   modelId:      "<car-model-uuid>",
 *   plateNumber:  "100-ALG-16",
 *   color:        "Midnight Black",
 *   fuelType:     FuelType.Diesel,        // 2
 *   seats:        5,
 *   pricePerDay:  4500,
 *   agencyId:     "<agency-uuid>",
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
 * GET /api/agency/AgencyCar/{id}
 *
 * Fetches a single vehicle by its UUID.
 *
 * @param {string} id - UUID of the vehicle
 * @returns {Promise<Object>} The vehicle details (AgencyCarDto)
 */
export const getVehicleById = async (id) => {
  try {
    const response = await api.get(`/agency/AgencyCar/${id}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
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
 * GET /api/shared/Mark
 * Fetches all vehicle brands.
 */
export const getMarks = async () => {
  try {
    const response = await api.get('/shared/Mark');
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * GET /api/shared/Model?markId={id}
 * Fetches all models for a specific vehicle brand.
 */
export const getModelsByMark = async (markId) => {
  try {
    const response = await api.get(`/shared/Model?markId=${markId}`);
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
 * const updated = await updateVehicle("<vehicle-uuid>", {
 *   year: 2024, modelId: "<model-uuid>", plateNumber: "200-ALG-16",
 *   color: "Pearl White", fuelType: FuelType.Electric,
 *   seats: 5, pricePerDay: 5500,
 *   agencyId: "<agency-uuid>", status: VehicleStatus.Available,
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
 * await deleteVehicle("<vehicle-uuid>");
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

export const mapApiToUi = (vehicle) => {
  // If vehicle is just a GUID string (returned by some POST APIs), 
  // return a skeleton so the UI doesn't crash, though handleSave should handle this better.
  if (typeof vehicle === 'string') return { id: vehicle, brand: '...', model: '...', status: 'available' };

  const v = vehicle || {};
  
  // Handle nested or flat Brand/Mark
  const brand = v.model?.mark?.name || v.model?.brand?.name || v.markName || v.mark?.name || v.brandName || v.MarkName || v.brand || v.Brand || v.mark || v.Mark || 'Unknown';
  
  // Handle nested or flat Model
  const modelName = v.model?.name || v.modelName || v.ModelName || v.model || v.Model || 'Unknown';
  
  // Handle Status (detect string or number)
  const getStatus = (s) => {
    const statusMap = {
      [VehicleStatus.Available]: 'available',
      [VehicleStatus.Rented]: 'rented',
      [VehicleStatus.Maintenance]: 'maintenance',
      [VehicleStatus.Inactive]: 'maintenance'
    };
    if (typeof s === 'number') return statusMap[s] || 'available';
    if (typeof s === 'string') return s.toLowerCase();
    return 'available';
  };

  // Handle FuelType
  const getFuel = (f) => {
    const fuelMap = {
      [FuelType.Petrol]: 'Essence',
      [FuelType.Diesel]: 'Diesel',
      [FuelType.Electric]: 'Électrique',
      [FuelType.Hybrid]: 'Hybride'
    };
    if (typeof f === 'number') return fuelMap[f] || 'Essence';
    if (typeof f === 'string') return f;
    return 'Essence';
  };

  return {
    ...v,
    id: v.id || v.Id || v.uid || v.UID,
    brand: brand,
    model: modelName,
    markId: v.model?.mark?.id || v.model?.brand?.id || v.markId || v.MarkId || '',
    modelId: v.modelId || v.ModelId || v.model?.id || '',
    year: v.year || v.Year || '',
    price: v.pricePerDay || v.PricePerDay || v.price || v.Price || 0,
    mileage: v.kilometrage || v.Kilometrage || v.mileage || v.Mileage || v.km || v.Km || 0,
    category: v.model?.category || v.category || v.Category || 'Berline',
    fuel: getFuel(v.fuelType || v.FuelType || v.fuel),
    status: getStatus(v.status || v.Status),
    plateNumber: v.plateNumber || v.PlateNumber || '',
    color: v.color || v.Color || '',
    seats: v.seats || v.Seats || 5,
    image: v.image || v.Image || v.imageUrl || v.ImageUrl || ''
  };
};

export const mapUiToApi = (form, agencyId) => {
  const mileageValue = Math.max(0, Number(form.mileage || 0));
  return {
    year: Number(form.year),
    modelId: form.modelId,
    plateNumber: form.plateNumber || "",
    color: form.color || "Unknown",
    fuelType: {
      'Essence': FuelType.Petrol,
      'Diesel': FuelType.Diesel,
      'Électrique': FuelType.Electric,
      'Hybride': FuelType.Hybrid
    }[form.fuel] || FuelType.Petrol,
    seats: Number(form.seats),
    pricePerDay: Number(form.price),
    mileage: mileageValue,
    kilometrage: mileageValue, // Send both for compatibility
    agencyId: agencyId,
    status: {
      'available': VehicleStatus.Available,
      'rented': VehicleStatus.Rented,
      'maintenance': VehicleStatus.Maintenance
    }[form.status] || VehicleStatus.Available
  };
};
