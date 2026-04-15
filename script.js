const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const totalHoursInput = document.getElementById("totalHours");
const baseRateInput = document.getElementById("baseRate");
const extraHoursInput = document.getElementById("extraHours");
const extraChargeInput = document.getElementById("extraCharge");
const grandTotalInput = document.getElementById("grandTotal");
const depositInput = document.getElementById("deposit");
const guestCountInput = document.getElementById("guestCount");

// UPDATED RATES
const BASE_RATE = 200;
const EXTRA_RATE = 30;

function parseTimeToHours(value) {
    if (!value) return null;
    const [h, m] = value.split(":").map(Number);
    return h + (m || 0) / 60;
}

function updateHoursFromTimes() {
    const start = parseTimeToHours(startTimeInput.value);
    const end = parseTimeToHours(endTimeInput.value);

    if (start !== null && end !== null) {
        let diff = end - start;
        if (diff < 0) diff += 24;

        if (diff === 0) {
            totalHoursInput.value = "";
            updatePricing();
            return;
        }

        diff = Math.round(diff * 2) / 2;
        totalHoursInput.value = diff;

        updatePricing();
        refreshShoppingGuide();
    }
}

function updatePricing() {
    const hours = parseFloat(totalHoursInput.value);

    // LOGIC: Only display if hours are 1 or greater
    if (isNaN(hours) || hours < 1) {
        baseRateInput.value = "";
        extraHoursInput.value = "";
        extraChargeInput.value = "";
        grandTotalInput.value = "";
        depositInput.value = "";
        return;
    }

    const baseRate = BASE_RATE;
    // Calculate extra hours only if they exceed the 5-hour base inclusion
    const extraHours = Math.max(0, hours - 5);
    const extraCharge = extraHours * EXTRA_RATE;
    const grandTotal = baseRate + extraCharge;
    const deposit = grandTotal * 0.5;

    baseRateInput.value = `$${baseRate.toFixed(2)}`;
    extraHoursInput.value = extraHours.toFixed(1);
    extraChargeInput.value = `$${extraCharge.toFixed(2)}`;
    grandTotalInput.value = `$${grandTotal.toFixed(2)}`;
    depositInput.value = `$${deposit.toFixed(2)}`;
}

function toggleShoppingGuide(show) {
    const section = document.getElementById('shoppingGuideSection');
    section.style.display = show ? 'block' : 'none';
    if (show) calculateShoppingList();
}

function refreshShoppingGuide() {
    const section = document.getElementById('shoppingGuideSection');
    if (section && section.style.display === 'block') {
        calculateShoppingList();
    }
}

function calculateShoppingList() {
    const guests = parseFloat(guestCountInput.value) || 0;
    const hours = parseFloat(totalHoursInput.value) || 0;

    if (guests > 0 && hours > 0) {
        // Industry Standard: 1.5 drinks per person per hour 
        const totalDrinks = guests * hours * 1.5;

        const beerDrinks = totalDrinks * 0.50;
        const wineDrinks = totalDrinks * 0.25;
        const spiritDrinks = totalDrinks * 0.25;

        const casesBeer = Math.ceil(beerDrinks / 24);
        const bottlesWine = Math.ceil(wineDrinks / 5);
        const bottlesSpirits = Math.ceil(spiritDrinks / 16);
        const lbsIce = Math.ceil(guests * 1.5);

        document.getElementById('calcTotalDrinks').value = Math.ceil(totalDrinks);
        document.getElementById('calcIce').value = lbsIce + " lbs";
        document.getElementById('calcSpirits').value = bottlesSpirits + " Bottles";
        document.getElementById('calcWine').value = bottlesWine + " Bottles";
        document.getElementById('calcBeer').value = casesBeer + " Cases";
    }
}

// Listeners for real-time automatic generation
startTimeInput.addEventListener("input", updateHoursFromTimes);
endTimeInput.addEventListener("input", updateHoursFromTimes);
totalHoursInput.addEventListener("input", updatePricing);
guestCountInput.addEventListener("input", refreshShoppingGuide);