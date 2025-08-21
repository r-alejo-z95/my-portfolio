# Ramon Alejandro's Full-Stack Portfolio

This is the repository for my personal portfolio, built with modern technologies to showcase my projects, skills, and GitHub activity. The application is not just a static website; it includes a full-fledged content management system (CMS) for the featured projects, complete with its own admin dashboard.

---

## ✨ Key Features

- **Modern & Responsive Design**: A clean and accessible interface for any device, built with Tailwind CSS.
- **GitHub Integration**: Dynamically displays my stats, repositories, and contribution graph using the GitHub API.
- **Functional Contact Form**: A form that sends email notifications to the administrator and confirmations to the visitor using Nodemailer.
- **Custom CMS & Admin Dashboard**:
  - **Secure Admin Panel**: A protected `/admin` route with user authentication (email/password) via Supabase Auth.
  - **Project Management**: The dashboard allows me to view all my GitHub repositories and select which ones to feature on the portfolio.
  - **Supabase Backend**: Featured projects are stored in a Supabase (PostgreSQL) database, secured with Row-Level Security (RLS) policies.
- **Built with Next.js**: Leveraging the latest features of React and Next.js, such as Server Components, for optimal performance.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Authentication**: [Supabase](https://supabase.io/)
- **Emailing**: [Nodemailer](https://nodemailer.com/)
- **UI/Components**: [Lucide React](https://lucide.dev/) (for icons)
- **Linting**: [ESLint](https://eslint.org/)

---

## 🚀 Getting Started

Follow these steps to get the project up and running in a local environment.

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 2. Clone the Repository

```bash
git clone https://github.com/r-alejo-z95/my-portfolio.git
cd my-portfolio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following variables. 

| Variable                       | Description                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`                 | A personal access token to fetch data from the GitHub API. [Create one here](https://github.com/settings/tokens). |
| `GITHUB_USERNAME`              | Your GitHub username.                                                                                   |
| `NEXT_PUBLIC_SUPABASE_URL`     | Your Supabase project URL. Found in your project's API settings.                                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`| Your Supabase project `anon` key. Found in your project's API settings.                                 |
| `SMTP_HOST`                    | Hostname of your SMTP email server (e.g., `smtp.example.com`).                                          |
| `SMTP_PORT`                    | Port for your SMTP server (e.g., `587`).                                                                |
| `SMTP_USER`                    | Username for your SMTP server.                                                                          |
| `SMTP_PASS`                    | Password for your SMTP server.                                                                          |
| `NOTIFICATION_EMAIL`           | The email address that will receive contact form notifications.                                         |
| `NEXT_PUBLIC_BASE_URL`         | The absolute URL of your deployment (e.g., `http://localhost:3000` for local development).                |


### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

---

## ☁️ Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/). Simply import your GitHub repository into Vercel and configure the same environment variables you used in your `.env.local` file.
