document.addEventListener("DOMContentLoaded", () => {
  // Ajout de la fonction de compte à rebours
  function updateCountdown() {
    const christmas = new Date(new Date().getFullYear(), 11, 25);
    const now = new Date();
    const diff = christmas - now;

    // Si Noël est passé, utiliser la date de Noël prochain
    if (diff < 0) {
      christmas.setFullYear(christmas.getFullYear() + 1);
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }

  // Mettre à jour le compte à rebours chaque seconde
  setInterval(updateCountdown, 1000);
  updateCountdown(); // Première mise à jour immédiate

  // Create snow effect
  createSnow();

  // Adjust box sizes based on media format
  const calendar = document.querySelector(".calendar");
  const boxes = Array.from(calendar.children);
  boxes.forEach((box) => {
    const media = box.querySelector(".media");
    if (
      media.tagName === "VIDEO" &&
      media.videoWidth / media.videoHeight === 4
    ) {
      box.classList.add("box-12-3");
    }
  });

  // Load opened boxes from localStorage
  const openedBoxes = JSON.parse(localStorage.getItem("openedBoxes")) || [];

  // Mark boxes as opened if they are in localStorage
  openedBoxes.forEach((day) => {
    const box = document.querySelector(`.box[data-day="${day}"]`);
    if (box) {
      box.classList.add("opened");
    }
  });

  // Add click handlers to boxes
  document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("click", () => {
      const today = new Date().getDate();
      const boxDay = parseInt(box.dataset.day);

      if (boxDay <= today) {
        box.classList.toggle("opened");
        if (box.classList.contains("opened")) {
          const media = box.querySelector(".media").cloneNode(true);
          openFullscreen(media);

          // Save opened box to localStorage
          if (!openedBoxes.includes(boxDay)) {
            openedBoxes.push(boxDay);
            localStorage.setItem("openedBoxes", JSON.stringify(openedBoxes));
          }
        } else {
          // Remove box from localStorage if it is closed
          const index = openedBoxes.indexOf(boxDay);
          if (index > -1) {
            openedBoxes.splice(index, 1);
            localStorage.setItem("openedBoxes", JSON.stringify(openedBoxes));
          }
        }
      } else {
        alert("Patience ! Ce n'est pas encore le moment d'ouvrir cette case !");
      }
    });

    // Add play, stop, and fullscreen buttons to video boxes
    const media = box.querySelector(".media");
    if (media && media.tagName === "VIDEO") {
      const playButton = document.createElement("button");
      playButton.className = "play-btn";
      playButton.textContent = "Play";
      playButton.addEventListener("click", (event) => {
        event.stopPropagation();
        media.play();
      });
      box.querySelector(".box-back").appendChild(playButton);

      const stopButton = document.createElement("button");
      stopButton.className = "stop-btn";
      stopButton.textContent = "Stop";
      stopButton.addEventListener("click", (event) => {
        event.stopPropagation();
        media.pause();
        media.currentTime = 0;
      });
      box.querySelector(".box-back").appendChild(stopButton);

      const fullscreenButton = document.createElement("button");
      fullscreenButton.className = "fullscreen-btn";
      fullscreenButton.textContent = "Fullscreen";
      fullscreenButton.addEventListener("click", (event) => {
        event.stopPropagation();
        media.pause(); // Stop the playback of the video in the box
        openFullscreen(media.cloneNode(true));
      });
      box.querySelector(".box-back").appendChild(fullscreenButton);
    }
  });
});

function createSnow() {
  const snowContainer = document.querySelector(".snow-container");
  for (let i = 0; i < 100; i++) {
    const snow = document.createElement("div");
    snow.className = "snow";
    snow.style.left = `${Math.random() * 100}vw`;
    snow.style.animationDuration = `${Math.random() * 3 + 2}s`;
    snow.style.opacity = Math.random();
    snow.style.width = `${Math.random() * 10 + 5}px`;
    snow.style.height = snow.style.width;
    snow.style.animation = `fall ${Math.random() * 3 + 2}s linear infinite`;
    snowContainer.appendChild(snow);
  }
}

function openFullscreen(media) {
  const fullscreenDiv = document.createElement("div");
  fullscreenDiv.className = "fullscreen";
  fullscreenDiv.appendChild(media);

  const closeButton = document.createElement("button");
  closeButton.className = "close-btn";
  closeButton.textContent = "Fermer";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(fullscreenDiv);
  });

  fullscreenDiv.appendChild(closeButton);
  document.body.appendChild(fullscreenDiv);

  // Close fullscreen when clicking outside the media
  fullscreenDiv.addEventListener("click", (event) => {
    if (event.target === fullscreenDiv) {
      document.body.removeChild(fullscreenDiv);
    }
  });
}

// Add snow animation to stylesheet
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .snow {
        position: fixed;
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
    }

    @keyframes fall {
        0% {
            transform: translateY(-100vh);
        }
        100% {
            transform: translateY(100vh);
        }
    }
`;
document.head.appendChild(styleSheet);
