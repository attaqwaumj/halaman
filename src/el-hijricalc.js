// Define global variables and constants
const defaultCoordinates = { lat: -6.300166, lon: 106.766472 };
let selectedDate = null; // Used to track if a specific date is selected for static prayer times

// Hijri months mapping
const hijriMonths = {
    "01": "Muharram",
    "02": "Safar",
    "03": "Rabiul Awal",
    "04": "Rabiul Akhir",
    "05": "Jumadil Awal",
    "06": "Jumadil Akhir",
    "07": "Rajab",
    "08": "Sya'ban",
    "09": "Ramadan",
    "10": "Syawwal",
    "11": "Dzulqaidah",
    "12": "Dzulhijjah"
};

// Function to format Hijri dates for display
function formatHijriDate(hijriDate) {
    const [year, month, day] = hijriDate.split('-');
    return `${parseInt(day)} ${hijriMonths[month]} ${year}`;
}

// Function to update the Hijri date based on the selected or current Gregorian date
function updateHijriDate(gregorianDate) {
    const hijriEntry = hijriData.find(entry => entry.gregorian_date === gregorianDate);
    if (hijriEntry) {
        const formattedHijriDate = formatHijriDate(hijriEntry.hijri_date);
        $('#atq-hijri-date').text(formattedHijriDate);
    } else {
        $('#atq-hijri-date').text("Hijri date not found");
    }
}

// Function to update prayer times based on the given date and coordinates
function updatePrayerTimes(date, coordinates, updateHijri = true) {
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    $.getJSON(`https://api.aladhan.com/v1/timings/${formattedDate}?latitude=${coordinates.lat}&longitude=${coordinates.lon}&method=4`, function(data) {
        $('#atq-prayer-time-fajr').text(data.data.timings.Fajr);
        $('#atq-prayer-time-sunrise').text(data.data.timings.Sunrise);
        $('#atq-prayer-time-dhuhr').text(data.data.timings.Dhuhr);
        $('#atq-prayer-time-asr').text(data.data.timings.Asr);
        $('#atq-prayer-time-maghrib').text(data.data.timings.Maghrib);
        $('#atq-prayer-time-isha').text(data.data.timings.Isha);

        if (updateHijri) {
            const currentGregorianDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            updateHijriDate(currentGregorianDate);
        }
    });
}

// Function to update the real-time clock and Gregorian date
function updateDateTime() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    // Only update the Gregorian date if no specific date is selected
    if (!selectedDate) {
        const currentDate = now.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        $('#atq-gregorian-date').text(currentDate);
    }

    $('#atq-current-time').text(currentTime);

    if (!selectedDate) {
        updatePrayerTimes(now, defaultCoordinates);
    }
}

// Function to get user's current location and update prayer times based on it
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userCoordinates = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                selectedDate = null; // Reset to live update
                updatePrayerTimes(new Date(), userCoordinates);
            },
            function() {
                selectedDate = null; // Reset to live update
                updatePrayerTimes(new Date(), defaultCoordinates); // Fallback to default location
            }
        );
    } else {
        selectedDate = null; // Reset to live update
        updatePrayerTimes(new Date(), defaultCoordinates); // Fallback to default location
    }
}

// Initialize the datepicker and update prayer times based on selected date
$(document).ready(function() {
    const now = new Date();

    $('#atq-datepicker').datepicker({
        dateFormat: "dd-mm-yy",
        defaultDate: now,
        setDate: now,
        onSelect: function(dateText) {
            selectedDate = $('#atq-datepicker').datepicker('getDate');
            const isoFormattedDate = $.datepicker.formatDate("yy-mm-dd", selectedDate);

            // Ensure Hijri date is updated only after prayer times are confirmed
            updatePrayerTimes(selectedDate, defaultCoordinates, false); // Update without hijri update

            // Update the Hijri date once the prayer times have been set
            updateHijriDate(isoFormattedDate);
        }
    }).datepicker("setDate", now); // Set the datepicker to the current date initially

    // Start the clock with live updates every second
    setInterval(updateDateTime, 1000);

    // Initial load of prayer times with default location
    updatePrayerTimes(now, defaultCoordinates);
});
