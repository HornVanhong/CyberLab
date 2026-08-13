export interface ExamTask {
  id: string;
  taskNumber: number;
  category: "OSINT Recon" | "Credential Cracking" | "Web Vulnerability" | "Network Forensics" | "Linux PrivEsc";
  title: string;
  scenarioDescription: string;
  osintToolRecommended: string;
  hint: string;
  correctAnswers: string[]; // Accepts exact match or lower-case variation
  xpReward: number;
  solutionWalkthrough: string;
  suggestedTerminalCommand: string;
  simulatedTerminalOutput: string;
}

export const PRACTICAL_EXAM_TASKS: ExamTask[] = [
  {
    id: "task-1",
    taskNumber: 1,
    category: "OSINT Recon",
    title: "Passive Infrastructure Recon via Shodan",
    scenarioDescription: "During a passive OSINT assessment of target server IP `198.51.100.42`, you need to identify the exposed FTP banner without sending active scan packets directly to the host. Use Shodan CLI or Shodan search queries to determine the FTP service version string.",
    osintToolRecommended: "Shodan CLI / Shodan Search Engine",
    hint: "Use `shodan host 198.51.100.42` or search `port:21` to inspect port 21 service banners.",
    correctAnswers: ["vsftpd 2.3.4", "vsftpd2.3.4", "vsftpd"],
    xpReward: 150,
    solutionWalkthrough: "Run `shodan host 198.51.100.42` or query `port:21 ip:198.51.100.42` in Shodan. Port 21 banner reveals: '220 (vsFTPd 2.3.4)'.",
    suggestedTerminalCommand: "shodan host 198.51.100.42",
    simulatedTerminalOutput: "Host: 198.51.100.42\nOrganization: CyberLab Target Corp\nOpen Ports: 21, 80, 443\nServices:\n21/tcp - FTP (vsFTPd 2.3.4)\n80/tcp - HTTP (Apache httpd 2.4.41)\n443/tcp - HTTPS (OpenSSL 1.1.1)",
  },
  {
    id: "task-2",
    taskNumber: 2,
    category: "OSINT Recon",
    title: "Subdomain Mining via Certificate Transparency (Crt.sh)",
    scenarioDescription: "The target company operates `cyberlab-corp.lab`. You need to locate their unlinked secret staging subdomain using Certificate Transparency logs. Query `crt.sh` or subfinder to find the hidden staging domain name.",
    osintToolRecommended: "Crt.sh / Subfinder",
    hint: "Query `crt.sh` with `%.cyberlab-corp.lab` or run `subfinder -d cyberlab-corp.lab`.",
    correctAnswers: ["dev-staging.cyberlab-corp.lab", "dev-staging"],
    xpReward: 150,
    solutionWalkthrough: "Searching Certificate Transparency logs at `crt.sh` for `%.cyberlab-corp.lab` returns registered SSL certificates, exposing `dev-staging.cyberlab-corp.lab`.",
    suggestedTerminalCommand: "curl -s 'https://crt.sh/?q=%.cyberlab-corp.lab&output=json' | jq -r '.[].name_value'",
    simulatedTerminalOutput: "cyberlab-corp.lab\nwww.cyberlab-corp.lab\nmail.cyberlab-corp.lab\ndev-staging.cyberlab-corp.lab",
  },
  {
    id: "task-3",
    taskNumber: 3,
    category: "Credential Cracking",
    title: "Leaked Database MD5 Password Cracking",
    scenarioDescription: "An OSINT breach dump search revealed an MD5 password hash: `5f4dcc3b5aa765d61d8327deb882cf99`. Use Hashcat, John the Ripper, or CyberChef to crack the hash and recover the cleartext password.",
    osintToolRecommended: "Hashcat / CyberChef",
    hint: "MD5 hash mode in Hashcat is `-m 0`. Try cracking with rockyou.txt or CyberChef MD5 lookup.",
    correctAnswers: ["password", "Password"],
    xpReward: 150,
    solutionWalkthrough: "Running `hashcat -m 0 5f4dcc3b5aa765d61d8327deb882cf99 /usr/share/wordlists/rockyou.txt` cracks the MD5 digest to reveal `password`.",
    suggestedTerminalCommand: "echo '5f4dcc3b5aa765d61d8327deb882cf99' > hash.txt && hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt --show",
    simulatedTerminalOutput: "5f4dcc3b5aa765d61d8327deb882cf99:password\nSession..........: hashcat\nStatus...........: Cracked",
  },
  {
    id: "task-4",
    taskNumber: 4,
    category: "Web Vulnerability",
    title: "Google Dorks Configuration Credentials Leak",
    scenarioDescription: "Using Google Hacking operators (`filetype:env DB_PASSWORD`), an exposed `.env` file was found indexed on `target.lab`. Inspect the leaked `.env` contents to retrieve the value of `DB_PASSWORD`.",
    osintToolRecommended: "Google Dorks / GHDB",
    hint: "Look for `DB_PASSWORD=` inside the leaked environment configuration file.",
    correctAnswers: ["CYBER_LAB_ROOT_PASS_2026", "CYBER_LAB_ROOT_PASS_2026"],
    xpReward: 200,
    solutionWalkthrough: "Executing Google Dork `site:target.lab filetype:env` exposes `.env` file containing `DB_PASSWORD=CYBER_LAB_ROOT_PASS_2026`.",
    suggestedTerminalCommand: "curl -s http://target.lab/.env",
    simulatedTerminalOutput: "APP_NAME=CyberLabApp\nAPP_ENV=production\nDB_HOST=127.0.0.1\nDB_PORT=5432\nDB_DATABASE=cyberlab_db\nDB_USERNAME=root\nDB_PASSWORD=CYBER_LAB_ROOT_PASS_2026",
  },
  {
    id: "task-5",
    taskNumber: 5,
    category: "Network Forensics",
    title: "Wireshark PCAP Cleartext Credential Extraction",
    scenarioDescription: "A packet capture file `http_login.pcap` was captured during network monitoring. Inspect the HTTP POST authentication frame using TShark or Wireshark display filters to extract the submitted admin token.",
    osintToolRecommended: "Wireshark / TShark",
    hint: "Use TShark filter `http.request.method == \"POST\"` or search raw frames for `admin`.",
    correctAnswers: ["AdminSecretToken99", "adminsecrettoken99"],
    xpReward: 200,
    solutionWalkthrough: "Filtering HTTP POST traffic with `tshark -r http_login.pcap -Y 'http.request.method == \"POST\"' -T fields -e http.file_data` reveals `token=AdminSecretToken99`.",
    suggestedTerminalCommand: "tshark -r http_login.pcap -Y 'http.request.method == \"POST\"' -A",
    simulatedTerminalOutput: "Frame 14: 742 bytes on wire\nHTTP POST /login.php HTTP/1.1\nHost: target.lab\nContent-Type: application/x-www-form-urlencoded\n\nusername=admin&auth_token=AdminSecretToken99&submit=Login",
  },
  {
    id: "task-6",
    taskNumber: 6,
    category: "Linux PrivEsc",
    title: "Linux VM SUID Binaries Privilege Escalation Audit",
    scenarioDescription: "On the target Linux VM, you obtained a low-privilege shell (`www-data`). Audit the file system for misconfigured SUID binaries (`find / -perm -u=s`). Which standard Linux executable has SUID bit set?",
    osintToolRecommended: "LinPEAS / Linux CLI",
    hint: "Run `find / -perm -u=s -type f 2>/dev/null` to locate SUID binaries.",
    correctAnswers: ["/usr/bin/find", "find"],
    xpReward: 200,
    solutionWalkthrough: "Running `find / -perm -u=s -type f 2>/dev/null` lists `/usr/bin/find` as SUID root. GTFOBins allows root shell via `find . -exec /bin/sh -p \\; -quit`.",
    suggestedTerminalCommand: "find / -perm -u=s -type f 2>/dev/null",
    simulatedTerminalOutput: "/usr/lib/dbus-1.0/dbus-daemon-launch-helper\n/usr/bin/passwd\n/usr/bin/newgrp\n/usr/bin/chsh\n/usr/bin/find",
  },
];
