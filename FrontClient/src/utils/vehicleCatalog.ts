export interface VehicleBrandCatalogItem {
  brand: string;
  models: string[];
}

export const vehicleBrandCatalog: VehicleBrandCatalogItem[] = [
  { brand: 'Audi', models: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT'] },
  { brand: 'BMW', models: ['1 Series', '3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X6', 'X7', 'M3', 'M5'] },
  { brand: 'Chery', models: ['Tiggo 4', 'Tiggo 7 Pro', 'Tiggo 8 Pro', 'Arrizo 8'] },
  { brand: 'Chevrolet', models: ['Aveo', 'Cruze', 'Lacetti', 'Captiva', 'Tahoe', 'Camaro'] },
  { brand: 'Ford', models: ['Focus', 'Mondeo', 'Kuga', 'Explorer', 'Transit', 'Mustang'] },
  { brand: 'Geely', models: ['Atlas', 'Coolray', 'Monjaro', 'Emgrand', 'Tugella'] },
  { brand: 'Haval', models: ['F7', 'F7x', 'Jolion', 'Dargo', 'H9', 'M6'] },
  { brand: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Pilot', 'Fit'] },
  { brand: 'Hyundai', models: ['Solaris', 'Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Creta'] },
  { brand: 'Kia', models: ['Rio', 'Ceed', 'Cerato', 'Sportage', 'Sorento', 'K5'] },
  { brand: 'LADA', models: ['Granta', 'Vesta', 'Niva Legend', 'Niva Travel', 'Largus', 'XRAY'] },
  { brand: 'Mazda', models: ['Mazda 3', 'Mazda 6', 'CX-3', 'CX-5', 'CX-9'] },
  { brand: 'Mercedes-Benz', models: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLE', 'GLS', 'V-Class'] },
  { brand: 'Nissan', models: ['Almera', 'Qashqai', 'X-Trail', 'Juke', 'Patrol', 'Teana'] },
  { brand: 'Renault', models: ['Logan', 'Sandero', 'Duster', 'Kaptur', 'Arkana', 'Megane'] },
  { brand: 'Skoda', models: ['Rapid', 'Octavia', 'Superb', 'Kodiaq', 'Karoq', 'Fabia'] },
  { brand: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck'] },
  { brand: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser', 'Highlander', 'Hilux'] },
  { brand: 'Volkswagen', models: ['Polo', 'Golf', 'Passat', 'Tiguan', 'Touareg', 'Jetta'] }
];

export const getBrandCatalogItem = (brand: string) => vehicleBrandCatalog.find((item) => item.brand.toLowerCase() === brand.trim().toLowerCase());
