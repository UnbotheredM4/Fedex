document.getElementById('trackingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const trackingNumber = document.getElementById('trackingNumber').value;
    document.getElementById('result').innerHTML = `Tracking result for: ${trackingNumber} <br> Status: In Transit`;
});
