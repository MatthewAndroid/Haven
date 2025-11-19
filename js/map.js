const shelters = [
    {
        name: "The Haven Bellville",
        address: "2 South Street, Bellville",
        phone: "021 94 51 413",
        email: "bellville@haven.org.za",
        lat: -33.8991,
        lng: 18.6287
    },
    {
        name: "The Haven Ceres",
        address: "1 Owen Street, Ceres",
        phone: "023 312 15 78",
        email: "ceres@haven.org.za",
        lat: -33.3666,
        lng: 19.3089
    },
    {
        name: "The Haven Claremont",
        address: "5 Fir Street, Claremont",
        phone: "021 7616219",
        email: "claremont@haven.org.za",
        lat: -33.9817,
        lng: 18.4646
    },
    {
        name: "The Haven District Six",
        address: "20 Selkirk Street, 8001 Cape Town",
        phone: "021 465 1310",
        email: "district6@haven.org.za",
        lat: -33.9304,
        lng: 18.4333
    },
    {
        name: "Haven Homes (Old Age)",
        address: "24 Dublin Street, Woodstock, Cape Town",
        phone: "021 447 7422",
        email: "allie@haven.org.za",
        lat: -33.9341,
        lng: 18.4387
    },
    {
        name: "The Haven Kalk Bay",
        address: "139 Main Road, 7975 Kalk Bay",
        phone: "021 788 5820",
        email: "kalkbay@haven.org.za",
        lat: -34.1281,
        lng: 18.4491
    },
    {
        name: "The Haven Kensington",
        address: "Cnr. 13th Ave & Dapper Road, Kensington",
        phone: "021 593 0276",
        email: "kensington@haven.org.za",
        lat: -33.9623,
        lng: 18.4841
    },
    {
        name: "The Haven Kraaifontein",
        address: "20 Van der Ross street, Kraaifontein",
        phone: "021 987 1967",
        email: "kraaifontein@haven.org.za",
        lat: -33.8536,
        lng: 18.7188
    },
    {
        name: "The Haven Moira Henderson House",
        address: "107 Chapel Street, Woodstock, Cape Town",
        phone: "021 461 25 33",
        email: "moirahenderson@haven.org.za",
        lat: -33.9357,
        lng: 18.4423
    },
    {
        name: "The Haven Mossel Bay",
        address: "103 Matfield Street, Mossel Bay",
        phone: "044 691 0189",
        email: "mosselbay@haven.org.za",
        lat: -34.1835,
        lng: 22.1459
    },
    {
        name: "The Haven Napier Street",
        address: "2 Napier Street, Greenpoint, Cape Town",
        phone: "021 421 6219",
        email: "napierstreet@haven.org.za",
        lat: -33.9074,
        lng: 18.4055
    },
    {
        name: "The Haven Paarl",
        address: "6 Ambagsvallei Street, Paarl",
        phone: "021 862 18 12",
        email: "paarl@haven.org.za",
        lat: -33.7341,
        lng: 18.9641
    },
    {
        name: "The Haven Swartland",
        address: "5 Varing Straat, Wesbank, Malmesbury",
        phone: "022 486 5191",
        email: "swartland@haven.org.za",
        lat: -33.4602,
        lng: 18.7271
    },
    {
        name: "The Haven Retreat",
        address: "10th Avenue, Retreat, Cape Town",
        phone: "021 715 0817",
        email: "retreat@haven.org.za",
        lat: -34.0536,
        lng: 18.4779
    },
    {
        name: "The Haven Wynberg",
        address: "Piers Road, Wynberg",
        phone: "021 762 8243",
        email: "wynberg@haven.org.za",
        lat: -34.0069,
        lng: 18.4622
    }
];

// Initialize map centered on Cape Town
const map = L.map('map').setView([-33.9249, 18.4241], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

const markers = [];

// Add markers for each shelter
shelters.forEach((shelter, index) => {
    const marker = L.marker([shelter.lat, shelter.lng]).addTo(map);
    
    const popupContent = `
        <div class="popup-content">
            <h4>${shelter.name}</h4>
            <p><strong>Address:</strong> ${shelter.address}</p>
            <p><strong>Phone:</strong> ${shelter.phone}</p>
            <p><strong>Email:</strong> ${shelter.email}</p>
        </div>
    `;
    
    marker.bindPopup(popupContent);
    markers.push({ marker, shelter, index });
});

// Create shelter list
const shelterList = document.getElementById('shelterList');

shelters.forEach((shelter, index) => {
    const card = document.createElement('div');
    card.className = 'shelter-location';
    card.id = `shelter-${index}`;
    
    card.innerHTML = `
        <h3>${shelter.name}</h3>
        <div class="location-details">
            <div class="detail-item">
                <span class="label">Address:</span> ${shelter.address}
            </div>
            <div class="detail-item">
                <span class="label">Phone:</span> ${shelter.phone}
            </div>
            <div class="detail-item">
                <span class="label">Email:</span> ${shelter.email}
            </div>
        </div>
        <button onclick="getDirections(${shelter.lat}, ${shelter.lng}, '${shelter.name}')">Get Directions</button>
    `;
    
    card.addEventListener('click', () => {
        document.querySelectorAll('.shelter-location').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        map.setView([shelter.lat, shelter.lng], 15);
        markers[index].marker.openPopup();
    });
    
    shelterList.appendChild(card);
});

// Sync marker clicks with shelter cards
markers.forEach(({ marker, index }) => {
    marker.on('click', () => {
        document.querySelectorAll('.shelter-location').forEach(c => c.classList.remove('active'));
        document.getElementById(`shelter-${index}`).classList.add('active');
        
        document.getElementById(`shelter-${index}`).scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    });
});

function getDirections(lat, lng, name) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}