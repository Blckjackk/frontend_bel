import { OfficeSpace } from "../types/officeSpace.types";
export const officeSpaces : OfficeSpace[] = [
    {
    id: 1,
    title: 'Angga Park Central Master Silicon Valley Star Class',
    slug: 'angga-park-central-master-silicon-valley-star-class',
    price: 28560000,
    duration: '20 days',
    location: 'Jakarta Pusat',
    rating: 4.5,
    address: 'Dekat gedung BWA HQ di Jakarta no 210406',
    image: '/assets/images/thumbnails/thumbnails-1.png',
    images: [
        '/assets/images/thumbnails/thumbnails-1.png',
        '/assets/images/thumbnails/thumbnail-details-2.png',
        '/assets/images/thumbnails/thumbnail-details-2.png'
    ],
    tags: ['Popular'],
    about: 'A premium office space in the heart of Jakarta.',
    features: ['High Speed Wifi', '100% Privacy', 'Free Move', 'Sustainability', 'Parking Space', 'Compact'],
    salesContacts: [
        { 
            name: 'Budi Santoso',
            role: 'Sales Manager',
            photo: '/assets/images/photos/photo-1.png',
            email: 'budi.santoso@example.com',
            phone: '123-456-7890',
        },
        {
            name: 'Siti Nurhaliza',
            role: 'Sales Representative',
            photo: '/assets/images/photos/photo-2.png',
            email: 'siti.nurhaliza@example.com',
            phone: '098-765-4321',
        }
    ],
    isFullyBooked: false,
    providerId: 1,
    },
    {
    id: 2,
    title: 'Pondok Pekerja Remote Surabaya',
    slug: 'pondok-pekerja-remote-surabaya',
    price: 12000000,
    duration: '15 days',
    location: 'Surabaya',
    rating: 4.8,
    address: 'Dekat gedung BWA HQ di Surabaya no 210406',
    image: '/assets/images/thumbnails/thumbnails-3.png',
    images: [
        '/assets/images/thumbnails/thumbnails-1.png',
        '/assets/images/thumbnails/thumbnail-details-2.png',
        '/assets/images/thumbnails/thumbnail-details-2.png'
    ],
    tags: ['Cheaper'],
    about: 'A premium office space in the heart of Surabaya.',
    features: ['High Speed Wifi', '100% Privacy', 'Free Move', 'Sustainability', 'Parking Space', 'Compact'],
    salesContacts: [
    { 
        name: 'Ahmad Wijaya',
        role: 'Sales Manager',
        photo: '/assets/images/photos/photo-1.png',  // ← ganti ini
        email: 'ahmad.wijaya@example.com',
        phone: '121-472-7890',
    },
    {
        name: 'Dewi Lestari',
        role: 'Sales Representative',
        photo: '/assets/images/photos/photo-2.png',  // ← ganti ini
        email: 'dewi.lestari@example.com',
        phone: '098-765-2104',
    }
    ],
    isFullyBooked: true,
    providerId: 1,
    }
]; 