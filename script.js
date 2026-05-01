// Get elements
const modal = document.getElementById("rulesModal");
const btn = document.getElementById("rulesBtn");
const closeBtn = document.querySelector(".close-btn");

// Function to open modal
btn.onclick = function() {
    modal.style.display = "flex";
}

// Function to close modal using (x)
closeBtn.onclick = function() {
    modal.style.display = "none";
}

// Function to close modal by clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
