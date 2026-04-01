// ─── VEHICLES ──────────────────────────────────────────────────────────────
export const vehicles = [
    { id: 1, brand: 'Toyota', model: 'Corolla', year: 2022, price: 450, mileage: 15400, category: 'Berline', fuel: 'Essence', transmission: 'Auto', status: 'available', nbReservation: 12, image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=200&auto=format&fit=crop' },
    { id: 2, brand: 'Renault', model: 'Clio', year: 2021, price: 350, mileage: 42100, category: 'Citadine', fuel: 'Diesel', transmission: 'Manuel', status: 'rented', nbReservation: 23, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=200&auto=format&fit=crop' },
    { id: 3, brand: 'BMW', model: 'Série 3', year: 2023, price: 900, mileage: 5200, category: 'Premium', fuel: 'Essence', transmission: 'Auto', status: 'available', nbReservation: 41, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=200&auto=format&fit=crop' },
    { id: 4, brand: 'Peugeot', model: '3008', year: 2022, price: 600, mileage: 28900, category: 'SUV', fuel: 'Hybride', transmission: 'Auto', status: 'maintenance', nbReservation: 17, image: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?q=80&w=200&auto=format&fit=crop' },
    { id: 5, brand: 'Mercedes', model: 'Classe C', year: 2023, price: 1100, mileage: 8400, category: 'Premium', fuel: 'Essence', transmission: 'Auto', status: 'available', nbReservation: 8, image: 'https://images.unsplash.com/photo-1620127252536-0390a8848ecd?q=80&w=200&auto=format&fit=crop' },
    { id: 6, brand: 'Volkswagen', model: 'Golf', year: 2021, price: 500, mileage: 36500, category: 'Berline', fuel: 'Diesel', transmission: 'Manuel', status: 'rented', nbReservation: 32, image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=200&auto=format&fit=crop' },
    { id: 7, brand: 'Dacia', model: 'Duster', year: 2022, price: 380, mileage: 22300, category: 'SUV', fuel: 'Diesel', transmission: 'Manuel', status: 'available', nbReservation: 18, image: 'https://images.unsplash.com/photo-1606016159991-bef4b07cab2a?q=80&w=200&auto=format&fit=crop' },
    { id: 8, brand: 'Audi', model: 'A4', year: 2023, price: 950, mileage: 11200, category: 'Premium', fuel: 'Essence', transmission: 'Auto', status: 'available', nbReservation: 10, image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=200&auto=format&fit=crop' },
    { id: 9, brand: 'Ford', model: 'Puma', year: 2022, price: 420, mileage: 25700, category: 'SUV', fuel: 'Essence', transmission: 'Manuel', status: 'rented', nbReservation: 22, image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?q=80&w=200&auto=format&fit=crop' },
    { id: 10, brand: 'Kia', model: 'Sportage', year: 2023, price: 650, mileage: 9800, category: 'SUV', fuel: 'Hybride', transmission: 'Auto', status: 'available', nbReservation: 50, image: 'https://images.unsplash.com/photo-1634833215904-5e1352e854fa?q=80&w=200&auto=format&fit=crop' },
];

// ─── CLIENTS ────────────────────────────────────────────────────────────────
export const clients = [
    { id: 1, name: 'Alice Moreau', email: 'alice@gmail.com', phone: '+212 6 11 22 33 44', location: 'Casablanca', bookings: 5, joined: '2023-03-15' },
    { id: 2, name: 'Bob Petit', email: 'bob@gmail.com', phone: '+212 6 55 66 77 88', location: 'Marrakech', bookings: 2, joined: '2023-06-20' },
    { id: 3, name: 'Carla Durand', email: 'carla@gmail.com', phone: '+212 6 99 00 11 22', location: 'Rabat', bookings: 8, joined: '2022-11-01' },
    { id: 4, name: 'David Martin', email: 'david@gmail.com', phone: '+212 6 33 44 55 66', location: 'Tanger', bookings: 1, joined: '2024-01-10' },
    { id: 5, name: 'Emma Bernard', email: 'emma@gmail.com', phone: '+212 6 77 88 99 00', location: 'Agadir', bookings: 3, joined: '2023-09-05' },
    { id: 6, name: 'François Leroy', email: 'francois@gmail.com', phone: '+212 6 22 33 44 55', location: 'Fès', bookings: 4, joined: '2023-07-22' },
    { id: 7, name: 'Gabrielle Simon', email: 'gab@gmail.com', phone: '+212 6 66 77 88 99', location: 'Oujda', bookings: 6, joined: '2022-12-12' },
    { id: 8, name: 'Hugo Lambert', email: 'hugo@gmail.com', phone: '+212 6 44 55 66 77', location: 'Kénitra', bookings: 2, joined: '2024-02-18' },
];

export const cities = [
    { id: 'casablanca-uuid', name: 'Casablanca' },
    { id: 'rabat-uuid', name: 'Rabat' },
    { id: 'marrakech-uuid', name: 'Marrakech' },
    { id: 'tanger-uuid', name: 'Tanger' },
    { id: 'agadir-uuid', name: 'Agadir' },
    { id: 'fes-uuid', name: 'Fès' },
];

// ─── RESERVATIONS ───────────────────────────────────────────────────────────
export const reservations = [
    { id: 'RES-001', client: 'Alice Moreau', vehicle: 'Toyota Corolla', startDate: '2024-03-01', endDate: '2024-03-05', total: 1800, status: 'confirmed' },
    { id: 'RES-002', client: 'Bob Petit', vehicle: 'Renault Clio', startDate: '2024-03-03', endDate: '2024-03-07', total: 1400, status: 'pending' },
    { id: 'RES-003', client: 'Carla Durand', vehicle: 'BMW Série 3', startDate: '2024-03-05', endDate: '2024-03-10', total: 4500, status: 'completed' },
    { id: 'RES-004', client: 'David Martin', vehicle: 'Mercedes Classe C', startDate: '2024-03-08', endDate: '2024-03-09', total: 1100, status: 'cancelled' },
    { id: 'RES-005', client: 'Emma Bernard', vehicle: 'Peugeot 3008', startDate: '2024-03-10', endDate: '2024-03-15', total: 3000, status: 'confirmed' },
    { id: 'RES-006', client: 'François Leroy', vehicle: 'Volkswagen Golf', startDate: '2024-03-12', endDate: '2024-03-14', total: 1000, status: 'pending' },
    { id: 'RES-007', client: 'Gabrielle Simon', vehicle: 'Audi A4', startDate: '2024-03-15', endDate: '2024-03-20', total: 4750, status: 'confirmed' },
    { id: 'RES-008', client: 'Hugo Lambert', vehicle: 'Dacia Duster', startDate: '2024-03-18', endDate: '2024-03-19', total: 380, status: 'completed' },
    { id: 'RES-009', client: 'Alice Moreau', vehicle: 'Ford Puma', startDate: '2024-03-20', endDate: '2024-03-22', total: 840, status: 'pending' },
    { id: 'RES-010', client: 'Bob Petit', vehicle: 'Kia Sportage', startDate: '2024-03-22', endDate: '2024-03-28', total: 3900, status: 'confirmed' },
];

// ─── TEAM ────────────────────────────────────────────────────────────────────
export const teamMembers = [
    { id: 1, name: 'Jean-Paul Marché', email: 'jp@yancarz.com', role: 'Owner', department: 'Direction', joined: '2022-01-01', avatar: 'JP', agencyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    { id: 2, name: 'Sophie Durant', email: 'sophie@yancarz.com', role: 'Manager', department: 'Opérations', joined: '2022-06-15', avatar: 'SD', agencyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    { id: 3, name: 'Karim Benali', email: 'karim@yancarz.com', role: 'Staff', department: 'Commercial', joined: '2023-02-01', avatar: 'KB', agencyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    { id: 4, name: 'Lucie Fontaine', email: 'lucie@yancarz.com', role: 'Staff', department: 'Comptabilité', joined: '2023-04-10', avatar: 'LF', agencyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
    { id: 5, name: 'Marc Tessier', email: 'marc@yancarz.com', role: 'Manager', department: 'Flotte', joined: '2022-11-20', avatar: 'MT', agencyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6" },
];

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoices = [
    { id: 1, ref: 'INV-2024-001', client: 'Alice Moreau', amount: 1800, date: '2024-03-05', status: 'paid' },
    { id: 2, ref: 'INV-2024-002', client: 'Bob Petit', amount: 1400, date: '2024-03-07', status: 'pending' },
    { id: 3, ref: 'INV-2024-003', client: 'Carla Durand', amount: 4500, date: '2024-03-10', status: 'paid' },
    { id: 4, ref: 'INV-2024-004', client: 'Emma Bernard', amount: 3000, date: '2024-03-15', status: 'overdue' },
    { id: 5, ref: 'INV-2024-005', client: 'Gabrielle Simon', amount: 4750, date: '2024-03-20', status: 'pending' },
    { id: 6, ref: 'INV-2024-006', client: 'Hugo Lambert', amount: 380, date: '2024-03-19', status: 'paid' },
];

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const payments = [
    { id: 1, date: '2024-03-05', client: 'Alice Moreau', amount: 1800, method: 'Online', status: 'completed' },
    { id: 2, date: '2024-03-07', client: 'Bob Petit', amount: 1400, method: 'Versement', status: 'pending' },
    { id: 3, date: '2024-03-10', client: 'Carla Durand', amount: 4500, method: 'Cash Plus', status: 'completed' },
    { id: 4, date: '2024-03-15', client: 'Emma Bernard', amount: 3000, method: 'Agence', status: 'failed' },
];

// ─── CHART DATA ─────────────────────────────────────────────────────────────
export const revenueData = [
    { month: 'Sep', revenue: 42000, reservations: 18 },
    { month: 'Oct', revenue: 58000, reservations: 24 },
    { month: 'Nov', revenue: 49000, reservations: 20 },
    { month: 'Déc', revenue: 67000, reservations: 28 },
    { month: 'Jan', revenue: 51000, reservations: 22 },
    { month: 'Fév', revenue: 78000, reservations: 32 },
    { month: 'Mar', revenue: 82000, reservations: 35 },
];

export const fleetOccupancyData = [
    { name: 'Libre', value: 40, fill: '#10b981' },
    { name: 'Occupé', value: 60, fill: '#6366f1' },
];

export const vehicleStatusData = [
    { name: 'Disponible', value: 6, fill: '#10b981' },
    { name: 'Loué', value: 3, fill: '#6366f1' },
    { name: 'Maintenance', value: 1, fill: '#f59e0b' },
];

// ─── CLIENT BOOKINGS (for history) ──────────────────────────────────────────
export const clientBookings = {
    1: [
        { id: 'RES-001', vehicle: 'Toyota Corolla', dates: '01/03 – 05/03', total: 1800, status: 'confirmed' },
        { id: 'RES-009', vehicle: 'Ford Puma', dates: '20/03 – 22/03', total: 840, status: 'pending' },
    ],
    2: [
        { id: 'RES-002', vehicle: 'Renault Clio', dates: '03/03 – 07/03', total: 1400, status: 'pending' },
        { id: 'RES-010', vehicle: 'Kia Sportage', dates: '22/03 – 28/03', total: 3900, status: 'confirmed' },
    ],
    3: [{ id: 'RES-003', vehicle: 'BMW Série 3', dates: '05/03 – 10/03', total: 4500, status: 'completed' }],
    4: [{ id: 'RES-004', vehicle: 'Mercedes Classe C', dates: '08/03 – 09/03', total: 1100, status: 'cancelled' }],
    5: [{ id: 'RES-005', vehicle: 'Peugeot 3008', dates: '10/03 – 15/03', total: 3000, status: 'confirmed' }],
    6: [{ id: 'RES-006', vehicle: 'Volkswagen Golf', dates: '12/03 – 14/03', total: 1000, status: 'pending' }],
    7: [{ id: 'RES-007', vehicle: 'Audi A4', dates: '15/03 – 20/03', total: 4750, status: 'confirmed' }],
    8: [{ id: 'RES-008', vehicle: 'Dacia Duster', dates: '18/03 – 19/03', total: 380, status: 'completed' }],
};
