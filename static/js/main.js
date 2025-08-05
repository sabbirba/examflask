// main.js - Main application functionality and event handlers

// Ensure PDF Screenshot Helper is initialized
if (!window.PDF_SCREENSHOT_HELPER_LOADED) {
  console.warn("PDF Screenshot Helper not detected, initializing fallback...");
  window.PDF_SCREENSHOT_HELPER_LOADED = true;
  window.pdfScreenshotHelper = {
    cropPdfScreenshot: function (canvas) {
      console.log("Using fallback cropPdfScreenshot function");
      const cropPercentSides = 0.09; // 9% crop on left and right sides
      const cropPercentTopBottom = 0.02; // 2% crop on top and bottom
      const cropX = Math.floor(canvas.width * cropPercentSides);
      const cropY = Math.floor(canvas.height * cropPercentTopBottom);
      const croppedWidth = canvas.width - cropX * 2;
      const croppedHeight = canvas.height - cropY * 2;

      // Create a new canvas for the cropped image
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const ctx = croppedCanvas.getContext("2d");

      // Draw the cropped image on the new canvas
      ctx.drawImage(
        canvas,
        cropX,
        cropY,
        croppedWidth,
        croppedHeight, // Source rectangle
        0,
        0,
        croppedWidth,
        croppedHeight // Destination rectangle
      );

      return croppedCanvas;
    },
    cropImageFromUrl: function (imageUrl, callback) {
      console.log("Using fallback cropImageFromUrl function");
      const tempImg = new Image();
      tempImg.onload = function () {
        const cropPercentSides = 0.09;
        const cropPercentTopBottom = 0.02;
        const cropX = Math.floor(tempImg.width * cropPercentSides);
        const cropY = Math.floor(tempImg.height * cropPercentTopBottom);
        const croppedWidth = tempImg.width - cropX * 2;
        const croppedHeight = tempImg.height - cropY * 2;

        // Create canvas for cropping
        const canvas = document.createElement("canvas");
        canvas.width = croppedWidth;
        canvas.height = croppedHeight;
        const ctx = canvas.getContext("2d");

        // Draw the cropped image on canvas
        ctx.drawImage(
          tempImg,
          cropX,
          cropY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );

        callback(canvas.toDataURL("image/png"));
      };
      tempImg.onerror = function () {
        callback(imageUrl);
      };
      tempImg.src = imageUrl;
    },
  };
}

/**
 * Add a course to the schedule based on input values
 * @param {number} index - The index of the input row
 */
function addCourseFromInput(index) {
  const courseInput = document.querySelectorAll(".course-code")[index];
  const sectionInput = document.querySelectorAll(".section")[index];
  const courseCode = courseInput.value.trim().toUpperCase();
  const section = sectionInput.value.trim();

  if (courseCode && section) {
    // Find matching exams in the data
    const matchingExams = data.findExams(courseCode, section);

    if (matchingExams.length > 0) {
      // Add matching exams to the schedule
      ui.addExamsToSchedule(matchingExams);
      ui.showToast(
        `Added ${courseCode} Section ${section} to exam schedule`,
        "success"
      );
    } else {
      ui.showToast(
        `No exam found for ${courseCode} Section ${section}`,
        "error"
      );
    }
  } else {
    ui.showToast("Please enter both course code and section", "error");
  }
}

/**
 * Adds more course input rows
 */
