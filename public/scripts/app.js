
// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

   // Initialize the map
   const lat=Number((listing.coordinates)?listing.coordinates.lat:0);
   const lng=Number((listing.coordinates)?listing.coordinates.lng:0);
   var map = L.map('map').setView([lat,lng], 15);

   // Add a tile layer
   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '© OpenStreetMap contributors'
   }).addTo(map);
   // Add a marker
   L.marker([lat,lng]).addTo(map)
     .bindPopup('You Will Be Here')
     .openPopup();
     map.panTo({lat:lat,lng:lng});