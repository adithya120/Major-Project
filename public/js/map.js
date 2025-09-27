maptilersdk.config.apiKey = mapToken;

const mapContainer = document.getElementById("map");
const listingCoordinates = mapContainer ? JSON.parse(mapContainer.dataset.coords) : [0, 0];

if (listingCoordinates && listingCoordinates.length === 2) {
  const map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: listingCoordinates,
    zoom: 12,
  });

  // Create popup first
  const popup = new maptilersdk.Popup({ offset: 25 }) // optional offset
    .setHTML("<p>Listing Location</p>");

  // Create marker and attach popup
  new maptilersdk.Marker({color:"red"})
    .setLngLat(listingCoordinates)
    .setPopup(popup)  // attach popup
    .addTo(map);

  // Optional: open the popup immediately
  popup.addTo(map);
}
