// filepath: c:\Users\meher\Desktop\exam routine\exam-schedule\exam-schedule\js\ui.js
// ui.js - UI interaction functions

const TOASTS_ENABLED = false;

/**
 * Shows a toast notification
 * @param {string} message - The message to display
 * @param {string} type - Type of toast (success, error, info)
 */
function showToast(message, type = "info") {
  if (!TOASTS_ENABLED) return;
}

/**
 * Updates the title based on exam type or custom exam name
 * @param {boolean} isFinalsSchedule - Whether it's finals or midterms
 * @param {string} [examName] - Custom exam name from JSON
 */
function updateTitle(isFinalsSchedule, examName) {
  const titleEl = document.getElementById("schedule-title");
  if (titleEl) {
    titleEl.textContent = examName;
  }
}

/**
 * Adds exams to the schedule table
 * @param {Array} exams - Array of exam objects to add
 */
function addExamsToSchedule(exams) {
  if (!exams || exams.length === 0) return;

  const scheduleBody = document.getElementById("schedule-body");
  if (!scheduleBody) {
    console.error("Could not find schedule-body element!");
    return;
  }

  // Add each exam to the table
  exams.forEach((exam) => {
    // Check if this exam is already in the table to avoid duplicates
    const existingRows = Array.from(scheduleBody.querySelectorAll("tr")).filter(
      (row) => {
        return (
          row.cells[2].textContent === exam.courseCode &&
          row.cells[3].textContent === exam.section
        );
      }
    );

    if (existingRows.length === 0) {
      const row = document.createElement("tr");
      row.className = "border-b border-white transition";

      // Create row cells
      row.innerHTML = `
                <td class="px-3 py-3 align-middle">${exam.date}</td>
                <td class="px-3 py-3 align-middle">${exam.time}</td>
                <td class="px-3 py-3 align-middle">${exam.courseCode}</td>
                <td class="px-3 py-3 align-middle">${exam.section}</td>
                <td class="px-3 py-3 align-middle">${exam.classroom}</td>
            `;

      scheduleBody.appendChild(row);

      // Sort the table after adding new entry
      sortScheduleTable();
    }
  });
}

/**
 * Sorts the schedule table by date and time
 */
function sortScheduleTable() {
  const scheduleBody = document.getElementById("schedule-body");
  if (!scheduleBody) return;

  const rows = Array.from(scheduleBody.querySelectorAll("tr"));
  if (rows.length <= 1) return;

  // Sort rows
  rows.sort((a, b) => {
    const dateA = a.cells[0].textContent;
    const dateB = b.cells[0].textContent;
    const dateCompare =
      new Date(utils.convertDate(dateA)) - new Date(utils.convertDate(dateB));

    if (dateCompare !== 0) return dateCompare;

    // If same date, compare times
    const timeA = a.cells[1].textContent.split(" - ")[0];
    const timeB = b.cells[1].textContent.split(" - ")[0];
    return (
      utils.convertTimeToMinutes(timeA) - utils.convertTimeToMinutes(timeB)
    );
  });

  // Clear and reappend sorted rows
  while (scheduleBody.firstChild) {
    scheduleBody.removeChild(scheduleBody.firstChild);
  }

  // Reappend sorted rows
  rows.forEach((row) => scheduleBody.appendChild(row));
}

/**
 * Takes a screenshot of the schedule table WITHOUT cropping
 */
