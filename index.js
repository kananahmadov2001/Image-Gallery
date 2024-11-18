const images = document.querySelectorAll('.gallery img');
const overlay = document.querySelector('.overlay');
const overlayImage = overlay.querySelector('img');
const header = document.querySelector('header');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');

let currentImage = null;
let currentSectionImages = [];
let playInterval = null;
let draggedImage = null;

function showImage(image) {
  currentImage = image;

  if (image) {
    const section = image.closest('.gallery-section');
    currentSectionImages = Array.from(section.querySelectorAll('.gallery img'));

    overlay.classList.add('active');
    overlayImage.src = currentImage.src;
    header.style.display = 'none';
  } else {
    overlay.classList.remove('active');
    header.style.display = 'block';
  }
}

function close() {
  showImage(null);
  pause();
}

function next() {
  const currentIndex = currentSectionImages.indexOf(currentImage);
  const nextIndex = (currentIndex + 1) % currentSectionImages.length;
  showImage(currentSectionImages[nextIndex]);
}

function previous() {
  const currentIndex = currentSectionImages.indexOf(currentImage);
  const prevIndex = (currentIndex - 1 + currentSectionImages.length) % currentSectionImages.length;
  showImage(currentSectionImages[prevIndex]);
}

function play() {
  overlay.classList.add('playing');
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
  playInterval = setInterval(next, 250);
}

function pause() {
  overlay.classList.remove('playing');
  playButton.style.display = 'block';
  pauseButton.style.display = 'none';
  clearInterval(playInterval);
  playInterval = null;
}

images.forEach(image => {
  image.addEventListener('click', () => showImage(image));
});

document.getElementById('close').addEventListener('click', close);
document.getElementById('next').addEventListener('click', next);
document.getElementById('previous').addEventListener('click', previous);
playButton.addEventListener('click', play);
pauseButton.addEventListener('click', pause);

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") close();
  if (event.key === "ArrowRight") next();
  if (event.key === "ArrowLeft") previous();
});

const gallerySections = document.querySelectorAll('.gallery');

gallerySections.forEach(gallery => {
  const galleryImages = gallery.querySelectorAll('img');

  galleryImages.forEach(image => {
    image.setAttribute('draggable', 'true');

    image.addEventListener('dragstart', (e) => {
      draggedImage = e.target;
      e.dataTransfer.effectAllowed = "move";
      e.target.classList.add('dragging');
    });

    image.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    image.addEventListener('drop', (e) => {
      e.preventDefault();

      const draggedSection = draggedImage.closest('.gallery-section');
      const targetSection = e.target.closest('.gallery-section');

      if (draggedSection === targetSection) {
        if (draggedImage && draggedImage !== e.target) {
          const draggedSrc = draggedImage.src;
          draggedImage.src = e.target.src;
          e.target.src = draggedSrc;
        }
      } else {
        alert("You cannot drag images between different sections.");
      }

      image.classList.remove('drag-over');
      draggedImage.classList.remove('dragging');
      draggedImage = null;
    });

    image.addEventListener('dragend', () => {
      image.classList.remove('dragging');
      draggedImage = null;
    });

    image.addEventListener('dragenter', () => {
      image.classList.add('drag-over');
    });

    image.addEventListener('dragleave', () => {
      image.classList.remove('drag-over');
    });
  });
});