function addMoreInputs() {
  // Get the container and count existing rows
  const courseInputsContainer = document.getElementById("course-inputs");
  const currentRowCount =
    courseInputsContainer.querySelectorAll(".input-row").length;

  // Check if we've reached the maximum allowed rows (7)
  if (currentRowCount >= 7) {
    ui.showToast("Maximum of 7 course inputs allowed", "info");
    return;
  }

  // Create new row
  const newRow = document.createElement("div");
  newRow.className = "input-row";

  // Row index for this new row
  const rowIndex = currentRowCount;

  // Create HTML for the new row with all elements
  newRow.innerHTML = `
        <input type="text" placeholder="Course Code" class="course-code bg-white text-gray-800 p-3 rounded-lg mb-2 w-full text-center" autocomplete="on">
        <input type="text" placeholder="Sec" class="section bg-white text-gray-800 p-3 rounded-lg mb-2 w-full text-center" autocomplete="on">
        <button class="add-course bg-yellow-300 text-gray-800 p-3 rounded-lg mb-2 w-full flex items-center justify-center transition">
            <i class="fas fa-plus mr-2"></i>Add
        </button>
    `;

  // Append the new row to the container
  courseInputsContainer.appendChild(newRow);

  // Get the new inputs and button
  const newCourseInput = newRow.querySelector(".course-code");
  const newSectionInput = newRow.querySelector(".section");
  const newAddButton = newRow.querySelector(".add-course");

  // Set up event listeners for the new course input
  newCourseInput.addEventListener("focus", () =>
    dropdown.showCourseDropdown(newCourseInput, rowIndex)
  );
  newCourseInput.addEventListener("input", () => {
    dropdown.showCourseDropdown(newCourseInput, rowIndex);
  });

  // Set up event listeners for the new section input
  newSectionInput.addEventListener("focus", () =>
    dropdown.showSectionDropdown(newSectionInput, rowIndex)
  );
  newSectionInput.addEventListener("input", () => {
    dropdown.showSectionDropdown(newSectionInput, rowIndex);
  });

  // Add event listener for the new add button
  newAddButton.addEventListener("click", () => {
    addCourseFromInput(rowIndex);
  });

  // Add event listeners for keyboard navigation
  newCourseInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      newSectionInput.focus();
    }
  });

  newSectionInput.addEventListener("keydown", (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      newAddButton.focus();
    }
  });

  // Prevent arrow key input for course and section fields
  [newCourseInput, newSectionInput].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Add more button
  document
    .getElementById("add-more-btn")
    .addEventListener("click", function () {
      addMoreInputs();
    });

  // Screenshot button
  document
    .getElementById("screenshot-btn")
    .addEventListener("click", function () {
      ui.takeScreenshot();
    }); // Cross-check button
  document
    .getElementById("cross-check-btn")
    .addEventListener("click", function () {
      handleCrossCheck();
    });

  // Modal close button
  document
    .getElementById("close-modal-btn")
    .addEventListener("click", function () {
      document.getElementById("cross-check-modal").classList.add("hidden");
    });

  // Close modal on click outside the content
  document
    .getElementById("cross-check-modal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        document.getElementById("cross-check-modal").classList.add("hidden");
      }
    });

  // Add course buttons
  document.querySelectorAll(".add-course").forEach((btn, index) => {
    btn.addEventListener("click", function () {
      const courseInput = document.querySelectorAll(".course-code")[index];
      const sectionInput = document.querySelectorAll(".section")[index];
      const course = courseInput.value.trim();
      const section = sectionInput.value.trim();

      if (course && section) {
        // Find matching exams in the data
        const matchingExams = data.findExams(course, section);

        if (matchingExams.length > 0) {
          // Add matching exams to the schedule
          ui.addExamsToSchedule(matchingExams);
          ui.showToast(
            `Added ${course} Section ${section} to exam schedule`,
            "success"
          );
        } else {
          ui.showToast(
            `No exam found for ${course} Section ${section}`,
            "error"
          );
        }
      } else {
        ui.showToast("Please enter both course code and section", "error");
      }

      // Clear inputs after adding
      if (
        window.dropdown &&
        typeof window.dropdown.clearInputs === "function"
      ) {
        window.dropdown.clearInputs(index);
      } else {
        // fallback if dropdown.js not loaded
        courseInput.value = "";
        sectionInput.value = "";
      }
    });
  });

  // Prevent arrow key input for initial course and section fields
  document.querySelectorAll(".course-code, .section").forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
    });
  });

  // Click outside handler for dropdowns
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".course-code") && !e.target.closest(".section")) {
      dropdown.hideAllDropdowns();
    }
  });

  // Handle scroll for dropdowns
  window.addEventListener(
    "scroll",
    utils.debounce(() => {
      const activeDropdown = document.querySelector(".dropdown");
      if (activeDropdown) {
        const input = document.activeElement;
        if (
          input &&
          (input.classList.contains("course-code") ||
            input.classList.contains("section"))
        ) {
          dropdown.positionDropdown(activeDropdown, input);
        }
      }
    }, 100),
    { passive: true }
  );
}

/**
 * Handle the cross-check functionality
 */