function takeScreenshot(options = {}) {
  // Default options for screenshot
  const defaultOptions = {
    cellPaddingTop: "5px",
    cellPaddingRight: "5px",
    cellPaddingBottom: "5px",
    cellPaddingLeft: "5px",
    headerPaddingTop: "5px",
    headerPaddingRight: "5px",
    headerPaddingBottom: "5px",
    headerPaddingLeft: "5px",
    scale: 15, // Increased to 15x for higher quality
  };

  // Merge default options with provided options
  const screenshotOptions = { ...defaultOptions, ...options };

  // Check if table has content
  if (document.getElementById("schedule-body").children.length === 0) {
    showToast("No exams to screenshot. Please add courses first.", "error");
    return;
  }

  // Show a notification that screenshot is being generated
  showToast("Capturing...", "info");

  // Create a temporary container that includes only what we want in the screenshot
  const tempContainer = document.createElement("div");
  tempContainer.className = "p-6 rounded-lg";
  // Set explicit width for full view screenshot
  const screenshotWidth = 1200; // or window.innerWidth for dynamic
  tempContainer.style.width = screenshotWidth + "px";
  tempContainer.style.maxWidth = screenshotWidth + "px";
  tempContainer.style.minWidth = screenshotWidth + "px";
  tempContainer.style.overflow = "visible";
  tempContainer.style.marginBottom = "20px";
  tempContainer.style.backgroundColor = "#18181b"; // Tailwind gray-900 (even darker)
  tempContainer.style.color = "#e5e7eb"; // Tailwind gray-200 for text

  // Add the title
  const title = document.createElement("h1");
  title.className = "text-2xl font-bold mb-6 text-center";
  title.style.color = "#e5e7eb"; // Tailwind gray-200
  title.textContent = document.querySelector("h1").textContent;
  tempContainer.appendChild(title);

  // Create a new table from scratch
  const newTable = document.createElement("table");
  newTable.className = "min-w-full border text-center";
  newTable.style.borderCollapse = "collapse";
  newTable.style.width = "100%";
  newTable.style.border = "1px solid #52525b"; // Tailwind gray-900
  newTable.style.fontSize = "16px";
  newTable.style.backgroundColor = "#18181b"; // Tailwind gray-900 for routine

  // Create table header
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headerRow.style.borderBottom = "1px solid #52525b"; // Tailwind gray-900

  const headers = ["Date", "Time", "Course", "Section", "Room"];

  headers.forEach((text) => {
    const th = document.createElement("th");
    th.className = "px-3 py-3 text-center";
    th.style.color = "#e5e7eb"; // Tailwind gray-200

    // Create a div inside the header cell for flexbox centering
    const contentDiv = document.createElement("div");
    contentDiv.style.display = "flex";
    contentDiv.style.justifyContent = "center";
    contentDiv.style.alignItems = "center";
    contentDiv.style.minHeight = "30px";
    contentDiv.style.fontWeight = "bold";
    contentDiv.style.color = "#e5e7eb"; // Tailwind gray-200
    contentDiv.textContent = text;

    th.appendChild(contentDiv);
    th.style.verticalAlign = "middle";
    th.style.textAlign = "center";

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  newTable.appendChild(thead);

  // Create table body with data from original table
  const tbody = document.createElement("tbody");
  const originalRows = document
    .getElementById("schedule-body")
    .querySelectorAll("tr");

  originalRows.forEach((originalRow) => {
    const newRow = document.createElement("tr");
    newRow.style.borderBottom = "1px solid #52525b";
    newRow.style.backgroundColor = "transparent";

    Array.from(originalRow.cells).forEach((originalCell) => {
      const cell = document.createElement("td");
      cell.className = "px-3 py-3";
      cell.style.color = "#e5e7eb";
      cell.style.backgroundColor = "transparent";

      // Create a div inside the cell for flexbox centering
      const contentDiv = document.createElement("div");
      contentDiv.style.display = "flex";
      contentDiv.style.justifyContent = "center";
      contentDiv.style.alignItems = "center";
      contentDiv.style.minHeight = "30px";
      contentDiv.style.paddingTop = screenshotOptions.cellPaddingTop;
      contentDiv.style.paddingRight = screenshotOptions.cellPaddingRight;
      contentDiv.style.paddingBottom = screenshotOptions.cellPaddingBottom;
      contentDiv.style.paddingLeft = screenshotOptions.cellPaddingLeft;
      contentDiv.style.color = "#e5e7eb";
      contentDiv.textContent = originalCell.textContent;

      cell.appendChild(contentDiv);
      cell.style.verticalAlign = "middle";
      cell.style.textAlign = "center";

      newRow.appendChild(cell);
    });

    tbody.appendChild(newRow);
  });

  newTable.appendChild(tbody);
  tempContainer.appendChild(newTable);

  // Temporarily add to document but hide it
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  document.body.appendChild(tempContainer);

  console.log("Capturing...");

  // Check if html2canvas is available
  if (typeof html2canvas !== "function") {
    console.error("html2canvas library not loaded");
    showToast(
      "Capture failed - missing library. Please refresh the page and try again.",
      "error"
    );
    document.body.removeChild(tempContainer);
    return;
  }

  // Add a small delay before capturing to ensure everything has rendered properly
  setTimeout(() => {
    // Explicitly set the height to include a bit of extra space
    const computedHeight = tempContainer.scrollHeight + 20; // Add extra pixels at bottom

    // Take the screenshot
    html2canvas(tempContainer, {
      backgroundColor: "#18181b",
      logging: true,
      scale: screenshotOptions.scale,
      useCORS: true,
      allowTaint: true,
      width: screenshotWidth,
      height: computedHeight,
      windowHeight: computedHeight + 50,
      onclone: function (clonedDoc) {
        // Make sure the clone has visible overflow
        const clonedContainer = clonedDoc.body.querySelector("div");
        if (clonedContainer) {
          clonedContainer.style.overflow = "visible";
          clonedContainer.style.paddingBottom = "20px";
        }
      },
    })
      .then((canvas) => {
        console.log("Screenshot captured successfully");

        // NO CROPPING IS APPLIED HERE
        // Store the high-quality screenshot in a global variable for later use
        window.highQualityScreenshot = canvas.toDataURL("image/png");

        // Create download link
        const link = document.createElement("a");
        link.download = "bracuexam.png";
        link.href = window.highQualityScreenshot;
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          if (document.body.contains(tempContainer)) {
            document.body.removeChild(tempContainer);
          }
        }, 100);

        // Show success message
        showToast("Schedule saved!", "success");
      })
      .catch((error) => {
        console.error("Capture error:", error);
        showToast("Error taking. Please try again.", "error");
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      });
  }, 100); // Add a short delay to ensure DOM is fully rendered
}

