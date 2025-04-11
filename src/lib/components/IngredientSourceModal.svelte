<script>
  import { fly, fade, scale } from "svelte/transition";
  import { onMount } from "svelte";
  
  export let ingredient = null;
  export let onClose = () => {};
  
  let activeTab = 'overview';
  let mapLoaded = false;
  
  // Nashville coordinates for map centering
  const NASHVILLE_CENTER = [36.1627, -86.7816];
  const OPRYLAND_COORDS = [36.2138, -86.6935];
  
  const nashvilleMarkets = {
    "Nashville Farmers' Market": {
      address: "900 Rosa L. Parks Blvd, Nashville, TN 37208",
      hours: "Open daily: 8am-6pm",
      description: "A year-round, daily indoor-outdoor market featuring local farmers, artisans, and small businesses.",
      coordinates: [36.1752, -86.7843]
    },
    "12 South Farmers Market": {
      address: "Sevier Park, 3000 Granny White Pike, Nashville, TN 37204",
      hours: "Tuesdays: 3:30pm-6:30pm (May-October)",
      description: "Community farmers market with a focus on local produce and artisanal food products.",
      coordinates: [36.1197, -86.7908]
    },
    "East Nashville Farmers Market": {
      address: "1000 Woodland St, Nashville, TN 37206",
      hours: "Wednesdays: 3:30pm-6:30pm (May-October)",
      description: "Producer-only market featuring fresh, seasonal produce from local farms.",
      coordinates: [36.1765, -86.7523]
    },
    "Richland Park Farmers Market": {
      address: "4701 Charlotte Ave, Nashville, TN 37209",
      hours: "Saturdays: 9am-12pm (Year-round)",
      description: "Local, sustainable foods and hand-crafted goods from Middle Tennessee farmers and producers.",
      coordinates: [36.1526, -86.8437]
    }
  };
  
  // Convert human-readable coordinates (x,y percentages) to approximate lat/lng
  function approximateGeoCoordinates(percentCoords) {
    // These are rough approximations based on Nashville region
    // Center point is Nashville (36.1627, -86.7816)
    // We create a box around Nashville and map percentages to coordinates
    const NASHVILLE_BOUNDS = {
      north: 36.3,    // North boundary latitude
      south: 36.0,    // South boundary latitude
      east: -86.6,    // East boundary longitude
      west: -87.0     // West boundary longitude
    };
    
    const lat = NASHVILLE_BOUNDS.north - (percentCoords.y / 100) * 
                (NASHVILLE_BOUNDS.north - NASHVILLE_BOUNDS.south);
    const lng = NASHVILLE_BOUNDS.west + (percentCoords.x / 100) * 
                (NASHVILLE_BOUNDS.east - NASHVILLE_BOUNDS.west);
    
    return [lat, lng];
  }
  
  // Calculate farm coordinates based on percentage values
  function getFarmCoordinates() {
    if (!ingredient || !ingredient.coordinates) return null;
    return approximateGeoCoordinates(ingredient.coordinates);
  }
  
  // Get OpenStreetMap URL with markers
  function getDirectionsUrl() {
    const farmCoords = getFarmCoordinates();
    if (!farmCoords) return '';
    
    return `https://www.openstreetmap.org/directions?from=${OPRYLAND_COORDS[0]},${OPRYLAND_COORDS[1]}&to=${farmCoords[0]},${farmCoords[1]}`;
  }
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  // Helper function to generate a percentage for each month based on availability
  function getAvailabilityData() {
    if (!ingredient || !ingredient.seasonalData) return months.map(() => 0);
    
    return months.map(month => {
      const monthData = ingredient.seasonalData.find(d => d.month === month);
      return monthData ? monthData.availability : 0;
    });
  }
  
  // Helper to determine latest harvest date
  function getLatestHarvest() {
    if (!ingredient || !ingredient.latestHarvest) return 'Unknown';
    
    const harvestDate = new Date(ingredient.latestHarvest);
    const now = new Date();
    const diffDays = Math.round((now - harvestDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return harvestDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Replace the OpenStreetMap URL functions with a static map function
  function getStaticMapUrl() {
    const farmCoords = getFarmCoordinates();
    if (!farmCoords) return '';
    
    // MapBox static image API
    // Note: In a real implementation, you would use your own MapBox access token
    // For this example, we're using a placeholder token
    const MAPBOX_ACCESS_TOKEN = 'pk.placeholder.token';
    
    // Calculate center point between farm and restaurant for better framing
    const centerLat = (farmCoords[0] + OPRYLAND_COORDS[0]) / 2;
    const centerLng = (farmCoords[1] + OPRYLAND_COORDS[1]) / 2;
    
    // Calculate the proper zoom level based on distance
    // Simple algorithm - can be refined for better results
    const latDiff = Math.abs(farmCoords[0] - OPRYLAND_COORDS[0]);
    const lngDiff = Math.abs(farmCoords[1] - OPRYLAND_COORDS[1]);
    const maxDiff = Math.max(latDiff, lngDiff) * 1.5;
    let zoom = 10;
    
    if (maxDiff > 0.2) zoom = 8;
    else if (maxDiff > 0.1) zoom = 9;
    else if (maxDiff > 0.05) zoom = 10;
    else if (maxDiff > 0.02) zoom = 11;
    else zoom = 12;
    
    // Restaurant marker
    const restaurantMarker = `pin-s+FC6234(${OPRYLAND_COORDS[1]},${OPRYLAND_COORDS[0]})`;
    
    // Farm marker
    const farmMarker = `pin-s+43A047(${farmCoords[1]},${farmCoords[0]})`;
    
    // Calculate the path between points for the connection line
    // Connect restaurant to farm with a line
    const pathLine = `path-2+33333355(${OPRYLAND_COORDS[1]},${OPRYLAND_COORDS[0]};${farmCoords[1]},${farmCoords[0]})`;
    
    // Build the MapBox Static API URL
    return `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${pathLine},${restaurantMarker},${farmMarker}/${centerLng},${centerLat},${zoom},0/600x300@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;
  }
  
  // Enhanced static map functions
  function createStaticMap() {
    const mapContainer = document.getElementById('static-map-container');
    if (!mapContainer) return;
    
    const farmCoords = getFarmCoordinates();
    if (!farmCoords) return;
    
    // Calculate relative positions for the markers on our custom map
    // Create a bounding box that encompasses both points
    const north = Math.max(farmCoords[0], OPRYLAND_COORDS[0]) + 0.05;
    const south = Math.min(farmCoords[0], OPRYLAND_COORDS[0]) - 0.05;
    const east = Math.max(farmCoords[1], OPRYLAND_COORDS[1]) + 0.05;
    const west = Math.min(farmCoords[1], OPRYLAND_COORDS[1]) - 0.05;
    
    // Calculate position percentages
    const farmX = ((farmCoords[1] - west) / (east - west)) * 100;
    const farmY = ((north - farmCoords[0]) / (north - south)) * 100;
    const restaurantX = ((OPRYLAND_COORDS[1] - west) / (east - west)) * 100;
    const restaurantY = ((north - OPRYLAND_COORDS[0]) / (north - south)) * 100;
    
    // Create the static map HTML with enhanced visual elements and grayscale styling
    mapContainer.innerHTML = `
      <div class="static-map grayscale-map">
        <div class="map-background"></div>
        
        <!-- Grid lines for map context -->
        <div class="map-grid">
          <div class="grid-line horizontal"></div>
          <div class="grid-line horizontal"></div>
          <div class="grid-line horizontal"></div>
          <div class="grid-line vertical"></div>
          <div class="grid-line vertical"></div>
          <div class="grid-line vertical"></div>
        </div>
        
        <!-- Rivers and major roads for geographic context -->
        <div class="map-features">
          <div class="cumberland-river"></div>
          <div class="interstate i-40"></div>
          <div class="interstate i-65"></div>
          <div class="interstate i-24"></div>
        </div>
        
        <!-- Nashville neighborhoods -->
        <div class="map-neighborhoods">
          <div class="neighborhood downtown">Downtown</div>
          <div class="neighborhood east">East Nashville</div>
          <div class="neighborhood west">West End</div>
          <div class="neighborhood south">12 South</div>
          <div class="neighborhood opryland">Opryland</div>
        </div>
        
        <!-- Map Elements -->
        <div class="map-elements">
          <div class="restaurant-marker" style="left: ${restaurantX}%; top: ${restaurantY}%;" title="Verdantia Restaurant"></div>
          <div class="farm-marker" style="left: ${farmX}%; top: ${farmY}%;" title="${ingredient.farm}"></div>
          
          <!-- Connection line with distance representation -->
          <svg class="connection-line" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="4" 
                refX="0" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="rgba(0,0,0,0.4)" />
              </marker>
            </defs>
            <line 
              x1="${restaurantX}" y1="${restaurantY}" 
              x2="${farmX}" y2="${farmY}" 
              marker-end="url(#arrowhead)"
            />
          </svg>
          
          <!-- Distance indicator -->
          <div class="distance-indicator" style="left: ${(restaurantX + farmX) / 2}%; top: ${(restaurantY + farmY) / 2}%;">
            ${ingredient.distance} miles
          </div>
        </div>
        
        <!-- Location labels with enhanced styling -->
        <div class="location-label restaurant-label" style="left: ${restaurantX}%; top: ${restaurantY + 3}%;">
          Verdantia
        </div>
        <div class="location-label farm-label" style="left: ${farmX}%; top: ${farmY + 3}%;">
          ${ingredient.farm}
        </div>
        
        <!-- Compass rose for orientation -->
        <div class="compass-rose">
          <div class="compass-arrow n">N</div>
          <div class="compass-arrow e">E</div>
          <div class="compass-arrow s">S</div>
          <div class="compass-arrow w">W</div>
        </div>
      </div>
    `;
  }
  
  // Helper for ingredient icon generation
  function getIngredientIcon(name) {
    if (!name) return 'I';
    
    // Return first character of each word in the ingredient name
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2); // Limit to 2 characters
  }
  
  onMount(() => {
    // Set map as loaded when iframe loads
    const mapIframe = document.getElementById('osm-map');
    if (mapIframe) {
      mapIframe.onload = () => {
        mapLoaded = true;
      };
    }
    // Replace the iframe loading with our static map initialization
    setTimeout(() => {
      createStaticMap();
      mapLoaded = true;
    }, 100);
  });

  // Updated OpenStreetMap URL function with better marker support
  function getOpenStreetMapUrl() {
    const farmCoords = getFarmCoordinates();
    if (!farmCoords) return '';
    
    // Calculate bounds to show both points
    const southWest = [
      Math.min(farmCoords[0], OPRYLAND_COORDS[0]) - 0.025,
      Math.min(farmCoords[1], OPRYLAND_COORDS[1]) - 0.025
    ];
    
    const northEast = [
      Math.max(farmCoords[0], OPRYLAND_COORDS[0]) + 0.025,
      Math.max(farmCoords[1], OPRYLAND_COORDS[1]) + 0.025
    ];
    
    // Use CartoDB Positron for a cleaner, more stylish grayscale map
    let mapUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
    
    // Create map URL with Leaflet
    return `https://www.openstreetmap.org/export/embed.html?bbox=${southWest[1]},${southWest[0]},${northEast[1]},${northEast[0]}&layer=mapnik&marker=${farmCoords[0]},${farmCoords[1]}&marker=${OPRYLAND_COORDS[0]},${OPRYLAND_COORDS[1]}`;
  }
  
  // Remove the first initializeMap function and keep only the enhanced Leaflet version
  
  // Initialize map with Leaflet for better styling
  function initializeLeafletMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;
    
    const farmCoords = getFarmCoordinates();
    if (!farmCoords) return;
    
    // Create a div for Leaflet map
    mapContainer.innerHTML = `
      <div id="leaflet-map" style="width:100%; height:100%;"></div>
      <div class="map-controls">
        <a href="${getDirectionsUrl()}" target="_blank" rel="noopener" class="directions-link">
          <span class="directions-icon">🗺️</span> Get Directions
        </a>
      </div>
    `;
    
    // Add Leaflet CSS to head if not already present
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      link.crossOrigin = '';
      document.head.appendChild(link);
      
      // Wait for CSS to load
      setTimeout(loadLeafletScript, 100);
    } else {
      loadLeafletScript();
    }
  }
  
  function loadLeafletScript() {
    // Wait for Leaflet script to load
    if (typeof L === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
      script.crossOrigin = '';
      script.onload = () => {
        createLeafletMap();
      };
      document.head.appendChild(script);
    } else {
      createLeafletMap();
    }
  }
  
  function createLeafletMap() {
    const farmCoords = getFarmCoordinates();
    if (!farmCoords || !window.L) return;
    
    const leafletMap = document.getElementById('leaflet-map');
    if (!leafletMap) return;
    
    // Create map
    const map = L.map('leaflet-map').setView([
      (farmCoords[0] + OPRYLAND_COORDS[0]) / 2,
      (farmCoords[1] + OPRYLAND_COORDS[1]) / 2
    ], 10);
    
    // Add styled tile layer (CartoDB Positron - elegant grayscale)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);
    
    // Custom icons
    const restaurantIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin restaurant-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    
    const farmIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin farm-pin"></div>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });
    
    // Add restaurant marker
    const restaurantMarker = L.marker([OPRYLAND_COORDS[0], OPRYLAND_COORDS[1]], {
      icon: restaurantIcon
    }).addTo(map);
    restaurantMarker.bindPopup('<b>Verdantia Restaurant</b>').openPopup();
    
    // Add farm marker
    const farmMarker = L.marker([farmCoords[0], farmCoords[1]], {
      icon: farmIcon
    }).addTo(map);
    farmMarker.bindPopup(`<b>${ingredient.farm}</b><br>${ingredient.distance} miles from restaurant`);
    
    // Add line connecting the two points
    const polyline = L.polyline([
      [OPRYLAND_COORDS[0], OPRYLAND_COORDS[1]],
      [farmCoords[0], farmCoords[1]]
    ], {
      color: '#025c48',
      opacity: 0.7,
      weight: 3,
      dashArray: '5, 10'
    }).addTo(map);
    
    // Fit map bounds to show both markers
    const bounds = L.latLngBounds(
      [OPRYLAND_COORDS[0], OPRYLAND_COORDS[1]],
      [farmCoords[0], farmCoords[1]]
    );
    map.fitBounds(bounds, { padding: [30, 30] });
    
    // Set map as loaded
    mapLoaded = true;
  }
  
  onMount(() => {
    // Initialize the map when component mounts
    setTimeout(initializeLeafletMap, 100);
  });
</script>

{#if ingredient}
  <div class="ingredient-source-modal" in:fade={{ duration: 300 }} out:fade={{ duration: 200 }}>
    <div class="modal-backdrop" on:click={onClose}></div>
    <div class="modal-content" in:fly={{ y: 20, duration: 400 }}>
      <button class="modal-close" on:click={onClose} aria-label="Close details">
        <span>×</span>
      </button>
      
      <div class="modal-layout">
        <div class="modal-header">
          <div class="source-badge">Local Source</div>
          <h3>{ingredient.name}</h3>
          
          <div class="header-badges">
            {#if ingredient.organic}
              <div class="organic-badge">
                <span class="badge-icon">O</span>
                <span>Certified Organic</span>
              </div>
            {/if}
            
            {#if ingredient.nonGMO}
              <div class="non-gmo-badge">
                <span class="badge-icon">NG</span>
                <span>Non-GMO</span>
              </div>
            {/if}
          </div>
        </div>
        
        <div class="source-image-container">
          <div class="ingredient-representation">
            <div class="ingredient-icon">
              <span>{getIngredientIcon(ingredient.name)}</span>
            </div>
            <div class="ingredient-name-display">{ingredient.name}</div>
            {#if ingredient.farm}
              <div class="ingredient-farm">From {ingredient.farm}</div>
            {/if}
          </div>
          
          {#if ingredient.distance}
            <div class="distance-badge" title="Distance from Nashville">
              <span class="distance-icon">📍</span>
              <span class="distance-value">{ingredient.distance} mi</span>
            </div>
          {/if}
          
          {#if ingredient.latestHarvest}
            <div class="harvest-badge" title="Harvested on {new Date(ingredient.latestHarvest).toLocaleDateString()}">
              <span class="harvest-icon">🌱</span>
              <span class="harvest-value">{getLatestHarvest()}</span>
            </div>
          {/if}
        </div>
        
        <div class="tab-navigation">
          <button 
            class="tab-button {activeTab === 'overview' ? 'active' : ''}" 
            on:click={() => activeTab = 'overview'}>
            Overview
          </button>
          <button 
            class="tab-button {activeTab === 'seasonal' ? 'active' : ''}" 
            on:click={() => activeTab = 'seasonal'}>
            Seasonal
          </button>
          <button 
            class="tab-button {activeTab === 'nutrition' ? 'active' : ''}" 
            on:click={() => activeTab = 'nutrition'}>
            Nutrition
          </button>
          <button 
            class="tab-button {activeTab === 'impact' ? 'active' : ''}" 
            on:click={() => activeTab = 'impact'}>
            Impact
          </button>
        </div>
        
        <div class="tab-content">
          <!-- Overview Tab -->
          {#if activeTab === 'overview'}
            <div class="tab-panel overview-panel" transition:fade={{ duration: 150 }}>
              <div class="farm-details">
                <div class="farm-header">
                  <h4>About {ingredient.farm}</h4>
                  {#if ingredient.farmSince}
                    <span class="farm-established">Est. {ingredient.farmSince}</span>
                  {/if}
                </div>
                
                <p class="farm-description">{ingredient.farmDescription || 'No detailed description available.'}</p>
                
                <div class="farmer-profile">
                  <div class="farmer-info">
                    {#if ingredient.farmerName}
                      <h5>Meet {ingredient.farmerName}</h5>
                      <p>{ingredient.farmerBio || 'No farmer bio available.'}</p>
                    {/if}
                  </div>
                </div>
                
                {#if ingredient.coordinates}
                  <div class="farm-location">
                    <h5>Farm Location in Nashville Area</h5>
                    <div class="map-container">
                      <div id="map-container" class="osm-map-container">
                        <div class="map-loading">
                          <span class="loading-spinner"></span>
                          <span class="loading-text">Loading map...</span>
                        </div>
                      </div>
                      
                      <div class="map-legend-panel">
                        <div class="legend-item">
                          <div class="legend-marker restaurant"></div>
                          <span>Verdantia Restaurant</span>
                        </div>
                        <div class="legend-item">
                          <div class="legend-marker farm"></div>
                          <span>{ingredient.farm}</span>
                        </div>
                        <div class="legend-distance">
                          <strong>{ingredient.distance}</strong> miles
                        </div>
                      </div>
                    </div>
                    
                    <div class="distance-info">
                      <div class="distance-badge">
                        <span class="badge-icon">R</span> 
                        <span class="badge-value">
                          {ingredient.distance} miles from our restaurant
                        </span>
                      </div>
                      <p class="distance-note">
                        This {ingredient.name} travels approximately {ingredient.distance} miles to reach Verdantia, supporting our commitment to reducing food miles and providing the freshest ingredients.
                      </p>
                    </div>
                  </div>
                {/if}
                
                {#if ingredient.market}
                  <div class="market-info">
                    <h5>Available at {ingredient.market}</h5>
                    {#if nashvilleMarkets[ingredient.market]}
                      <div class="market-details">
                        <p class="market-address">{nashvilleMarkets[ingredient.market].address}</p>
                        <p class="market-hours">{nashvilleMarkets[ingredient.market].hours}</p>
                        <p class="market-description">{nashvilleMarkets[ingredient.market].description}</p>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
          
          <!-- Seasonal Tab -->
          {#if activeTab === 'seasonal'}
            <div class="tab-panel seasonal-panel" transition:fade={{ duration: 150 }}>
              <div class="seasonal-info">
                <h4>Seasonal Availability</h4>
                <p class="season-description">
                  {ingredient.name} is primarily in season {ingredient.season || 'year-round'}.
                  {ingredient.seasonalNotes || ''}
                </p>
                
                <div class="seasonal-chart-container">
                  <h5>Availability Calendar</h5>
                  
                  <!-- SVG-based seasonal availability chart -->
                  <div class="availability-chart">
                    <!-- Y-axis -->
                    <div class="chart-y-axis">
                        <span class="y-label">100%</span>                     
                        <span class="y-label">50%</span>
                        <span class="y-label">0%</span>
                    </div>
                    
                    <!-- SVG chart -->
                    <svg class="availability-svg" viewBox="0 0 600 250" preserveAspectRatio="xMidYMid meet">
                      <!-- Grid lines -->
                      <line x1="40" y1="200" x2="580" y2="200" stroke="#E0E0E0" stroke-width="1" />
                      <line x1="40" y1="100" x2="580" y2="100" stroke="#E0E0E0" stroke-width="1" stroke-dasharray="4" />
                      <line x1="40" y1="0" x2="580" y2="0" stroke="#E0E0E0" stroke-width="1" />
                      
                      <!-- Month bars -->
                      {#each getAvailabilityData() as availability, i}
                        {@const barX = 50 + (i * 45)}
                        {@const barHeight = availability * 2}
                        {@const barColor = availability > 70 ? '#43A047' : availability > 30 ? '#FFC107' : '#E0E0E0'}
                        
                        <!-- Bar -->
                        <rect 
                          x={barX} 
                          y={200 - barHeight} 
                          width="30" 
                          height={barHeight} 
                          fill={barColor} 
                          rx="2"
                          opacity="0.85"
                        >
                          <title>{availability}% available in {months[i]}</title>
                        </rect>
                        
                        <!-- Month label -->
                        <text 
                          x={barX + 15} 
                          y="220" 
                          font-family="'Inter 24pt Regular', sans-serif" 
                          font-size="12" 
                          text-anchor="middle" 
                          fill="#666"
                        >
                          {months[i]}
                        </text>
                        
                        <!-- Value label (only for high values) -->
                        {#if availability > 30}
                          <text 
                            x={barX + 15} 
                            y={195 - barHeight} 
                            font-family="'Inter 24pt Regular', sans-serif" 
                            font-size="11" 
                            text-anchor="middle" 
                            fill="#444"
                            font-weight="bold"
                          >
                            {availability}%
                          </text>
                        {/if}
                      {/each}
                    </svg>
                  </div>
                </div>
                
                {#if ingredient.peakSeason}
                  <div class="peak-season">
                    <h5>Peak Season</h5>
                    <p>{ingredient.peakSeason}</p>
                  </div>
                {/if}
                
                {#if ingredient.harvestMethods}
                  <div class="harvest-methods">
                    <h5>Harvest Methods</h5>
                    <p>{ingredient.harvestMethods}</p>
                  </div>
                {/if}
                
                {#if ingredient.storageInfo}
                  <div class="storage-info">
                    <h5>Optimal Storage</h5>
                    <p>{ingredient.storageInfo}</p>
                    {#if ingredient.shelfLife}
                      <p class="shelf-life">Shelf Life: {ingredient.shelfLife}</p>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
          
          <!-- Nutrition Tab -->
          {#if activeTab === 'nutrition'}
            <div class="tab-panel nutrition-panel" transition:fade={{ duration: 150 }}>
              <div class="nutrition-info">
                <h4>Nutritional Benefits</h4>
                <p class="nutrition-description">
                  {ingredient.nutritionDescription || 'No detailed nutrition information available.'}
                </p>
                
                {#if ingredient.nutritionComparison}
                  <div class="nutrition-comparison">
                    <h5>Nutrition Comparison: Local vs. Conventional</h5>
                    
                    <!-- SVG-based nutrition comparison chart -->
                    <div class="nutrition-chart">
                      <!-- Chart header -->
                      <div class="chart-header">
                        <div class="nutrient-header">Nutrient</div>
                        <div class="value-scale">
                          <span>0</span>
                          <span>25</span>
                          <span>50</span>
                          <span>75</span>
                          <span>100</span>
                        </div>
                      </div>
                      
                      <!-- Chart rows -->
                      {#each Object.entries(ingredient.nutritionComparison) as [nutrient, comparison]}
                        {@const localWidth = (comparison.local / comparison.max) * 100}
                        {@const conventionalWidth = (comparison.conventional / comparison.max) * 100}
                        
                        <div class="chart-row">
                          <div class="nutrient-name">{nutrient}</div>
                          <div class="bar-container">
                            <div class="comparison-bars">
                              <!-- Local value bar -->
                              <div 
                                class="local-bar" 
                                style="width: {localWidth}%;"
                                data-value={comparison.local}
                              ></div>
                              
                              <!-- Conventional value bar -->
                              <div 
                                class="conventional-bar" 
                                style="width: {conventionalWidth}%;"
                                data-value={comparison.conventional}
                              ></div>
                            </div>
                          </div>
                        </div>
                      {/each}
                      
                      <!-- Chart legend -->
                      <div class="chart-legend">
                        <div class="legend-item">
                          <span class="legend-color local"></span>
                          <span>Local ({ingredient.farm})</span>
                        </div>
                        <div class="legend-item">
                          <span class="legend-color conventional"></span>
                          <span>Conventional</span>
                        </div>
                      </div>
                    </div>
                  </div>
                {/if}
                
                {#if ingredient.nutritionBenefits && ingredient.nutritionBenefits.length > 0}
                  <div class="nutrition-benefits">
                    <h5>Key Benefits</h5>
                    <ul class="benefits-list">
                      {#each ingredient.nutritionBenefits as benefit}
                        <li class="benefit-item">
                          <span class="benefit-icon">{benefit.icon || "+"}</span>
                          <div class="benefit-detail">
                            <span class="benefit-name">{benefit.name}</span>
                            <span class="benefit-description">{benefit.description}</span>
                          </div>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
                
                {#if ingredient.freshnessTips}
                  <div class="freshness-tips">
                    <h5>Freshness Indicators</h5>
                    <p>{ingredient.freshnessTips}</p>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
          
          <!-- Impact Tab -->
          {#if activeTab === 'impact'}
            <div class="tab-panel impact-panel" transition:fade={{ duration: 150 }}>
              <div class="impact-info">
                <h4>Environmental & Community Impact</h4>
                
                {#if ingredient.environmentalImpact}
                  <div class="environmental-impact">
                    <h5>Environmental Benefits</h5>
                    <p>{ingredient.environmentalImpact}</p>
                    
                    {#if ingredient.carbonFootprint}
                      <div class="carbon-footprint">
                        <div class="footprint-comparison">
                          <div class="footprint-local">
                            <span class="footprint-value">{ingredient.carbonFootprint.local}</span>
                            <span class="footprint-label">Local Sourcing CO₂</span>
                          </div>
                          <div class="footprint-vs">vs</div>
                          <div class="footprint-conventional">
                            <span class="footprint-value">{ingredient.carbonFootprint.conventional}</span>
                            <span class="footprint-label">Conventional CO₂</span>
                          </div>
                        </div>
                        
                        <!-- Carbon savings visualization -->
                        <div class="carbon-savings-visual">
                          <div class="savings-bar-container">
                            <div class="savings-bar" style="width: {ingredient.carbonFootprint.savings}%;">
                              <span class="savings-value">{ingredient.carbonFootprint.savings}%</span>
                            </div>
                          </div>
                          <div class="savings-label">Carbon Footprint Reduction</div>
                        </div>
                      </div>
                    {/if}
                  </div>
                {/if}
                
                <div class="sustainability-section">
                  <h5>Sustainability Practices</h5>
                  <ul class="practices-list">
                    {#each ingredient.practices || [] as practice}
                      <li class="practice-item">
                        <span class="practice-icon">{practice.icon || "•"}</span>
                        <div class="practice-detail">
                          <span class="practice-name">{practice.name}</span>
                          {#if practice.description}
                            <span class="practice-description">{practice.description}</span>
                          {/if}
                        </div>
                      </li>
                    {/each}
                  </ul>
                </div>
                
                {#if ingredient.communityImpact}
                  <div class="community-impact">
                    <h5>Community Impact</h5>
                    <p>{ingredient.communityImpact}</p>
                    
                    {#if ingredient.jobsSupported}
                      <div class="community-jobs">
                        <span class="jobs-icon">👥</span>
                        <span class="jobs-value">Supports {ingredient.jobsSupported} local jobs</span>
                      </div>
                    {/if}
                  </div>
                {/if}
                
                {#if ingredient.farmVisit}
                  <div class="farm-visit">
                    <h5>Visit the Farm</h5>
                    <p>{ingredient.farmVisit}</p>
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "../styles/variables" as v;
  
  .ingredient-source-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1100; /* Higher than MenuItemModal */
    display: flex;
    align-items: center;
    justify-content: center;
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(v.$font-color-dark, 0.75);
      backdrop-filter: blur(5px);
      cursor: pointer;
    }
    
    .modal-content {
      position: relative;
      width: 90%;
      max-width: 720px;
      max-height: 85vh;
      background-color: white;
      border-radius: 10px;
      box-shadow: 
        0 10px 35px rgba(0, 0, 0, 0.12),
        0 2px 15px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      z-index: 1101;
    }
    
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: white;
      border: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10;
      transition: all 0.2s ease;
      
      span {
        font-size: 1.7rem;
        line-height: 0;
        margin-top: -2px;
        color: #666;
        transition: all 0.2s ease;
        font-family: "Inter 24pt Regular", sans-serif;
      }
      
      &:hover {
        background-color: v.$tertiary;
        transform: scale(1.05) rotate(90deg);
        
        span {
          color: white;
        }
      }
    }
  }
  
  .modal-layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: rgba(v.$tertiary-light, 0.03);
      border-radius: 0 10px 10px 0;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(v.$tertiary, 0.15);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: rgba(v.$tertiary, 0.25);
    }
  }
  
  .modal-header {
    padding: 26px 28px 16px;
    border-bottom: 1px solid rgba(v.$tertiary-light, 0.1);
    position: relative;
    
    h3 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.8rem;
      color: v.$tertiary-dark;
      margin: 0 0 8px;
      line-height: 1.3;
    }
  }
  
  .source-badge {
    display: inline-block;
    background-color: v.$primary;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 4px;
    margin-bottom: 10px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .header-badges {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }
  
  .organic-badge, .non-gmo-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: v.$tertiary-dark;
    color: white;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
    font-family: "Inter 24pt Regular", sans-serif;
    
    .badge-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      font-size: 0.65rem;
      font-weight: bold;
    }
  }
  
  .non-gmo-badge {
    background-color: v.$secondary;
  }
  
  .source-image-container {
    width: 100%;
    height: 240px;
    overflow: hidden;
    background-color: #f9f9f9;
    position: relative;
    
    .ingredient-representation {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
      padding: 20px;
      
      .ingredient-icon {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-color: v.$tertiary-dark;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 15px;
        box-shadow: 0 4px 15px rgba(v.$tertiary, 0.2);
        font-family: "DynaPuff Regular", cursive;
        
        &::after {
          content: '';
          position: absolute;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 1px dashed rgba(v.$tertiary, 0.3);
          animation: rotate 60s linear infinite;
        }
      }
      
      .ingredient-name-display {
        font-size: 1.6rem;
        font-weight: 600;
        color: v.$tertiary-dark;
        text-align: center;
        margin-bottom: 8px;
        font-family: "DynaPuff Regular", cursive;
      }
      
      .ingredient-farm {
        font-size: 1rem;
        color: #666;
        font-style: italic;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
  }
  
  .distance-badge, .harvest-badge {
    position: absolute;
    z-index: 2;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 30px;
    font-size: 0.85rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    font-family: "Inter 24pt Regular", sans-serif;
  }
  
  .distance-badge {
    bottom: 15px;
    left: 15px;
    color: v.$secondary;
  }
  
  .harvest-badge {
    bottom: 15px;
    right: 15px;
    color: v.$tertiary-dark;
  }
  
  .tab-navigation {
    display: flex;
    border-bottom: 1px solid #e0e0e0;
    
    .tab-button {
      flex: 1;
      background: none;
      border: none;
      padding: 14px;
      font-family: "Inter 24pt Regular", sans-serif;
      font-weight: 500;
      color: #666;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      position: relative;
      cursor: pointer;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: v.$primary;
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }
      
      &:hover {
        color: v.$tertiary;
      }
      
      &.active {
        color: v.$tertiary-dark;
        font-weight: 600;
        
        &::after {
          transform: scaleX(1);
        }
      }
    }
  }
  
  .tab-content {
    padding: 0;
  }
  
  .tab-panel {
    padding: 25px 28px;
    
    h4 {
      font-family: "DynaPuff Regular", cursive;
      font-size: 1.2rem;
      color: v.$tertiary;
      margin: 0 0 15px;
    }
    
    h5 {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: v.$tertiary;
      margin: 20px 0 10px;
    }
    
    p {
      font-family: "Inter 24pt Regular", sans-serif;
      line-height: 1.6;
      color: #444;
      margin: 0 0 15px;
      font-size: 0.95rem;
    }
  }
  
  // Overview Tab Styles
  .farm-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    
    .farm-established {
      font-family: "Inter 24pt Regular", sans-serif;
      font-size: 0.85rem;
      color: #757575;
    }
  }
  
  .farmer-profile {
    margin: 20px 0;
    background-color: rgba(v.$tertiary-light, 0.03);
    border-radius: 8px;
    padding: 15px;
    
    .farmer-info {
      flex: 1;
      
      h5 {
        margin-top: 0;
      }
      
      p {
        margin-bottom: 0;
        font-size: 0.9rem;
      }
    }
  }
  
  .farm-location {
    margin-bottom: 30px;
    
    .static-map-container {
      position: relative;
      height: 300px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin: 15px 0;
      border: 1px solid #e5e5e5;
      background-color: #f5f5f5;
      
      .static-map-content {
        width: 100%;
        height: 100%;
        position: relative;
      }
      
      .static-map.grayscale-map {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        
        .map-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #e6e6e6; // Make background more gray
          z-index: 1;
        }
        
        .map-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          
          .grid-line {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.04); // Lighter grid lines for gray map
            
            &.horizontal {
              width: 100%;
              height: 1px;
              left: 0;
              
              &:nth-child(1) { top: 25%; }
              &:nth-child(2) { top: 50%; }
              &:nth-child(3) { top: 75%; }
            }
            
            &.vertical {
              height: 100%;
              width: 1px;
              top: 0;
              
              &:nth-child(4) { left: 25%; }
              &:nth-child(5) { left: 50%; }
              &:nth-child(6) { left: 75%; }
            }
          }
        }
        
        .map-features {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          
          .cumberland-river {
            position: absolute;
            width: 70%;
            height: 12px;
            background: linear-gradient(to right, rgba(170, 170, 170, 0.3), rgba(170, 170, 170, 0.5));
            top: 45%;
            left: 15%;
            border-radius: 6px;
            transform: rotate(5deg);
          }
          
          .interstate {
            position: absolute;
            background-color: rgba(255, 255, 255, 0.9);
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
            
            &.i-40 {
              width: 80%;
              height: 3px;
              top: 50%;
              left: 10%;
            }
            
            &.i-65 {
              width: 3px;
              height: 80%;
              top: 10%;
              left: 50%;
            }
            
            &.i-24 {
              width: 50%;
              height: 2px;
              top: 30%;
              left: 30%;
              transform: rotate(30deg);
            }
          }
        }
        
        .map-neighborhoods {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          
          .neighborhood {
            position: absolute;
            font-size: 0.65rem;
            color: rgba(0, 0, 0, 0.4);
            font-weight: 500;
            font-family: "Inter 24pt Regular", sans-serif;
            
            &.downtown {
              top: 42%;
              left: 47%;
            }
            
            &.east {
              top: 35%;
              left: 60%;
            }
            
            &.west {
              top: 55%;
              left: 30%;
            }
            
            &.south {
              top: 65%;
              left: 45%;
            }
            
            &.opryland {
              top: 20%;
              right: 25%;
            }
          }
        }
        
        .map-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
        }
        
        .restaurant-marker, .farm-marker {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: 6;
        }
        
        // Updated marker colors to match the site's theme
        .restaurant-marker {
          width: 14px;
          height: 14px;
          background-color: v.$primary;
          border: 2px solid white;
          box-shadow: 0 0 0 4px rgba(v.$primary, 0.15); // Subtle glow effect
          
          &::after {
            content: '';
            position: absolute;
            width: 30px;
            height: 30px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(v.$primary, 0.1) 0%, rgba(v.$primary, 0) 70%);
            border-radius: 50%;
            z-index: -1;
          }
        }
        
        .farm-marker {
          width: 12px;
          height: 12px;
          background-color: v.$tertiary-dark;
          border: 2px solid white;
          box-shadow: 0 0 0 3px rgba(v.$tertiary-dark, 0.1); // Subtle glow effect
          
          &::after {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: radial-gradient(circle, rgba(v.$tertiary-dark, 0.1) 0%, rgba(v.$tertiary-dark, 0) 70%);
            border-radius: 50%;
            z-index: -1;
          }
        }
        
        .connection-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 5;
          
          line {
            stroke: rgba(0, 0, 0, 0.15); // More subtle line color for gray map
            stroke-width: 1;
            stroke-dasharray: 3;
            animation: dash 30s linear infinite;
          }
        }
        
        .distance-indicator {
          position: absolute;
          transform: translate(-50%, -50%);
          background-color: white;
          color: #333;
          font-size: 0.75rem;
          padding: 4px 10px;
          border-radius: 12px;
          font-family: "Inter 24pt Regular", sans-serif;
          font-weight: 500;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
          z-index: 6;
          white-space: nowrap;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .location-label {
          position: absolute;
          transform: translateX(-50%);
          background: white;
          color: #333;
          font-size: 0.7rem;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
          font-family: "Inter 24pt Regular", sans-serif;
          z-index: 6;
          font-weight: 500;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .restaurant-label {
          color: v.$primary;
          font-weight: 600;
        }
        
        .farm-label {
          color: v.$tertiary-dark;
          font-weight: 600;
        }
        
        .compass-rose {
          position: absolute;
          bottom: 15px;
          right: 15px;
          width: 30px;
          height: 30px;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          z-index: 5;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
          
          .compass-arrow {
            position: absolute;
            font-size: 0.6rem;
            font-weight: 700;
            font-family: "Inter 24pt Regular", sans-serif;
            color: #555;
            
            &.n { top: 2px; left: 50%; transform: translateX(-50%); }
            &.e { right: 2px; top: 50%; transform: translateY(-50%); }
            &.s { bottom: 2px; left: 50%; transform: translateX(-50%); }
            &.w { left: 2px; top: 50%; transform: translateY(-50%); }
          }
          
          &::before, &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 1px;
            height: 20px;
            background-color: rgba(0, 0, 0, 0.3);
          }
          
          &::before {
            transform: translate(-50%, -50%) rotate(45deg);
          }
          
          &::after {
            transform: translate(-50%, -50%) rotate(-45deg);
          }
        }
      }
      
      .map-legend {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: white;
        border-radius: 8px;
        padding: 8px 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        font-family: "Inter 24pt Regular", sans-serif;
        font-size: 0.8rem;
        z-index: 10;
        border: 1px solid rgba(0, 0, 0, 0.05);
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          
          .legend-marker {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 1px solid white;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            
            &.restaurant {
              background-color: v.$primary;
            }
            
            &.farm {
              background-color: v.$tertiary-dark;
            }
          }
        }
        
        .legend-distance {
          margin-top: 8px;
          font-size: 0.75rem;
          color: #555;
          border-top: 1px solid #eee;
          padding-top: 6px;
          
          strong {
            color: #333;
          }
        }
      }
    }
    
    .distance-info {
      margin-top: 15px;
      
      .distance-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background-color: rgba(v.$secondary, 0.1); // Fixed: using $secondary instead of $secondary-light
        border-radius: 20px;
        padding: 6px 12px;
        margin-bottom: 10px;
        
        .badge-icon {
          font-size: 1rem;
        }
        
        .badge-value {
          font-weight: 500;
          color: v.$secondary; // Fixed: using $secondary instead of $secondary-dark
          font-size: 0.9rem;
        }
      }
      
      .distance-note {
        font-size: 0.9rem;
        line-height: 1.5;
        color: #555;
        margin: 0;
      }
    }
  }
  
  @keyframes pulse {
    0% {
      opacity: 0.6;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.3;
      transform: scale(1);
    }
    100% {
      opacity: 0.6;
      transform: scale(0.8);
    }
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: 100;
    }
  }
  
  // Seasonal Tab Styles - Enhanced SVG chart
  .seasonal-chart-container {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin: 20px 0;
  }
  
  .availability-chart {
    display: flex;
    margin-top: 20px;
    position: relative;
    
    .chart-y-axis {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 200px;
      padding-right: 10px;
      width: 40px;
      
      .y-label {
        font-size: 10px;
        color: #777;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
    
    .availability-svg {
      width: 100%;
      max-height: 240px;
      font-family: "Inter 24pt Regular", sans-serif;
    }
  }
  
  .shelf-life {
    display: inline-block;
    background-color: #E8F5E9;
    color: #2E7D32;
    font-size: 0.85rem;
    padding: 4px 10px;
    border-radius: 4px;
    margin-top: 5px;
  }
  
  // Nutrition Tab Styles - Enhanced chart
  .nutrition-comparison {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin: 20px 0;
  }
  
  .nutrition-chart {
    font-family: "Inter 24pt Regular", sans-serif;
    margin-top: 20px;
    
    .chart-header {
      display: flex;
      margin-bottom: 15px;
      
      .nutrient-header {
        width: 120px;
        font-size: 0.75rem;
        font-weight: 500;
        color: #777;
      }
      
      .value-scale {
        flex: 1;
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: #999;
      }
    }
    
    .chart-row {
      display: flex;
      margin-bottom: 18px;
      align-items: center;
      
      .nutrient-name {
        width: 120px;
        font-size: 0.85rem;
        color: #333;
        padding-right: 10px;
      }
      
      .bar-container {
        flex: 1;
        height: 36px;
        position: relative;
        
        .comparison-bars {
          position: relative;
          height: 100%;
          
          .local-bar, .conventional-bar {
            position: absolute;
            height: 18px;
            border-radius: 4px;
            transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            
            &::after {
              content: attr(data-value);
              position: absolute;
              right: 8px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 0.75rem;
              color: white;
              font-weight: 600;
              text-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
            }
          }
          
          .local-bar {
            top: 0;
            background-color: v.$tertiary-dark;
            box-shadow: 0 2px 4px rgba(v.$tertiary-dark, 0.3);
            z-index: 2;
          }
          
          .conventional-bar {
            bottom: 0;
            background-color: #9E9E9E;
            height: 12px;
            z-index: 1;
          }
        }
      }
    }

    .chart-legend {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      font-size: 0.85rem;
      
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          
          &.local {
            background-color: v.$tertiary-dark;
          }
          
          &.conventional {
            background-color: #9E9E9E;
          }
        }
      }
    }
  }
  
  .benefits-list {
    list-style: none;
    padding: 0;
    margin: 15px 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
    
    .benefit-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background-color: #FAFAFA;
      border-radius: 8px;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
      }
      
      .benefit-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(v.$tertiary-light, 0.2);
        color: v.$tertiary-dark;
        font-weight: bold;
      }
      
      .benefit-detail {
        flex: 1;
        
        .benefit-name {
          display: block;
          font-weight: 600;
          margin-bottom: 3px;
          color: v.$tertiary-dark;
          font-size: 0.95rem;
        }
        
        .benefit-description {
          font-size: 0.85rem;
          color: #555;
          display: block;
          line-height: 1.4;
        }
      }
    }
  }
  
  // Impact Tab Styles
  .carbon-footprint {
    background-color: #FAFAFA;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    
    .footprint-comparison {
      display: flex;
      align-items: center;
      justify-content: space-around;
      gap: 10px;
      margin-bottom: 20px;
      
      .footprint-local, .footprint-conventional {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        
        .footprint-value {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .footprint-label {
          font-size: 0.85rem;
          color: #555;
        }
      }
      
      .footprint-local .footprint-value {
        color: v.$tertiary-dark;
      }
      
      .footprint-conventional .footprint-value {
        color: v.$primary; // For contrast with the green
      }
      
      .footprint-vs {
        color: #757575;
        font-weight: 500;
      }
    }
    
    // Enhanced carbon savings visualization
    .carbon-savings-visual {
      text-align: center;
      
      .savings-bar-container {
        height: 35px;
        background-color: #EEEEEE;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 10px;
        position: relative;
        
        .savings-bar {
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(v.$tertiary-light, 0.7) 0%, 
            v.$tertiary 50%, 
            v.$tertiary-dark 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 15px;
          transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
          
          .savings-value {
            color: white;
            font-weight: 700;
            font-size: 1.1rem;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          }
        }
      }
      
      .savings-label {
        font-size: 0.95rem;
        color: v.$tertiary-dark;
        font-weight: 500;
      }
    }
  }
  
  .practices-list {
    list-style: none;
    padding: 0;
    margin: 15px 0;
    
    .practice-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px dashed #E0E0E0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .practice-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background-color: rgba(v.$tertiary-light, 0.1);
        border-radius: 50%;
        color: v.$tertiary;
        font-weight: bold;
        font-family: "Inter 24pt Regular", sans-serif;
        margin-top: 3px;
      }
      
      .practice-detail {
        flex: 1;
        
        .practice-name {
          display: block;
          font-weight: 600;
          margin-bottom: 3px;
          color: v.$tertiary-dark;
        }
        
        .practice-description {
          font-size: 0.9rem;
          color: #555;
          display: block;
          line-height: 1.5;
        }
      }
    }
  }
  
  .community-jobs {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba(v.$secondary, 0.1); // Fixed: using $secondary instead of $secondary-light
    padding: 10px 15px;
    border-radius: 30px;
    margin-top: 10px;
    display: inline-flex;
    
    .jobs-value {
      font-weight: 500;
      color: v.$secondary; // Fixed: using $secondary instead of $secondary-dark
    }
  }
  
  .farm-visit {
    background-color: rgba(v.$primary, 0.1); // Fixed: using $primary instead of $primary-light
    border-left: 3px solid v.$primary;
    border-radius: 8px;
    padding: 15px;
    margin-top: 20px;
  }
  
  @media screen and (max-width: 600px) {
    .modal-content {
      width: 95%;
      max-height: 90vh;
      border-radius: 8px;
    }
    
    .source-image-container {
      height: 180px;
    }
    
    .modal-header {
      padding: 20px 22px 14px;
      
      h3 {
        font-size: 1.5rem;
      }
    }
    
    .tab-panel {
      padding: 20px;
    }
    
    .tab-navigation .tab-button {
      padding: 12px 8px;
      font-size: 0.85rem;
    }
    
    .benefits-list {
      grid-template-columns: 1fr;
    }
    
    .farm-location .static-map-container {
      height: 220px;
    }
    
    .nutrition-chart .chart-row {
      flex-direction: column;
      align-items: flex-start;
      margin-bottom: 25px;
      
      .nutrient-name {
        width: 100%;
        margin-bottom: 6px;
      }
    }
    
    .footprint-comparison {
      flex-direction: column;
      gap: 15px;
      
      .footprint-vs {
        display: none;
      }
    }

    // Improve modal close button touch target
    .modal-close {
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      
      span {
        font-size: 1.8rem;
      }
    }
    
    // Make tabs more touch-friendly
    .tab-navigation {
      flex-wrap: wrap;
      
      .tab-button {
        padding: 12px 5px;
        font-size: 0.85rem;
        min-height: 44px; // Better touch target
      }
    }
    
    // Improve chart readability on small screens
    .nutrition-chart {
      .chart-header .value-scale {
        display: none; // Hide scale on mobile to save space
      }
      
      .chart-row {
        margin-bottom: 28px; // More space between rows
        
        .nutrient-name {
          margin-bottom: 8px;
          font-weight: 600;
        }
      }
    }
    
    // Fix seasonal chart on small screens
    .availability-chart {
      .chart-y-axis {
        width: 30px;
      }
      
      .availability-svg text {
        font-size: 10px; // Smaller text for month labels
      }
    }
    
    // Make badges wrap properly
    .header-badges {
      flex-wrap: wrap;
    }
    
    // Make static map work better on small screens
    .static-map.grayscale-map {
      .neighborhood {
        font-size: 0;
        
        &::before {
          content: '';
          display: block;
          width: 4px;
          height: 4px;
          background: rgba(0,0,0,0.2);
          border-radius: 50%;
        }
      }
      
      .location-label {
        padding: 2px 6px;
        font-size: 0.65rem;
      }
      
      .map-legend {
        max-width: 140px;
        font-size: 0.7rem;
      }
    }
    
    // Optimize benefits list for mobile
    .benefits-list .benefit-item {
      padding: 10px;
      
      .benefit-icon {
        width: 25px;
        height: 25px;
      }
    }
    
    // Improve carbon footprint visualization
    .carbon-footprint {
      .savings-bar {
        .savings-value {
          font-size: 0.9rem;
        }
      }
    }
  }
  
  // Additional styles for very small screens
  @media screen and (max-width: 360px) {
    .modal-content {
      width: 98%;
    }
    
    .tab-navigation {
      .tab-button {
        padding: 10px 3px;
        font-size: 0.8rem;
      }
    }
    
    .source-image-container {
      height: 160px;
    }
    
    .ingredient-icon {
      width: 70px !important;
      height: 70px !important;
      font-size: 2rem !important;
    }
    
    .ingredient-name-display {
      font-size: 1.3rem !important;
    }
    
    .distance-badge, .harvest-badge {
      font-size: 0.75rem;
      padding: 4px 8px;
    }
    
    .modal-header h3 {
      font-size: 1.3rem;
    }
    
    // Fix potential overflow in tab content
    .tab-panel {
      word-break: break-word;
    }
  }
  
  // Fix for landscape orientation on mobile
  @media screen and (max-height: 600px) and (orientation: landscape) {
    .modal-content {
      max-height: 95vh;
    }
    
    .source-image-container {
      height: 140px;
    }
    
    .static-map-container {
      height: 200px !important;
    }
  }

  .map-container {
    position: relative;
    height: 300px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin: 15px 0;
    background-color: #f5f5f5;
    
    .osm-map-container {
      width: 100%;
      height: 100%;
      position: relative;
    }
    
    .map-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #f8f8f8;
      z-index: 0;
      
      .loading-spinner {
        display: inline-block;
        width: 24px;
        height: 24px;
        border: 3px solid rgba(v.$tertiary, 0.2);
        border-radius: 50%;
        border-top-color: v.$tertiary;
        animation: spin 1s linear infinite;
        margin-bottom: 8px;
      }
      
      .loading-text {
        font-size: 0.85rem;
        color: #777;
        font-family: "Inter 24pt Regular", sans-serif;
      }
    }
    
    .map-controls {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 10;
      
      .directions-link {
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: white;
        color: v.$tertiary-dark;
        font-size: 0.8rem;
        padding: 6px 10px;
        border-radius: 4px;
        text-decoration: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        font-family: "Inter 24pt Regular", sans-serif;
        font-weight: 500;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: v.$tertiary-light;
          color: white;
          transform: translateY(-1px);
        }
      }
    }
  }
  
  .map-legend-panel {
    background: white;
    border-radius: 8px;
    padding: 10px 15px;
    margin-top: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    font-family: "Inter 24pt Regular", sans-serif;
    font-size: 0.85rem;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    justify-content: space-around;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .legend-marker {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid white;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        
        &.restaurant {
          background-color: v.$primary;
        }
        
        &.farm {
          background-color: v.$tertiary-dark;
        }
      }
    }
    
    .legend-distance {
      font-size: 0.9rem;
      color: #555;
      padding: 4px 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
      
      strong {
        color: v.$tertiary-dark;
      }
    }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  // Mobile styles
  @media screen and (max-width: 600px) {
    .map-container {
      height: 250px;
    }
    
    .map-legend-panel {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      
      .legend-distance {
        align-self: stretch;
        text-align: center;
        margin-top: 5px;
      }
    }
    
    .map-controls .directions-link {
      font-size: 0.75rem;
      padding: 5px 8px;
    }
  }
</style>
