# AI Resume Analyzer 


An AI-powered resume optimization platform that helps job seekers understand their resume quality, improve ATS compatibility, identify skill gaps, and create stronger resume content using Google Gemini AI.

The platform combines AI-driven resume analysis, actionable feedback, keyword insights, and version tracking in one place.

---

## ✨ Key Features

### 🔐 Secure Authentication
- User registration and login.
- JWT-based authentication using HTTP-only cookies.
- Password hashing with bcrypt.

### 📄 Smart Resume Parsing
- Upload resumes in PDF format.
- Extract text using `pdf-parse`.
- Validate file type and upload size.
- Detect scanned or image-only PDFs that cannot provide sufficient extractable text.
- Structure resume information into sections such as experience, education, skills, projects, and certifications.

### 🎯 ATS Score Analysis
- Generate an ATS score from **0 to 100**.
- Analyze keywords, formatting, impact, and clarity.
- Identify weaknesses that may reduce resume effectiveness.
- Provide actionable recommendations for improvement.

### 🧠 AI-Powered Feedback
- Identify five prioritized resume issues with severity levels and suggested fixes.
- Highlight resume strengths with supporting evidence.
- Rewrite resume bullet points to improve clarity, impact, and professional presentation.
- Explain why suggested improvements may strengthen a resume.

### 🔎 Job Keyword Analysis
- Identify relevant keywords present in a resume.
- Highlight missing keywords for a target job role.
- Help users recognize opportunities to better align resume content with a position.

### 🗂️ Resume Version Management
- Maintain separate versions of analyzed resumes.
- Create new versions when applying selected or multiple AI suggestions.
- Compare versions using word-level and line-level differences.
- Track how resume changes affect analysis scores.

### 📊 Analytics Dashboard
- View key resume performance metrics.
- Track average and best ATS scores.
- Visualize score trends and resume activity.
- Monitor recurring issues and keyword gaps.
- Review resume history and version progression.

### 🎨 User Experience
- Light and dark themes.
- Persistent theme preference.
- Organized dashboard, resume history, version comparison, and insights pages.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, HTML5, CSS3 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| AI | Google Gemini API |
| Authentication | JWT, HTTP-only cookies, bcrypt |
| File Processing | Multer, pdf-parse |
| Validation | Zod |
| Version Comparison | Word and line diff analysis |

---

## 🏗️ Application Architecture

```text
User
  │
  ▼
React Frontend (Vite)
  │
  ▼
Express.js REST API
  │
  ├── Authentication & Authorization
  │
  ├── PDF Upload & Text Extraction
  │
  ├── AI Resume Analysis
  │      └── Google Gemini API
  │
  ├── ATS Scoring & Recommendations
  │
  ├── Resume Version Management
  │
  └── Analytics & Insights
         │
         ▼
    MongoDB Atlas
```

---



## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed or configured:

- [Node.js](https://nodejs.org/)
- npm
- A [MongoDB Atlas](https://www.mongodb.com/atlas) database, or another compatible MongoDB instance
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the Repository

```bash
git clone https://github.com/brehankaldar/ai-resume-analyzer.git
cd ai-resume-analyzer
```


### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

Open a second terminal in the project root:

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the backend directory and configure the variables required by your application.

Example:

```env
NODE_PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:5173
```


### 5. Start the Backend

From the backend directory, run:

```bash
npm run dev
```

### 6. Start the Frontend

In another terminal, run:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by Vite, typically:

`http://localhost:5173`

---

## 🔄 How It Works

1. **Register or log in** to access your account.
2. **Upload a resume** in PDF format.
3. **Extract resume content** and organize it into structured sections.
4. **Analyze the resume with AI** to generate an ATS score, strengths, issues, and improvement suggestions.
5. **Review keyword insights** to identify relevant skills and missing terms for a target role.
6. **Improve resume content** by applying AI-generated bullet point rewrites.
7. **Save a new version** to preserve your changes without overwriting the previous version.
8. **Compare versions and track progress** through the dashboard, history, and analytics pages.

---

## 🔒 Security & Reliability

- Password hashing with bcrypt.
- JWT authentication using HTTP-only cookies.
- PDF upload validation and file-size restrictions.
- Zod-based request and AI response validation where implemented.
- Per-user AI rate limits.
- Environment-based configuration for sensitive credentials.



---

## 🚀 Future Enhancements

- **Resume Builder:** Create professional resumes using customizable templates.
- **DOCX Support:** Accept additional resume file formats.
- **AI Interview Preparation:** Generate interview questions based on resume content and target roles.
---

## 🤝 Contributing

Suggestions, improvements, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request describing your improvements.

---


