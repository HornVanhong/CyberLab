# 🛡️ CyberLab - Cybersecurity Practice Lab & OSINT Learning Platform

<p align="center">
  <img src="public/globe.svg" width="80" alt="CyberLab Logo" />
</p>

<p align="center">
  <strong>An interactive cybersecurity practice lab, OSINT web directory, tool tutorial academy, practical VM examination center, and virtual lab setup platform built with Next.js 16 and TypeScript.</strong>
</p>

<p align="center">
  <a href="https://github.com/HornVanhong/CyberLab.git"><img src="https://img.shields.io/badge/GitHub-HornVanhong%2FCyberLab-cyan?style=for-the-badge&logo=github" alt="GitHub Repository"></a>
  <img src="https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge" alt="License">
</p>

---

## 🌟 Key Features & Modules

### 🎓 1. Learn Tools Academy (`/tools`)
* **Interactive Tool Tutorials**: Master 25+ industry-standard cybersecurity tools (**Nmap**, **Gobuster**, **SQLmap**, **THC Hydra**, **Hashcat**, **John the Ripper**, **Wireshark**, **Metasploit**, **Ghidra**, **CyberChef**, **Shodan**, **Sherlock**, **SpiderFoot**, etc.).
* **Must-Know Flags & Command Constructor**: Select command flags live to see how flags build target execution strings.
* **Terminal Command Simulator**: Test commands in a simulated terminal environment (`cyberlab@kali:~#`) and inspect real-time output feedback.
* **Filter by Task**: Quick task-based tool recommendation buttons (e.g. *"Scan Network Ports"*, *"Find Web Endpoints"*, *"Crack Passwords"*, *"Test SQLi"*, *"Subdomain Discovery"*, *"Reverse Engineering"*).

---