/**
 * Opens a modal with the high-quality screenshot
 * @param {string} imageUrl - URL of the high-quality screenshot
 */
function openScreenshotModal(imageUrl) {
  // Create or get modal container
  let modal = document.getElementById("screenshot-fullscreen-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "screenshot-fullscreen-modal";
    modal.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;";
    document.body.appendChild(modal);
  } else {
    modal.style.display = "flex";
  }

  // Clear previous content
  modal.innerHTML = "";

  // Create container for the image with improved spacing
  const imgContainer = document.createElement("div");
  imgContainer.style.cssText =
    "position:relative;width:85%;height:85%;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:10px;border:2px solid rgba(255,255,255,0.15);border-radius:12px;background:rgba(0,0,0,0.3);";

  // Create the image element
  const img = document.createElement("img");
  img.id = "screenshot-fullscreen-img";
  img.alt = "Full Screen Schedule";
  img.style.cssText =
    "max-width:100%;max-height:100%;object-fit:contain;transform-origin:center;"; // Apply 9% crop to the image in the modal
  console.log("Opening modal");

  // Helper function to manually crop the image from URL
  function manuallyProcessImageUrl(url, callback) {
    const tempImg = new Image();
    tempImg.onload = function () {
      // Apply different crop percentages for sides vs top/bottom
      const cropPercentSides = 0.09; // 9% crop on left and right sides
      const cropPercentTopBottom = 0.02; // 2% crop on top and bottom
      const cropX = Math.floor(tempImg.width * cropPercentSides);
      const cropY = Math.floor(tempImg.height * cropPercentTopBottom);
      const croppedWidth = tempImg.width - cropX * 2;
      const croppedHeight = tempImg.height - cropY * 2;

      console.log(
        `Manual cropping image from ${tempImg.width}x${tempImg.height} to ${croppedWidth}x${croppedHeight}`
      );

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
        croppedHeight, // Source rectangle
        0,
        0,
        croppedWidth,
        croppedHeight // Destination rectangle
      );

      // Return the cropped image data URL
      const croppedImageUrl = canvas.toDataURL("image/png");
      callback(croppedImageUrl);
    };

    tempImg.onerror = function (error) {
      console.error("Error loading image for manual cropping:", error);
      callback(url); // Return original on error
    };

    tempImg.src = url;
  }

  // Try to use the helper, fall back to manual method if needed
  if (imageUrl.startsWith("data:image")) {
    if (
      window.pdfScreenshotHelper &&
      typeof window.pdfScreenshotHelper.cropImageFromUrl === "function"
    ) {
      console.log("Using helper to crop image");
      try {
        window.pdfScreenshotHelper.cropImageFromUrl(
          imageUrl,
          (croppedImageUrl) => {
            console.log("Image cropped successfully using helper");
            img.src = croppedImageUrl;
          }
        );
      } catch (cropError) {
        console.error("Error using helper to crop image:", cropError);
        manuallyProcessImageUrl(imageUrl, (croppedUrl) => {
          img.src = croppedUrl;
        });
      }
    } else {
      console.log("Helper not available, using manual image cropping");
      manuallyProcessImageUrl(imageUrl, (croppedUrl) => {
        img.src = croppedUrl;
      });
    }
  } else {
    console.log("Image URL not valid for cropping, using original");
    img.src = imageUrl;
  }

  // Add controls for zoom
  const controlsContainer = document.createElement("div");
  controlsContainer.style.cssText =
    "position:absolute;bottom:20px;left:0;right:0;display:flex;justify-content:center;gap:10px;";

  const zoomInBtn = document.createElement("button");
  zoomInBtn.textContent = "Zoom In";
  zoomInBtn.style.cssText =
    "background:rgba(59, 130, 246, 0.7);color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;";

  const zoomOutBtn = document.createElement("button");
  zoomOutBtn.textContent = "Zoom Out";
  zoomOutBtn.style.cssText =
    "background:rgba(59, 130, 246, 0.7);color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;";

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset";
  resetBtn.style.cssText =
    "background:rgba(59, 130, 246, 0.7);color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText =
    "position:absolute;top:20px;right:20px;background:rgba(239, 68, 68, 0.7);color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;";

  // Add elements to DOM
  imgContainer.appendChild(img);
  controlsContainer.appendChild(zoomInBtn);
  controlsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(resetBtn);
  modal.appendChild(imgContainer);
  modal.appendChild(controlsContainer);
  modal.appendChild(closeBtn);

  // Current scale value
  let scale = 1;

  // Event handlers for zoom controls
  zoomInBtn.addEventListener("click", () => {
    scale += 0.25;
    img.style.transform = `scale(${scale})`;
  });

  zoomOutBtn.addEventListener("click", () => {
    if (scale > 0.5) scale -= 0.25;
    img.style.transform = `scale(${scale})`;
  });

  resetBtn.addEventListener("click", () => {
    scale = 1;
    img.style.transform = "scale(1)";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

/**
 * Updates the visibility of the "Add Course" buttons based on the number of input rows
 */
function updateAddCourseButtons() {
  const inputRows = document.querySelectorAll(".input-row");
  const addButtons = document.querySelectorAll(".add-course");
  if (inputRows.length >= 7) {
    addButtons.forEach((btn) => (btn.style.display = "none"));
  } else {
    addButtons.forEach((btn) => (btn.style.display = ""));
  }
}

// Call this function whenever a course is added or removed
document.addEventListener("click", function (e) {
  if (e.target.closest(".add-course")) {
    // Your logic to add a new course row...
    setTimeout(updateAddCourseButtons, 0); // Update after DOM changes
  }
  // If you have a remove button, also call updateAddCourseButtons after removal
});

// Also call once on page load
document.addEventListener("DOMContentLoaded", updateAddCourseButtons);

/**
 * Save the routine table to localStorage
 */
function saveRoutineToLocalStorage() {
  const rows = Array.from(document.querySelectorAll("#schedule-body tr"));
  const data = rows.map((row) =>
    Array.from(row.children).map((cell) => cell.textContent)
  );
  localStorage.setItem("routineTable", JSON.stringify(data));
}

/**
 * Load the routine table from localStorage
 */
function loadRoutineFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("routineTable") || "[]");
  const tbody = document.getElementById("schedule-body");
  if (!tbody) return;
  tbody.innerHTML = "";
  data.forEach((cols) => {
    const tr = document.createElement("tr");
    cols.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

/**
 * Clear the routine table from localStorage
 */
function clearRoutineLocalStorage() {
  localStorage.removeItem("routineTable");
}

// Export UI functions
window.ui = {
  showToast,
  updateTitle,
  addExamsToSchedule,
  sortScheduleTable,
  takeScreenshot,
  openScreenshotModal,
  saveRoutineToLocalStorage,
  loadRoutineFromLocalStorage,
  clearRoutineLocalStorage,
};
