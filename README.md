# 🛡️ Bias Monitor (v2.0)
### Real-time AI Fairness & Ethics Auditing Dashboard

**Bias Monitor** is a sophisticated, high-performance monitoring platform designed to audit automated decision-making systems (such as recruitment AI, lending algorithms, and automated approval workflows) for demographic bias. It provides corporate ethics boards and compliance officers with real-time visibility into the "black box" of AI decisions.

---

## 🚀 Project Overview
In an era of automated decision-making, ensuring fairness is no longer optional—it's a regulatory and ethical necessity. **Bias Monitor** acts as a secure audit node that ingests decision data, analyzes it for disparate impact, and provides actionable recommendations to mitigate bias.

### Key Capabilities:
- **Real-time Monitoring**: Live tracking of decisions (Selected vs. Rejected) across demographic groups.
- **Fairness Scoring**: Instant calculation of Fairness Percentages and Bias Scores.
- **Disparate Impact Analysis**: Comparative selection rates (e.g., Male vs. Female selection) visualized through interactive charts.
- **Automated Alerts**: Real-time notifications when bias levels exceed predefined thresholds (Low, Medium, High).
- **Data Ingestion**: Support for live API integration (REST) and historical data batch uploads (CSV, XLSX).
- **Compliance Reporting**: One-click generation of professional PDF and Excel audit reports.

---

## 📊 Current Status
The project is currently in **Beta (v2.0)**. The core infrastructure, data ingestion pipeline, and visualization dashboard are fully functional.

- [x] **Core Dashboard**: Interactive UI with real-time polling (3s interval).
- [x] **Authentication**: Corporate Hub registration with unique API Key generation.
- [x] **API Layer**: Functional REST endpoints for decision ingestion and result retrieval.
- [x] **Data Processing**: Prisma-powered backend for scalable decision logging.
- [x] **Export System**: Functional PDF and Excel report generation.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router architecture)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL (scalable architecture)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 🔮 What Should Be Added (Future Roadmap)
To evolve into a comprehensive enterprise ethics solution, the following features are planned:
- **Multi-dimensional Auditing**: Support for Race, Age, Disability status, and Intersectionality analysis.
- **Model Explainability (XAI)**: Integration with SHAP/LIME for feature-level bias attribution.
- **Webhook Integration**: Trigger external workflows (e.g., Slack, Email, Jira) when "High" bias is detected.
- **RBAC (Role-Based Access Control)**: Granular permissions for Auditors, Admins, and Viewers.
- **Historical Trend Analysis**: Comparative view of fairness scores over months/years.
- **Custom Thresholds**: Allow organizations to define their own "Acceptable Fairness" levels.

---

## 📝 What Should Be Done (Immediate Tasks)
- **SDK Documentation**: Create a dedicated documentation site/page for the API integration.
- **Unit/Integration Testing**: Implement Vitest/Playwright tests for core logic and UI flows.
- **Polling Optimization**: Replace 3s interval polling with WebSockets for true real-time efficiency.
- **Form Validation**: Add robust validation for CSV/XLSX uploads to handle malformed data.
- **Environment Parity**: Ensure seamless transition between SQLite (dev) and PostgreSQL (prod).

---

## ⚠️ Known Issues
1. **SDK Placeholder**: The "SDK Integration Ready" button on the empty state screen is currently a UI placeholder.
2. **Branding Configuration**: "Antigravity Infrastructure" footer branding is currently hardcoded and should be moved to a config file.
3. **Large Dataset Lag**: Dashboard charts may experience performance drops with >100,000 decision records (needs virtualization/aggregation).
4. **Mobile Responsiveness**: The authentication cinematic backdrop is hidden on mobile; the form layout needs further optimization for small screens.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS)
- PostgreSQL Database

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/bias-monitor.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file and add your `DATABASE_URL`.
4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to access the Monitor Node.

---
*Developed by Antigravity Infrastructure • Secure Audit V2.0*
