# Kilian Rohde - Modern E-commerce Platform

A premium, modern e-commerce platform built with Next.js 15, featuring AI-driven design customization and a robust administrative dashboard.

## 🚀 Overview
Kilian Rohde is a state-of-the-art e-commerce solution that leverages AI to allow users to customize their own designs before purchase. It provides a seamless shopping experience with a focus on high-end aesthetics and interactive user interfaces.

## ✨ Key Features
- **AI Customization**: Empower users to create and preview custom designs using AI.
- **Modern UI/UX**: Built with high-performance components and smooth animations.
- **Admin Dashboard**: Comprehensive management system for orders, content, and analytics.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **State Management**: Robust data handling with Redux Toolkit and persistence.

## 🛠️ Tech Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/), [Heroicons](https://heroicons.com/)
- **Notifications**: [Sonner](https://sonner.stevenly.com/), [React Hot Toast](https://react-hot-toast.com/)
- **Form Handling**: [SweetAlert2](https://sweetalert2.github.io/) for interactive alerts.

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20.x or later recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/) (preferred for speed)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

## ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd kilian-rhode-frontend-latest
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**:
   Create a `.env` or `.env.local` file in the root directory and add the following configuration:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://api.thundra.de
   NEXT_PUBLIC_API_BASE_URL_AI=https://ai.thundra.de
   ```

## 🚀 Running the Project

### Development Mode
Start the development server with hot-reloading:
```bash
npm run dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Production Build
To create an optimized production build:
```bash
npm run build
npm start
```

## 🐳 Docker Support
The project is containerized for consistent deployment across different environments.

### Build and Run with Docker
```bash
# Build the image
docker build -t kilian-rhode-frontend .

# Run the container
docker run -p 3002:3002 kilian-rhode-frontend
```

## 🛠️ Deployment (Makefile)
The project includes a `Makefile` for automated tasks:
- `make build`: Build the production Docker image.
- `make deploy`: Build and push the image to the registry.
- `make docker-run`: Start the production container in detached mode.

## 📁 Project Structure
- `app/`: Next.js App Router (pages, layouts, and API routes).
- `components/`: Reusable UI components (Admin, Emails, Shared).
- `store/`: Redux Toolkit state management, slices, and RTK Query services.
- `public/`: Static assets (images, icons, fonts).
- `utils/`: Helper functions, constants, and global types.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

---
Developed with ❤️ by the Kilian Rohde Team.
