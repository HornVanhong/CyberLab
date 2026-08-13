import { Lab } from "@/types/cyberlab";

export const LABS: Lab[] = [
  {
    id: "metasploitable-2",
    name: "Metasploitable 2",
    tagline: "Classic intentionally vulnerable Linux virtual machine for network & service assessment",
    description:
      "A vulnerable Ubuntu-based target designed for security training. Test your manual reconnaissance, service enumeration, vulnerability identification, and privilege escalation skills from your Kali Linux VM.",
    category: "Network Security",
    difficulty: "Beginner → Intermediate",
    status: "In Progress",
    defaultTargetIp: "192.168.56.101",
    iconName: "ShieldAlert",
    badge: "Active Lab",
    totalChallenges: 10,
    estimatedTime: "2-4 Hours",
    prerequisites: [
      "Kali Linux VirtualBox / VMware host-only or NAT network",
      "Metasploitable 2 VM running on the same private subnet",
      "Basic knowledge of Nmap, Netcat, and Linux CLI",
    ],
    setupNotes:
      "Ensure your Kali VM and Metasploitable 2 are attached to the same Host-Only adapter (e.g. vboxnet0) or custom internal network. Verify connectivity via ping before starting.",
  },
  {
    id: "owasp-juice-shop",
    name: "OWASP Juice Shop",
    tagline: "Modern web application insecurity lab covering OWASP Top 10 vulnerabilities",
    description:
      "An intentionally insecure web application written in Node.js, Express, and Angular. Practice finding and exploiting OWASP Top 10 vulnerabilities including SQL injection, XSS, broken access control, and IDOR.",
    category: "Web Security",
    difficulty: "Beginner → Advanced",
    status: "In Progress",
    defaultTargetIp: "192.168.56.102:3000",
    iconName: "Globe",
    badge: "Active Lab",
    totalChallenges: 10,
    estimatedTime: "3-5 Hours",
    prerequisites: [
      "Burp Suite Community Edition or OWASP ZAP configured with browser proxy",
      "Browser Web Developer Tools (F12 / Inspect Elements)",
      "Understanding of HTTP methods (GET, POST, PUT), headers, and JSON payloads",
    ],
    setupNotes:
      "Run OWASP Juice Shop in Docker on your local VM: `docker run -d -p 3000:3000 bkimminich/juice-shop` or start your local Juice Shop appliance at port 3000.",
  },
  {
    id: "dvwa",
    name: "Damn Vulnerable Web App (DVWA)",
    tagline: "PHP/MySQL web application to test web exploitation skills across security difficulty tiers",
    description:
      "A classic PHP/MySQL web application designed to test fundamental web security skills. Master Command Injection, Local File Inclusion (LFI), SQL Injection, Stored & Reflected XSS, and File Upload bypasses.",
    category: "Web Security",
    difficulty: "Beginner → Intermediate",
    status: "In Progress",
    defaultTargetIp: "192.168.56.103/dvwa",
    iconName: "Code",
    badge: "Active Lab",
    totalChallenges: 10,
    estimatedTime: "2-4 Hours",
    prerequisites: [
      "Burp Suite Community Edition for HTTP request interception",
      "Basic understanding of PHP execution and MySQL queries",
      "Web browser with proxy switch extension (e.g. FoxyProxy)",
    ],
    setupNotes:
      "Access DVWA on your Metasploitable 2 VM (`http://<TARGET_IP>/dvwa/`) or via standalone Docker container: `docker run -d -p 80:80 vulnerables/web-dvwa`.",
  },
  {
    id: "osint-recon",
    name: "OSINT & Threat Intelligence",
    tagline: "Master passive open source intelligence, digital footprinting, credential leaks, and metadata analysis",
    description:
      "Open Source Intelligence (OSINT) is the crucial first phase in penetration testing. Learn how to gather actionable intelligence on targets without sending a single active packet to their perimeter: DNS records, certificate transparency logs, Google dorking, document metadata extraction, code leak hunting, Shodan IoT mapping, and geoint analysis.",
    category: "OSINT & Intelligence",
    difficulty: "Beginner → Intermediate",
    status: "In Progress",
    defaultTargetIp: "target-corp.lab",
    iconName: "Search",
    badge: "Active Lab",
    totalChallenges: 10,
    estimatedTime: "2-4 Hours",
    prerequisites: [
      "Web browser with search capabilities",
      "Kali Linux OSINT tools: whois, dig, theHarvester, exiftool, curl",
      "Understanding of DNS records, SSL/TLS certificates, and public web archives",
    ],
    setupNotes:
      "OSINT exercises rely on passive investigation techniques and command line utilities. Work through simulated threat scenarios and real-world intelligence challenges.",
  },
];
