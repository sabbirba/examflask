let examData = [];
let availableCourses = new Set();
let isFinalsSchedule = false;
let courseSections = {};

/**
 *
 * @return {Promise}
 */
function loadScheduleData() {
  console.log("Fetching exam data...");
  return fetch("https://sabbirba10.pythonanywhere.com/exam.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.exams && data.exams.length > 0) {
        isFinalsSchedule = "Final Date" in data.exams[0];
      }

      let examName = data.bracu_exam_name;
      if (!examName) {
        const defaultSuffix = "for Summer 2025";
        examName = isFinalsSchedule
          ? `Final Exam Schedule ${defaultSuffix}`
          : `Mid-Term Exam Schedule ${defaultSuffix}`;
      }

      ui.updateTitle(isFinalsSchedule, examName);

      examData = data.exams
        .filter(
          (exam) =>
            exam["Course"] &&
            exam["Section"] &&
            (exam["Mid Date"] || exam["Final Date"]) &&
            exam["Start Time"] &&
            exam["End Time"] &&
            exam["Room."]
        )
        .map((exam) => {
          const courseCode = exam["Course"];
          const section = exam["Section"];
          const dateField = exam["Final Date"] ? "Final Date" : "Mid Date";

          availableCourses.add(courseCode);

          // Build course to sections mapping
          if (!courseSections[courseCode]) {
            courseSections[courseCode] = new Set();
          }
          courseSections[courseCode].add(section);

          return {
            date: utils.formatDateFromJSON(exam[dateField]),
            time: utils.convertTimeFromJSON(
              exam["Start Time"],
              exam["End Time"]
            ),
            courseCode: courseCode,
            section: section,
            classroom: exam["Room."],
            pageNumber: exam["Page Number"] || -1, // Add the page number from JSON
            boundingBox: exam["BoundingBox"] || null, // Add bounding box from JSON
          };
        });

      console.log("Loaded exam data:", examData.length, "entries");
      ui.showToast(
        `Loaded ${examData.length} exam entries successfully`,
        "success"
      );
    })
    .catch((error) => {
      console.error("Error loading schedule data:", error);
      ui.showToast(
        "Error loading schedule data. Please refresh the page.",
        "error"
      );
    });
}

/**
 * Find matching exams for a course code and section
 * @param {string} courseCode - The course code to search for
 * @param {string} section - The section to search for
 * @return {Array} - Array of matching exams
 */
function findExams(courseCode, section) {
  return examData.filter(
    (exam) =>
      exam.courseCode.toLowerCase() === courseCode.toLowerCase() &&
      exam.section === section
  );
}

/**
 * Get all available courses
 * @return {Array} - Array of course codes
 */
function getAvailableCourses() {
  return Array.from(availableCourses);
}

/**
 * Get all sections for a course
 * @param {string} courseCode - The course code
 * @return {Array} - Array of sections or empty array if course not found
 */
function getSectionsForCourse(courseCode) {
  if (courseSections[courseCode]) {
    return Array.from(courseSections[courseCode]);
  }
  return [];
}

/**
 * Check if the loaded data represents finals schedule
 * @return {boolean} - True if finals schedule, false for midterms
 */
function isFinalsScheduleLoaded() {
  return isFinalsSchedule;
}

// Export functions and data
window.data = {
  loadScheduleData,
  findExams,
  getAvailableCourses,
  getSectionsForCourse,
  isFinalsScheduleLoaded,
};
