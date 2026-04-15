const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const totalHoursInput = document.getElementById("totalHours");
const baseRateInput = document.getElementById("baseRate");
const extraHoursInput = document.getElementById("extraHours");
const extraChargeInput = document.getElementById("extraCharge");
const grandTotalInput = document.getElementById("grandTotal");
const depositInput = document.getElementById("deposit");

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

    // Only calculate if both inputs have values
    if (start !== null && end !== null) {
        let diff = end - start;

        // Handle overnight events (e.g., 10 PM to 2 AM)
        if (diff < 0) diff += 24;

        // Prevent 0 hour calculations
        if (diff === 0) {
            totalHoursInput.value = "";
            updatePricing();
            return;
        }

        // Round to nearest 30 minutes (0.5)
        diff = Math.round(diff * 2) / 2;
        totalHoursInput.value = diff;

        // Automatically trigger pricing calculation
        updatePricing();
    }
}

function updatePricing() {
    const hours = parseFloat(totalHoursInput.value);

    if (isNaN(hours) || hours <= 0) {
        baseRateInput.value = "";
        extraHoursInput.value = "";
        extraChargeInput.value = "";
        grandTotalInput.value = "";
        depositInput.value = "";
        return;
    }

    const baseRate = BASE_RATE;
    // Calculate hours exceeding the 5-hour base
    const extraHours = Math.max(0, hours - 5);
    const extraCharge = extraHours * EXTRA_RATE;
    const grandTotal = baseRate + extraCharge;
    const deposit = grandTotal * 0.5;

    // Format and display values automatically
    baseRateInput.value = `$${baseRate.toFixed(2)}`;
    extraHoursInput.value = extraHours.toFixed(1);
    extraChargeInput.value = `$${extraCharge.toFixed(2)}`;
    grandTotalInput.value = `$${grandTotal.toFixed(2)}`;
    depositInput.value = `$${deposit.toFixed(2)}`;
}

// Event Listeners - Use 'input' for real-time automatic updates
if (startTimeInput && endTimeInput && totalHoursInput) {
    startTimeInput.addEventListener("input", updateHoursFromTimes);
    endTimeInput.addEventListener("input", updateHoursFromTimes);
    totalHoursInput.addEventListener("input", updatePricing);
}

// Initial calculation run on page load
updatePricing();