### 🌐 2. OSINT Web Links & Live Directory (`/osint-resources`)
* **Direct 1-Click Access**: Curated web directory of premier open-source intelligence websites collected from Google.
* **Top OSINT Portals**:
  * **IoT & Cyber Search Engines**: [Shodan.io](https://www.shodan.io), [Censys Search](https://search.censys.com), [BinaryEdge](https://www.binaryedge.io), [ZoomEye](https://www.zoomeye.org), [FOFA](https://fofa.info).
  * **Domain & DNS Recon**: [Crt.sh](https://crt.sh), [DNSDumpster](https://dnsdumpster.com), [SecurityTrails](https://securitytrails.com), [VirusTotal](https://www.virustotal.com), [BuiltWith](https://builtwith.com), [Wayback Machine](https://web.archive.org), [DomainTools WHOIS](https://whois.domaintools.com).
  * **Identity & Email OSINT**: [Have I Been Pwned](https://haveibeenpwned.com), [Hunter.io](https://hunter.io), [OSINT Framework](https://osintframework.com), [WhatsMyName App](https://whatsmyname.app), [IntelTechniques](https://inteltechniques.com), [DeHashed](https://dehashed.com).
  * **Network & Geolocation**: [BGPView](https://bgpview.io), [IPinfo.io](https://ipinfo.io), [Wireshark Sample Captures](https://wiki.wireshark.org/SampleCaptures).
  * **Exploits & Cyber Utilities**: [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database), [CyberChef](https://gchq.github.io/CyberChef), [GTFOBins](https://gtfobins.github.io).
* **Sample Dork Queries**: 1-click copyable search queries and dorks for easy pasting into target portals.

---

### 🏆 3. Practical OSINT & Kali VM Exam (`/exam`)
* **Practical Examination Tasks**: Solve real-world OSINT and Kali Linux VM scenarios (Shodan banner grabs, Crt.sh certificate mining, Hashcat MD5 password cracking, Google Dork `.env` leaks, Wireshark PCAP token extraction, and Linux SUID GTFOBins audit).
* **Embedded Kali Terminal Simulator**: Run terminal commands (`cyberlab@kali:~#`) directly in the exam workspace.
* **Real-Time Scoring & Timer**: 45-minute countdown timer, XP score tracking, hint system (-10 XP penalty), and detailed step-by-step solution walkthroughs.
* **Official Certificate of Completion**: Generates a downloadable & printable **"Certified Cyber & OSINT Specialist" Certificate** upon solving all exam tasks!

---

### ⚙️ 4. Virtual Cyber Lab Setup Guide (`/setup`)
* **Step-by-Step Installation Guides**:
  * **Kali Linux VM**: OVA import into VirtualBox/VMware, default credentials (`kali:kali`), and system package update commands (`sudo apt update && sudo apt upgrade -y`).
  * **Metasploitable 2 & 3 Target VM**: VMDK virtual disk attachment, default logins (`msfadmin:msfadmin`), and verifying vulnerable service ports (FTP 21, SSH 22, HTTP 80, Samba 445, MySQL 3306).
  * **Isolated Virtual Network**: Configuring VirtualBox Host-Only Adapter (`vboxnet0` on `192.168.56.0/24`), assigning static IPs, testing `ping` connectivity, and scanning target ports from Kali using Nmap.
* **Interactive Troubleshooting**: Solves common hypervisor issues (VT-x BIOS fix, Guest Additions screen fix, DHCP IP assignment fix).

---

### ⚡ 5. Interactive Command Generator & Cheatsheets (`/commands`)
* **Live Command Generator**: Interactively toggle flags for Nmap, Gobuster, SQLmap, Hydra, Hashcat, Wireshark, and Metasploit.
* **Searchable Cheatsheets**: 50+ curated commands, Linux privilege escalation queries, and runnable Python cybersecurity automation scripts.

---

### 🎮 6. Interactive Labs & Flag Quiz (`/labs`, `/challenges`, `/quiz`)
* **Metasploitable 2 Lab Targets**: Interactive CTF flag submissions, hint unlocks, real-time score tracking, audio feedback synthesized via Web Audio API, and user progress statistics.

---

## 🛠️ Technology Stack

| Component | Technology Used |
| :--- | :--- |
| **Framework** | [Next.js 16.3.0](https://nextjs.org/) (App Router & Turbopack) |
| **Language** | [TypeScript 5.0](https://www.typescriptlang.org/) |
| **UI Components** | React 19, Lucide React Icons |
| **Styling** | Vanilla CSS, TailwindCSS, Custom Cyber Glassmorphism |
| **Audio Synthesizer** | Web Audio API (`src/lib/sound.ts`) |
| **Version Control** | Git & GitHub (`HornVanhong/CyberLab`) |

---

## 📁 Project Directory Structure

```text
CyberLab/
├── public/                     # Static SVG assets & icons
├── src/
│   ├── app/
│   │   ├── challenges/         # CTF Challenges & Flag Submissions
│   │   ├── commands/           # Live Command Generator & Cheatsheets
│   │   ├── exam/               # Practical OSINT & Kali VM Exam Center
│   │   ├── labs/               # Metasploitable 2 Practice Labs
│   │   ├── osint-resources/    # OSINT Web Directory & Direct Links
│   │   ├── progress/           # User Score & Progress Analytics
│   │   ├── quiz/               # Flag & Command Multiple Choice Quiz
│   │   ├── settings/           # App Settings & Sound Controls
│   │   ├── setup/              # Virtual VM & Network Setup Guide
│   │   └── tools/              # Learn Tools Academy & Simulator
│   ├── components/
│   │   ├── layout/             # Sidebar, Navbar, AppShell
│   │   └── ui/                 # Modal, CopyButton, TerminalBox, Badge
│   ├── context/
│   │   └── CyberLabContext.tsx # Global XP, Progress, & Sound State
│   ├── data/
│   │   ├── challenges.ts       # CTF Challenges Dataset
│   │   ├── cheatsheets.ts      # Cheatsheets & Command Items
│   │   ├── examData.ts         # Practical Exam Tasks Dataset
│   │   ├── labs.ts             # Metasploitable Labs Dataset
│   │   ├── osintLinks.ts       # OSINT Web Links Directory Dataset
│   │   ├── quizData.ts         # Quiz Questions Dataset
│   │   ├── setupGuideData.ts   # VM Setup Guide Steps Dataset
│   │   └── toolsData.ts        # Detailed Tools Academy Dataset
│   └── lib/
│       ├── celebrate.ts        # Confetti Celebration Trigger
│       ├── sound.ts            # Web Audio API Synthesizer
│       ├── storage.ts          # LocalStorage Persistence Handler
│       └── utils.ts            # Tailwind Class Merge Utilities
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/HornVanhong/CyberLab.git
   cd CyberLab
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to access CyberLab locally.

---

## ⚙️ Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

---

## 📄 License & Attribution

Distributed under the **MIT License**. Created by **[HornVanhong](https://github.com/HornVanhong)** for ethical hacking education, CTF practice, and OSINT research.
