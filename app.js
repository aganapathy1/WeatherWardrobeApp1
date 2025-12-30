/**
 * Weather Wardrobe App - Logic
 */

const app = {
    state: {
        wardrobe: [],
        currentScreen: 'home'
    },

    init: () => {
        // Load data from LocalStorage
        const saved = localStorage.getItem('weatherWardrobe');
        if (saved) {
            app.state.wardrobe = JSON.parse(saved);
        }
        app.renderWardrobe();

        // Initial Screen
        app.showSection('home');
    },

    showSection: (id) => {
        document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
        document.getElementById(id).classList.remove('hidden');
    },

    // --- Wardrobe Management ---

    addItem: () => {
        const name = document.getElementById('item-name').value;
        const category = document.getElementById('item-category').value;
        const color = document.getElementById('item-color').value;
        const fileInput = document.getElementById('item-image');

        if (!name) {
            alert("Please name your item!");
            return;
        }

        // Handle Image
        let imageUrl = 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=' + category; // Default

        const saveItem = (imgSrc) => {
            app.state.wardrobe.push({
                id: Date.now(),
                name,
                category,
                color,
                image: imgSrc
            });
            app.save();
            app.renderWardrobe();
            alert("Item Added!");
            // Reset form
            document.getElementById('item-name').value = '';
        };

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => saveItem(e.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            saveItem(imageUrl);
        }
    },

    renderWardrobe: () => {
        const gallery = document.getElementById('wardrobe-gallery');
        gallery.innerHTML = '';

        if (app.state.wardrobe.length === 0) {
            gallery.innerHTML = '<p class="text-muted">No clothes yet. Add some above!</p>';
            return;
        }

        app.state.wardrobe.forEach(item => {
            const div = document.createElement('div');
            div.className = 'clothes-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h4>${item.name}</h4>
                <small>${item.category} | ${item.color}</small>
            `;
            gallery.appendChild(div);
        });
    },

    save: () => {
        localStorage.setItem('weatherWardrobe', JSON.stringify(app.state.wardrobe));
    },

    // --- Weather & Outfit Engine ---

    getWeatherAndOutfit: async () => {
        const city = document.getElementById('city-input').value;
        if (!city) return;

        const btn = document.querySelector('#home button');
        const originalText = btn.innerText;
        btn.innerText = "Locating...";

        try {
            // 1. Geocoding (City -> Lat/Lon) - Using Open-Meteo Geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                alert("City not found!");
                btn.innerText = originalText;
                return;
            }

            const { latitude, longitude, name } = geoData.results[0];

            btn.innerText = "Fetching Weather...";

            // 2. Weather Data - Using Open-Meteo
            // temperature_2m, weathercode (WMO code)
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
            const weatherData = await weatherRes.json();

            const current = weatherData.current_weather;
            const temp = current.temperature;
            const wmoCode = current.weathercode;

            // Decode WMO
            let condition = "Clear";
            if (wmoCode > 0 && wmoCode <= 3) condition = "Cloudy";
            if (wmoCode >= 45 && wmoCode <= 48) condition = "Foggy";
            if (wmoCode >= 51 && wmoCode <= 67) condition = "Rainy";
            if (wmoCode >= 71) condition = "Snowy";
            if (wmoCode >= 95) condition = "Stormy";

            app.displayWeatherResult(name, temp, condition);

        } catch (e) {
            console.error(e);
            alert("Error fetching data. Please try again.");
        } finally {
            btn.innerText = originalText;
        }
    },

    displayWeatherResult: (city, temp, condition) => {
        document.getElementById('weather-result').classList.remove('hidden');
        document.getElementById('temp-display').innerText = `${temp}°F`;
        document.getElementById('condition-display').innerText = `${condition} in ${city}`;

        let advice = "";
        // Define constraints based on weather
        let constraints = {
            tempCategory: 'warm', // cold, cool, mild, warm, hot
            isRainy: condition.includes("Rain") || condition.includes("Storm"),
        };

        if (temp < 40) {
            advice = "It's FREEZING! Wear thick layers.";
            constraints.tempCategory = 'cold';
        } else if (temp < 60) {
            advice = "It's CHILLY. You need a jacket.";
            constraints.tempCategory = 'cool';
        } else if (temp < 75) {
            advice = "It's PLEASANT. Light layers work best.";
            constraints.tempCategory = 'mild';
        } else {
            advice = "It's HOT! Stay breathable.";
            constraints.tempCategory = 'hot';
        }

        if (constraints.isRainy) advice += " Don't forget an umbrella!";

        document.getElementById('outfit-reason').innerText = advice;
        app.generateSmartOutfit(constraints);
    },

    generateSmartOutfit: (constraints) => {
        const grid = document.getElementById('suggestion-grid');
        grid.innerHTML = '';
        const wardrobe = app.state.wardrobe;

        // 1. Filter by Weather (e.g. no shorts in cold)
        const weatherFiltered = {
            tops: wardrobe.filter(i => i.category === 'tops' || i.category === 'outerwear'), // In a real app, we'd tag items with 'warmth'
            bottoms: wardrobe.filter(i => {
                if (i.category !== 'jeans') return false; // assuming 'jeans' is our only bottom category for now
                // Logic: If hot, maybe lighter colors? (Simplification as we don't have 'shorts' vs 'pants' metadata yet)
                return true;
            }),
            shoes: wardrobe.filter(i => i.category === 'shoes')
        };

        // 2. Select Anchor Item (e.g. Top)
        const pickRandom = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null;

        // If cold, prioritize outerwear as anchor if available
        let top;
        if (constraints.tempCategory === 'cold' || constraints.tempCategory === 'cool') {
            // Try to find something that looks like outerwear/jacket based on name or category
            const jackets = weatherFiltered.tops.filter(t => t.category === 'outerwear' || t.name.toLowerCase().includes('jacket') || t.name.toLowerCase().includes('coat'));
            top = pickRandom(jackets) || pickRandom(weatherFiltered.tops);
        } else {
            top = pickRandom(weatherFiltered.tops);
        }

        if (!top) {
            grid.innerHTML = '<div style="padding:20px; color: pink;">No suitable tops found! Add more clothes.</div>';
            return;
        }

        // 3. Color Theory Logic
        // Simple harmony map
        // key: color -> values: [good matches]
        const harmony = {
            'black': ['white', 'grey', 'blue', 'red', 'yellow', 'green', 'black'],
            'white': ['black', 'blue', 'denim', 'grey', 'pink', 'purple'],
            'blue': ['white', 'grey', 'black', 'beige', 'yellow'],
            'navy': ['white', 'beige', 'grey'],
            'red': ['black', 'white', 'denim', 'blue'],
            'green': ['white', 'black', 'beige', 'denim'],
            'yellow': ['blue', 'black', 'white', 'denim'],
            'pink': ['white', 'denim', 'grey', 'black'],
            'grey': ['black', 'white', 'blue', 'pink', 'red'],
            'purple': ['white', 'black', 'grey']
        };

        const getBestMatch = (candidates, anchorColor) => {
            if (!anchorColor) return pickRandom(candidates); // Safety

            // Normalize color: try to map complex names e.g. "Sky Blue" -> "blue"
            const normalizeColor = (c) => {
                c = c.toLowerCase();
                if (c.includes('blue') || c.includes('navy') || c.includes('teal') || c.includes('cyan')) return 'blue';
                if (c.includes('red') || c.includes('maroon') || c.includes('burgundy') || c.includes('rose')) return 'red';
                if (c.includes('green') || c.includes('olive') || c.includes('lime') || c.includes('mint')) return 'green';
                if (c.includes('yellow') || c.includes('gold')) return 'yellow';
                if (c.includes('purple') || c.includes('violet') || c.includes('lavender')) return 'purple';
                if (c.includes('pink') || c.includes('magenta')) return 'pink';
                if (c.includes('white') || c.includes('cream') || c.includes('beige')) return 'white';
                if (c.includes('black') || c.includes('dark')) return 'black';
                if (c.includes('grey') || c.includes('gray') || c.includes('silver')) return 'grey';
                return 'black'; // default neutral
            };

            const normalizedAnchor = normalizeColor(anchorColor);
            const compatible = harmony[normalizedAnchor] || ['black', 'white', 'denim']; // fallback

            // Find matches by checking if candidate's normalized color is compatible
            const smartMatches = candidates.filter(i => {
                const normC = normalizeColor(i.color);
                return compatible.includes(normC);
            });

            if (smartMatches.length > 0) return pickRandom(smartMatches);

            // if no match, try neutral fallback
            const neutrals = candidates.filter(i => {
                const normC = normalizeColor(i.color);
                return ['black', 'white', 'grey'].includes(normC);
            });

            return pickRandom(neutrals) || pickRandom(candidates);
        };

        const bottom = getBestMatch(weatherFiltered.bottoms, top.color);
        const shoe = getBestMatch(weatherFiltered.shoes, bottom ? bottom.color : top.color);

        // Render
        const createCard = (item, role) => {
            if (!item) return `<div class="glass-panel" style="padding:10px;">No ${role} found</div>`;
            return `
                <div class="clothes-item" style="background: rgba(255,255,255,0.1)">
                    <img src="${item.image}">
                    <h3>${item.name}</h3>
                    <p>${role}</p>
                    <small style="color: var(--secondary)">${item.color}</small>
                </div>
            `;
        };

        grid.innerHTML += createCard(top, "Top");
        grid.innerHTML += createCard(bottom, "Bottom");
        grid.innerHTML += createCard(shoe, "Shoes");
    },

    // --- Travel Mode ---
    generateTravelPack: async () => {
        const dest = document.getElementById('travel-dest').value;
        const days = parseInt(document.getElementById('travel-days').value);

        if (!dest || !days || days < 1) {
            alert("Please enter valid destination and days.");
            return;
        }

        const resultDiv = document.getElementById('travel-result');
        const listDiv = document.getElementById('packing-list');

        resultDiv.classList.remove('hidden');
        listDiv.innerHTML = '<p>Analysing forecast for ' + dest + '...</p>';

        try {
            // 1. Geocode Destination
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(dest)}&count=1&language=en&format=json`);
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                listDiv.innerHTML = '<p style="color:var(--accent)">City not found.</p>';
                return;
            }

            const { latitude, longitude } = geoData.results[0];

            // 2. Fetch Forecast (Daily Max/Min Temps)
            const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=auto&forecast_days=${Math.min(days, 14)}`);
            const forecastData = await forecastRes.json();

            // 3. Generate Plan
            let html = `<h3>Trip to ${dest} (${days} days)</h3>`;
            html += `<div class="dashboard-grid">`;

            const dailyOutfits = [];

            // Helper to reuse items
            // We want to reuse bottoms and shoes, but change tops often
            // For this simple logic, we will pick a new top every day, 
            // but try to stick to the same bottom for 2-3 days if weather permits.

            let currentBottom = null;
            let currentShoe = null;
            let currentBottomWearCount = 0;

            for (let i = 0; i < days; i++) {
                // If trip is longer than forecast (usually 7-14 days), reuse last day data
                const dayDataIndex = Math.min(i, forecastData.daily.time.length - 1);
                const maxTemp = forecastData.daily.temperature_2m_max[dayDataIndex];
                const weatherCode = forecastData.daily.weathercode[dayDataIndex];

                // Determine Constraints
                let constraints = { tempCategory: 'mild', isRainy: false };
                if (maxTemp < 50) constraints.tempCategory = 'cold';
                else if (maxTemp < 70) constraints.tempCategory = 'cool';
                else if (maxTemp < 85) constraints.tempCategory = 'mild';
                else constraints.tempCategory = 'hot';

                if (weatherCode > 50) constraints.isRainy = true; // Simple rain check

                // Smart Pick
                const wardrobe = app.state.wardrobe;
                const weatherFilteredTops = wardrobe.filter(item => (item.category === 'tops' || item.category === 'outerwear'));
                // Filter bottoms/shoes by simple logic (e.g. valid for all unless extreme? simplified for now)
                const weatherFilteredBottoms = wardrobe.filter(item => item.category === 'jeans');
                const weatherFilteredShoes = wardrobe.filter(item => item.category === 'shoes');

                // Pick Top
                const top = app.pickRandom(weatherFilteredTops);

                // Pick Bottom (Reuse logic)
                if (!currentBottom || currentBottomWearCount >= 2) {
                    currentBottom = app.getBestMatch(weatherFilteredBottoms, top ? top.color : null);
                    currentBottomWearCount = 0;
                }
                currentBottomWearCount++;

                // Pick Shoe (Reuse logic - stick with one pair for 3 days or until color clash)
                if (!currentShoe || (i % 3 === 0)) {
                    currentShoe = app.getBestMatch(weatherFilteredShoes, currentBottom ? currentBottom.color : (top ? top.color : null));
                }

                // Fallbacks
                const topName = top ? top.name : "Generic Top";
                const bottomName = currentBottom ? currentBottom.name : "Jeans";
                const shoeName = currentShoe ? currentShoe.name : "Sneakers";

                html += `
                <div class="glass-panel" style="padding: 15px; margin-bottom: 0;">
                    <strong style="color:var(--secondary)">Day ${i + 1}</strong> 
                    <span style="float:right; opacity:0.7">${Math.round(maxTemp)}°F</span>
                    <hr style="border:0; border-top:1px solid rgba(255,255,255,0.1); margin: 10px 0;">
                    <div style="font-size: 0.9em; line-height: 1.6;">
                        👕 ${topName} <br>
                        👖 ${bottomName} <br>
                        👟 ${shoeName}
                    </div>
                </div>`;
            }

            html += `</div>`;
            listDiv.innerHTML = html;

        } catch (e) {
            console.error(e);
            listDiv.innerHTML = `<p style="color:red">Failed to generate plan. Try again.</p>`;
        }
    },

    // Utilities
    pickRandom: (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : null,

    getBestMatch: (candidates, anchorColor) => {
        // Reuse the logic from generateSmartOutfit
        // To avoid code duplication, we really should have defined this once, 
        // but for now we will inline the robust version here too or create a shared helper.

        if (!candidates || candidates.length === 0) return null;
        if (!anchorColor) return candidates[Math.floor(Math.random() * candidates.length)];

        const harmony = {
            'black': ['white', 'grey', 'blue', 'red', 'yellow', 'green', 'black'],
            'white': ['black', 'blue', 'denim', 'grey', 'pink', 'purple'],
            'blue': ['white', 'grey', 'black', 'beige', 'yellow'],
            'navy': ['white', 'beige', 'grey'],
            'red': ['black', 'white', 'denim', 'blue'],
            'green': ['white', 'black', 'beige', 'denim'],
            'yellow': ['blue', 'black', 'white', 'denim'],
            'pink': ['white', 'denim', 'grey', 'black'],
            'grey': ['black', 'white', 'blue', 'pink', 'red'],
            'purple': ['white', 'black', 'grey']
        };

        const normalizeColor = (c) => {
            c = c.toLowerCase();
            if (c.includes('blue') || c.includes('navy') || c.includes('teal') || c.includes('cyan')) return 'blue';
            if (c.includes('red') || c.includes('maroon') || c.includes('burgundy') || c.includes('rose')) return 'red';
            if (c.includes('green') || c.includes('olive') || c.includes('lime') || c.includes('mint')) return 'green';
            if (c.includes('yellow') || c.includes('gold')) return 'yellow';
            if (c.includes('purple') || c.includes('violet') || c.includes('lavender')) return 'purple';
            if (c.includes('pink') || c.includes('magenta')) return 'pink';
            if (c.includes('white') || c.includes('cream') || c.includes('beige')) return 'white';
            if (c.includes('black') || c.includes('dark')) return 'black';
            if (c.includes('grey') || c.includes('gray') || c.includes('silver')) return 'grey';
            return 'black';
        };

        const normalizedAnchor = normalizeColor(anchorColor);
        const compatible = harmony[normalizedAnchor] || ['black', 'white', 'denim'];

        const smartMatches = candidates.filter(i => {
            const normC = normalizeColor(i.color);
            return compatible.includes(normC);
        });

        if (smartMatches.length > 0) return smartMatches[Math.floor(Math.random() * smartMatches.length)];
        return candidates[Math.floor(Math.random() * candidates.length)];
    },
};

// Start
app.init();
