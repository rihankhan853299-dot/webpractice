/*crausel code */
let index = 0;
const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");
const total = slide.length;
const dotsContainer = document.querySelector(".dots");

// Create dots
for (let i = 0; i < total; i++) {
  let dot = document.createElement("span");
  dot.addEventListener("click", () => {
    index = i;
    update();
  });
  dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll(".dots span");

function update() {
  slides.style.transform = `translateX(-${index * 100}%)`;

  slide.forEach(s => s.classList.remove("active"));
  slide[index].classList.add("active");

  dots.forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");
}

// Buttons
document.querySelector(".next").onclick = () => {
  index = (index + 1) % total;
  update();
};

document.querySelector(".prev").onclick = () => {
  index = (index - 1 + total) % total;
  update();
};

// Auto Slide
setInterval(() => {
  index = (index + 1) % total;
  update();
}, 3000);

// Swipe (Mobile)
let startX = 0;

slides.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

slides.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  if (startX > endX + 50) {
    index = (index + 1) % total;
  } else if (startX < endX - 50) {
    index = (index - 1 + total) % total;
  }
  update();
});

// Init
update();