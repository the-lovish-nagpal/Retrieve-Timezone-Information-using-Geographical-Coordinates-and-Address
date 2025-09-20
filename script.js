const apiKey = "4d4fc8987aa84c8b8852377f69818d76";

// Section 1: Current location + timezone
const x = document.getElementById("demo");
let lat, long;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function success(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;

  x.innerHTML = `<p><strong>Latitude:</strong> ${lat}</p>
                 <p><strong>Longitude:</strong> ${long}</p>`;

  getTimezone();
}

function error() {
  x.innerHTML = "<p class='error'>Sorry, no position available.</p>";
}

async function getTimezone() {
  try {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=${apiKey}`
    );
    const result = await res.json();
    const data = result.results[0];

    x.innerHTML += `
      <p><strong>City:</strong> ${data.city}</p>
      <p><strong>State:</strong> ${data.state}</p>
      <p><strong>Country:</strong> ${data.country}</p>
      <p><strong>Postcode:</strong> ${data.postcode}</p>
      <p><strong>Timezone:</strong> ${data.timezone.name}</p>
      <p><strong>Offset STD:</strong> ${data.timezone.offset_STD}</p>
      <p><strong>Offset DST:</strong> ${data.timezone.offset_DST}</p>
      <p><strong>Abbreviation STD:</strong> ${data.timezone.abbreviation_STD}</p>
      <p><strong>Abbreviation DST:</strong> ${data.timezone.abbreviation_DST}</p>
    `;
  } catch (err) {
    x.innerHTML += "<p class='error'>Error fetching timezone data.</p>";
  }
}

getLocation();

// Section 2: Address lookup
async function fetchAddressData() {
  const address = document.getElementById("addressInput").value.trim();
//   console.log(address)
  const resultDiv = document.getElementById("addressResult");
  resultDiv.innerHTML = "";

  if (!address) {
    resultDiv.innerHTML = "<p class='error'>Please enter an address.</p>";
    return;
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      const place = data.results[0];
      resultDiv.innerHTML = `
        <p><strong>Formatted:</strong> ${place.formatted}</p>
        <p><strong>Latitude:</strong> ${place.lat}</p>
        <p><strong>Longitude:</strong> ${place.lon}</p>
        <p><strong>City:</strong> ${place.city}</p>
        <p><strong>Postcode:</strong> ${place.postcode}</p>
        <p><strong>Country:</strong> ${place.country}</p>
        <p><strong>Timezone:</strong> ${place.timezone.name} (${place.timezone.abbreviation_STD}/${place.timezone.abbreviation_DST})</p>
        <p><strong>Standard Offset:</strong> ${place.timezone.offset_STD}</p>
        <p><strong>DST Offset:</strong> ${place.timezone.offset_DST}</p>
      `;
    } else {
      resultDiv.innerHTML = "<p class='error'>No results found for this address.</p>";
    }
  } catch (err) {
    resultDiv.innerHTML = "<p class='error'>Error fetching address data.</p>";
  }
}
