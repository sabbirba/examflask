# BRACU Exam Routine Web App

This is a Flask-based web application for viewing and cross-checking BRAC University exam routines. It provides a user-friendly interface to view, filter, and cross-check exam schedules, as well as take high-quality screenshots of your routine.

## Features

- View exam routines in a clean, responsive table.
- Add courses and sections to generate your personalized schedule.
- Cross-check your schedule with the official PDF (with page highlights).
- Take and download high-quality screenshots of your routine.
- Data is saved in localStorage for convenience.
- Mobile-friendly design.

## Project Structure

```
app.py
static/
    css/
        styles.css
    js/
        ...
styles/
    PdfScreenshot.css
templates/
    index.html
```

## Requirements

- Python 3.x
- Flask

## Setup

1. **Clone the repository:**

   ```sh
   git clone https://github.com/sabbirba/examflask
   cd examflask
   ```

2. **Install dependencies:**

   ```sh
   pip install flask
   ```

3. **Place exam files:**

   - Place `exam.pdf` and `exam.json` in `/home/sabbirba10/` or update the paths in [`app.py`](app.py).

4. **Run the app:**

   ```sh
   python app.py
   ```

5. **Access in browser:**
   - Open [http://localhost:5000](http://localhost:5000)

## Endpoints

- `/` : Main web interface ([index.html](templates/index.html))
- `/exam.pdf` : Serves the official exam PDF
- `/exam.json` : Serves the exam data in JSON format

## Customization

- To change the location of the exam files, update the paths in [`serve_pdf`](app.py) and [`serve_json`](app.py).
- Frontend logic and UI are in the `static/js/` and `static/css/` folders.

## License

MIT License

---

**Note:** This project is not affiliated with BRAC University. For official schedules, always refer to the university's official sources.

---

<div align="center" style="margin-top: 2em; font-size: 1.1em;">
  <strong>Developed by <a href="https://github.com/sabbirba" target="_blank">Sabbir Bin Abbas</a></strong><br>
  <em>All copyrights &copy; <a href="https://github.com/sabbirba" target="_blank">Sabbir Bin Abbas</a>. All rights reserved.</em>
</div>