function handleCrossCheck() {
  // Get all current exams from the table
  const scheduleBody = document.getElementById("schedule-body");
  const rows = Array.from(scheduleBody.querySelectorAll("tr"));

  if (rows.length === 0) {
    ui.showToast("No exams to cross-check. Please add courses first.", "error");
    return;
  }

  // Show loading toast
  ui.showToast("Preparing PDF viewer...", "info");

  // Extract exam information from the displayed table
  const tableExams = rows.map((row) => {
    const courseCode = row.cells[2].textContent;
    const section = row.cells[3].textContent;

    // Find the exam in the full examData to get its page number
    const matchingExams = data.findExams(courseCode, section);
    const pageNumber =
      matchingExams.length > 0 ? matchingExams[0].pageNumber : -1;
    const boundingBox =
      matchingExams.length > 0 ? matchingExams[0].boundingBox : null;

    return {
      date: row.cells[0].textContent,
      time: row.cells[1].textContent,
      courseCode: courseCode,
      section: section,
      classroom: row.cells[4].textContent,
      pageNumber: pageNumber,
      boundingBox: boundingBox,
    };
  });
  // Use the PDF viewer instead of trying to use pdfHelper
  console.log("Opening cross-check modal with the PDF viewer");
  // First try to use pdfHelper's enhanced function, then fall back to pdfViewer if needed
  console.log("Opening cross-check modal with exams:", tableExams);

  if (
    window.pdfHelper &&
    typeof window.pdfHelper.enhancedCrossCheck === "function"
  ) {
    console.log("Using pdfHelper.enhancedCrossCheck");
    window.pdfHelper.enhancedCrossCheck(tableExams);
  } else if (
    window.pdfViewer &&
    typeof window.pdfViewer.openCrossCheckModal === "function"
  ) {
    console.log("Using pdfViewer.openCrossCheckModal");
    window.pdfViewer.openCrossCheckModal(tableExams);
  } else {
    // Fallback if neither function is available
    ui.showToast(
      "PDF viewer is not available. Please check your browser console for errors.",
      "error"
    );
    console.error(
      "PDF viewer is not available. Make sure pdf-helper.js and pdf-viewer.js are loaded correctly."
    );
  }
}

// Save schedule to localStorage
function saveScheduleToLocalStorage() {
  const rows = Array.from(document.querySelectorAll("#schedule-body tr")).map(
    (tr) => Array.from(tr.children).map((td) => td.textContent)
  );
  localStorage.setItem("examSchedule", JSON.stringify(rows));
}

// Load schedule from localStorage
function loadScheduleFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("examSchedule") || "[]");
  const tbody = document.getElementById("schedule-body");
  tbody.innerHTML = "";
  data.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cellText) => {
      const td = document.createElement("td");
      td.textContent = cellText;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Load routine from localStorage on page load
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.ui &&
    typeof window.ui.loadRoutineFromLocalStorage === "function"
  ) {
    window.ui.loadRoutineFromLocalStorage();
  }
  data.loadScheduleData();
});

// Save routine after adding/removing a row
function onScheduleTableChanged() {
  if (window.ui && typeof window.ui.saveRoutineToLocalStorage === "function") {
    window.ui.saveRoutineToLocalStorage();
  }
}

// Example: After adding a row
// onScheduleTableChanged();

// Example: After removing a row
// onScheduleTableChanged();

// When resetting the table
document.getElementById("reset-btn").addEventListener("click", function () {
  document.getElementById("schedule-body").innerHTML = "";
  if (window.ui && typeof window.ui.clearRoutineLocalStorage === "function") {
    window.ui.clearRoutineLocalStorage();
  }
});

/**
 * Initialize the application
 */
function initialize() {
  // Set up toast notification container
  const toastContainer = document.getElementById("toast-container");

  // Load schedule data
  data
    .loadScheduleData()
    .then(() => {
      // Initialize suggestions after data is loaded
      dropdown.initializeCourseSuggestions();

      // Pre-load PDF.js in the background for better user experience
      if (!window.pdfjsLib) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
          console.log("PDF.js preloaded successfully");
        };
        document.head.appendChild(script);
      }
    })
    .finally(() => {
      // Add event listeners regardless of PDF.js initialization status
      setupEventListeners();
    });
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", initialize);

// Export functions
window.app = {
  initialize,
  addCourseFromInput,
  addMoreInputs,
  setupEventListeners,
  handleCrossCheck,
};
