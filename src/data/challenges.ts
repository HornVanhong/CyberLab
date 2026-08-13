import { Challenge } from "@/types/cyberlab";

export const CHALLENGES: Challenge[] = [
  // ==========================================
  // METASPLOITABLE 2 LAB (10 CHALLENGES)
  // ==========================================
  {
    id: "ms2-001",
    labId: "metasploitable-2",
    order: 1,
    title: "Target Reconnaissance & Host Discovery",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Before analyzing any target, verify network connectivity between your Kali Linux attack machine and the Metasploitable 2 virtual machine on your isolated host-only network.",
    objective:
      "Perform host discovery using ARP or ICMP ping from your Kali Linux terminal. Confirm that the target host is reachable and active.",
    guidance: [
      "Open a terminal in your Kali Linux VM.",
      "Check your own IP configuration with `ip addr show` or `ifconfig` to identify your subnet (e.g. 192.168.56.0/24).",
      "Run an ARP discovery scan with `sudo arp-scan -l` or `netdiscover -r <your_subnet>` to detect live hosts.",
      "Send an ICMP ping to the target IP to verify round-trip response: `ping -c 4 <TARGET_IP>`.",
      "Once you verify the host is responding, submit the discovery flag.",
    ],
    recommendedCommands: [
      {
        label: "Check Network Interface",
        command: "ip a",
        explanation: "Display your local IP address and subnet mask.",
      },
      {
        label: "Subnet ARP Scan",
        command: "sudo arp-scan -l",
        explanation: "Perform a quick Layer 2 ARP sweep on the local network interface.",
      },
      {
        label: "Verify Ping Response",
        command: "ping -c 4 192.168.56.101",
        explanation: "Send 4 ICMP echo packets to test connectivity.",
      },
    ],
    targetService: "ICMP / ARP (Network Layer)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{host_discovered_alive}",
    hints: [
      {
        id: 1,
        title: "Subnet Check",
        text: "Make sure both Kali Linux and Metasploitable 2 are configured in VirtualBox under Host-Only Adapter (e.g. vboxnet0) or the same NAT Network.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Keyword",
        text: "The flag acknowledges the host discovery status. Submit: LAB{host_discovered_alive}",
        penalty: 20,
      },
    ],
  },
  {
    id: "ms2-002",
    labId: "metasploitable-2",
    order: 2,
    title: "Find Open Ports & Attack Surface",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Metasploitable 2 hosts dozens of legacy network services intentionally exposed. Conduct a fast TCP port scan using Nmap to map out the target's open ports.",
    objective:
      "Run a SYN Stealth Scan (`nmap -sS`) against the target IP. Identify the classic File Transfer Protocol (FTP) port listening on the target.",
    guidance: [
      "Launch a TCP SYN scan with `sudo nmap -sS -Pn -T4 <TARGET_IP>` in Kali Linux.",
      "Inspect the standard ports (21, 22, 23, 25, 53, 80, 139, 445, 3306, 5432, etc.).",
      "Confirm that Port 21 is open with state 'open' and service 'ftp'.",
      "Format the flag as `LAB{ftp_found_21}`.",
    ],
    recommendedCommands: [
      {
        label: "SYN Stealth Scan",
        command: "sudo nmap -sS -Pn -T4 192.168.56.101",
        explanation: "Fast TCP SYN scan covering top 1000 ports without full three-way handshake.",
      },
      {
        label: "Full Port Scan",
        command: "sudo nmap -p- -T4 192.168.56.101",
        explanation: "Comprehensive scan across all 65,535 TCP ports.",
      },
    ],
    targetService: "TCP Port 21 (FTP)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{ftp_found_21}",
    hints: [
      {
        id: 1,
        title: "Scan Options",
        text: "Using `-Pn` skips host discovery ping and scans all specified ports directly.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Port 21 is open for FTP. The flag format is LAB{ftp_found_21}.",
        penalty: 20,
      },
    ],
  },
  {
    id: "ms2-003",
    labId: "metasploitable-2",
    order: 3,
    title: "Identify Running Services & Versions",
    category: "Enumeration",
    difficulty: "Easy",
    points: 100,
    description:
      "Port numbers only tell part of the story. Service banner grabbing and version detection (`-sV`) reveal the exact software release and builds running on the victim.",
    objective:
      "Execute an Nmap version scan against port 21. Determine the exact daemon name and version number running on the FTP port.",
    guidance: [
      "Run `nmap -sV -p 21 <TARGET_IP>` from Kali Linux.",
      "Observe the version column in the Nmap output.",
      "Notice the specific FTP daemon software (vsftpd) and its version tag.",
      "Construct the flag: `LAB{vsftpd_2.3.4}`.",
    ],
    recommendedCommands: [
      {
        label: "Service Version Detection",
        command: "nmap -sV -p 21,22,80,139,445 192.168.56.101",
        explanation: "Interrogates listening ports for service banners and protocol versions.",
      },
      {
        label: "Banner Grab with Netcat",
        command: "nc -vn 192.168.56.101 21",
        explanation: "Direct TCP banner grab to see raw greeting message.",
      },
    ],
    targetService: "vsftpd 2.3.4 (Port 21)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{vsftpd_2.3.4}",
    hints: [
      {
        id: 1,
        title: "Version flag in Nmap",
        text: "Use the `-sV` flag with Nmap to perform deep version detection probes.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Software Name",
        text: "The software is 'vsftpd' version '2.3.4'. Submit: LAB{vsftpd_2.3.4}",
        penalty: 20,
      },
    ],
  },
  {
    id: "ms2-004",
    labId: "metasploitable-2",
    order: 4,
    title: "FTP Enumeration & Anonymous Access",
    category: "Enumeration",
    difficulty: "Easy",
    points: 100,
    description:
      "FTP servers frequently suffer from misconfigurations such as unauthenticated anonymous logins allowing arbitrary file reads.",
    objective:
      "Test for anonymous FTP access on Port 21 using standard FTP client or Nmap NSE script `ftp-anon`.",
    guidance: [
      "Run `ftp <TARGET_IP>` from your Kali Linux shell.",
      "When prompted for Name, type `anonymous`.",
      "When prompted for Password, type any email or press Enter (e.g. `anonymous@example.com`).",
      "Check if login succeeds with code `230 Login successful`.",
      "Alternatively, run: `nmap --script ftp-anon -p 21 <TARGET_IP>`.",
      "Submit the flag confirming anonymous access is enabled.",
    ],
    recommendedCommands: [
      {
        label: "Interactive FTP Login",
        command: "ftp 192.168.56.101",
        explanation: "Connect to the FTP daemon interactively with username 'anonymous'.",
      },
      {
        label: "Nmap FTP Anon Script",
        command: "nmap --script ftp-anon -p 21 192.168.56.101",
        explanation: "Automated NSE script to test for anonymous FTP read/write permissions.",
      },
    ],
    targetService: "FTP Anonymous Login (Port 21)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{anonymous_access_enabled}",
    hints: [
      {
        id: 1,
        title: "Default Credentials",
        text: "Anonymous FTP login typically accepts username 'anonymous' or 'ftp' with blank password.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Content",
        text: "Flag confirms status: LAB{anonymous_access_enabled}",
        penalty: 20,
      },
    ],
  },
  {
    id: "ms2-005",
    labId: "metasploitable-2",
    order: 5,
    title: "SSH & Telnet Service Exploration",
    category: "Enumeration",
    difficulty: "Medium",
    points: 150,
    description:
      "Legacy remote management protocols like Telnet (Port 23) transmit all keystrokes in plaintext, while SSH (Port 22) offers encrypted remote terminal access.",
    objective:
      "Connect to Port 23 using Telnet or Netcat. Observe the target banner information and identify the operating system release displayed.",
    guidance: [
      "Run `telnet <TARGET_IP>` or `nc -vn <TARGET_IP> 23` from your Kali Linux VM.",
      "Examine the greeting banner: `Ubuntu 8.04 - Linux 2.6.24-16-server`.",
      "Notice how unencrypted services expose OS versions directly to unauthenticated clients.",
      "Submit the flag representing the banner discovery.",
    ],
    recommendedCommands: [
      {
        label: "Telnet Connection",
        command: "telnet 192.168.56.101",
        explanation: "Establish interactive cleartext telnet session.",
      },
      {
        label: "SSH Banner Grab",
        command: "nc -vn 192.168.56.101 22",
        explanation: "Grab OpenSSH protocol version string.",
      },
    ],
    targetService: "Telnet (Port 23) & SSH (Port 22)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{telnet_banner_detected}",
    hints: [
      {
        id: 1,
        title: "Banner Grabbing",
        text: "Telnet displays system MOTD and release information before prompting for login credentials.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Expected Flag",
        text: "The flag is: LAB{telnet_banner_detected}",
        penalty: 30,
      },
    ],
  },
  {
    id: "ms2-006",
    labId: "metasploitable-2",
    order: 6,
    title: "HTTP Web Directory Enumeration",
    category: "Enumeration",
    difficulty: "Medium",
    points: 150,
    description:
      "Metasploitable 2 runs an Apache 2.2.8 web server on Port 80 hosting multiple pre-installed vulnerable web applications.",
    objective:
      "Use directory brute-forcing tools (e.g. `gobuster`, `dirb`, or `ffuf`) or browser navigation on Port 80 to discover hidden web paths.",
    guidance: [
      "Open your browser in Kali Linux and navigate to `http://<TARGET_IP>/`.",
      "Notice the landing page linking to `/mutillidae`, `/dvwa`, `/phpMyAdmin`, `/twiki`, and `/dav`.",
      "Run `gobuster dir -u http://<TARGET_IP>/ -w /usr/share/wordlists/dirb/common.txt` to discover web directories.",
      "Identify the administrative database management tool (`/phpMyAdmin`) and training suite (`/mutillidae`).",
      "Submit the flag: `LAB{phpmyadmin_mutillidae_found}`.",
    ],
    recommendedCommands: [
      {
        label: "Gobuster Directory Scan",
        command: "gobuster dir -u http://192.168.56.101/ -w /usr/share/wordlists/dirb/common.txt",
        explanation: "Enumerate HTTP URIs on target web server.",
      },
      {
        label: "WhatWeb Analysis",
        command: "whatweb http://192.168.56.101/",
        explanation: "Identify web technologies, CMS, server headers, and PHP versions.",
      },
    ],
    targetService: "Apache 2.2.8 / PHP 5.2.4 (Port 80)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{phpmyadmin_mutillidae_found}",
    hints: [
      {
        id: 1,
        title: "Wordlists in Kali",
        text: "Common directory wordlists are located under `/usr/share/wordlists/dirb/` and `/usr/share/wordlists/dirbuster/`.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{phpmyadmin_mutillidae_found}",
        penalty: 30,
      },
    ],
  },
  {
    id: "ms2-007",
    labId: "metasploitable-2",
    order: 7,
    title: "Vulnerability Identification & CVE Lookup",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 200,
    description:
      "Armed with our service versions (vsftpd 2.3.4), search offline and online vulnerability databases for known public CVEs and backdoor advisories.",
    objective:
      "Use `searchsploit` in Kali Linux to search for exploits targeting `vsftpd 2.3.4`. Identify the CVE identifier associated with the Smiley Face backdoor.",
    guidance: [
      "Open Kali Linux terminal and run: `searchsploit vsftpd 2.3.4`.",
      "Read the exploit description: `vsftpd 2.3.4 - Backdoor Command Execution`.",
      "Check the CVE database for this vulnerability: CVE-2011-2523.",
      "Understand why it occurred: an unauthorized backdoor was inserted into the vsftpd download archive in July 2011 triggering on a `:)` username string.",
      "Submit the flag containing the CVE identifier: `LAB{cve_2011_2523_backdoor}`.",
    ],
    recommendedCommands: [
      {
        label: "Searchsploit Query",
        command: "searchsploit vsftpd 2.3.4",
        explanation: "Query offline Exploit-DB archive for known vulnerabilities.",
      },
      {
        label: "Nmap Vulnerability Scan",
        command: "nmap --script vuln -p 21 192.168.56.101",
        explanation: "Check port 21 against Nmap vulnerability signature database.",
      },
    ],
    targetService: "Exploit-DB / CVE-2011-2523",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{cve_2011_2523_backdoor}",
    hints: [
      {
        id: 1,
        title: "CVE Format",
        text: "The CVE year for this incident is 2011 and the ID is 2523.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{cve_2011_2523_backdoor}",
        penalty: 40,
      },
    ],
  },
  {
    id: "ms2-008",
    labId: "metasploitable-2",
    order: 8,
    title: "Initial Access Mechanism Inspection",
    category: "Initial Access",
    difficulty: "Medium",
    points: 200,
    description:
      "Understand how the vsftpd 2.3.4 backdoor operates at the protocol level. When a username ending in `:)` is provided, the daemon spawns a bind shell on TCP port 6200 with root privileges.",
    objective:
      "Analyze the backdoor mechanism. When triggered, identify the specific TCP high port opened by the daemon.",
    guidance: [
      "In Kali Linux, you can interact with port 21 manually via Netcat: `nc <TARGET_IP> 21`.",
      "Send `USER test:)` followed by `PASS anything`.",
      "The backdoor code checks if `:)` is in the user string, and if so, opens a listening socket on TCP port 6200.",
      "Connecting to port 6200 with `nc <TARGET_IP> 6200` yields a root shell (`id` -> `uid=0(root)`).",
      "Format the flag as `LAB{root_shell_port_6200}`.",
    ],
    recommendedCommands: [
      {
        label: "Manual Trigger (Educational)",
        command: "nc 192.168.56.101 21",
        explanation: "Send USER trigger string to understand protocol vulnerability.",
      },
      {
        label: "Check Bind Port",
        command: "nc -vn 192.168.56.101 6200",
        explanation: "Connect to the listening bindshell port spawned by the backdoor.",
      },
    ],
    targetService: "TCP Port 6200 (Backdoor Bind Shell)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{root_shell_port_6200}",
    hints: [
      {
        id: 1,
        title: "Backdoor Port",
        text: "The hardcoded port in the vsftpd 2.3.4 backdoor source code is 6200.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{root_shell_port_6200}",
        penalty: 40,
      },
    ],
  },
  {
    id: "ms2-009",
    labId: "metasploitable-2",
    order: 9,
    title: "Privilege Escalation & SUID Binaries",
    category: "Privilege Escalation",
    difficulty: "Hard",
    points: 250,
    description:
      "Even when initial access is gained as a low-privileged user (e.g. `www-data` or `msfadmin`), Linux misconfigurations like SUID binaries allow vertical privilege escalation to root.",
    objective:
      "Investigate SUID binaries on Linux targets. Identify the legacy network scanner binary on Metasploitable 2 configured with SUID permissions allowing interactive shell escape (`!sh`).",
    guidance: [
      "On a Linux terminal session, search for SUID binaries with: `find / -perm -u=s -type f 2>/dev/null`.",
      "Notice the `/usr/bin/nmap` binary (version 4.53).",
      "In older Nmap releases (2.02 to 5.21), Nmap featured an interactive mode (`nmap --interactive`).",
      "Inside interactive mode, typing `!sh` executes a subshell under the SUID owner's privileges (`root`).",
      "Submit the flag representing this classic SUID vector: `LAB{suid_nmap_interactive}`.",
    ],
    recommendedCommands: [
      {
        label: "Find SUID Binaries",
        command: "find / -perm -u=s -type f 2>/dev/null",
        explanation: "Enumerate all executables running with setuid bit enabled.",
      },
      {
        label: "Nmap Interactive Shell Escape",
        command: "/usr/bin/nmap --interactive",
        explanation: "Historic SUID privilege escalation vector in Nmap < 5.21.",
      },
    ],
    targetService: "SUID Binary (/usr/bin/nmap)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{suid_nmap_interactive}",
    hints: [
      {
        id: 1,
        title: "GTFOBins Reference",
        text: "Check GTFOBins for 'nmap'. Vintage Nmap binaries support interactive mode (`--interactive`).",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{suid_nmap_interactive}",
        penalty: 50,
      },
    ],
  },
  {
    id: "ms2-010",
    labId: "metasploitable-2",
    order: 10,
    title: "Capture Root Flag & Post-Exploitation",
    category: "Flags",
    difficulty: "Hard",
    points: 300,
    description:
      "You have completed the full assessment chain from reconnaissance and enumeration to vulnerability analysis, exploitation verification, and privilege escalation.",
    objective:
      "Confirm root access by verifying root capabilities on the target (`whoami` -> `root`) and submit the master completion flag.",
    guidance: [
      "From your root shell on the target, verify `id` returns `uid=0(root) gid=0(root)`.",
      "Inspect `/etc/shadow` or `/root` directory to verify administrative control.",
      "Review the security lessons learned: disable obsolete services, enforce least privilege, remove SUID bits, and restrict network perimeter access.",
      "Submit the master root flag to finish the Metasploitable 2 practice module!",
    ],
    recommendedCommands: [
      {
        label: "Verify Root Identity",
        command: "id && whoami",
        explanation: "Check effective user ID is root (uid 0).",
      },
      {
        label: "Inspect System Shadow",
        command: "head -n 5 /etc/shadow",
        explanation: "Test reading restricted shadow password file as root.",
      },
    ],
    targetService: "Root Account (/root)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{root_pwned_cyberlab_master}",
    hints: [
      {
        id: 1,
        title: "Master Flag",
        text: "The final master flag confirms full lab pwnage: LAB{root_pwned_cyberlab_master}.",
        penalty: 30,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{root_pwned_cyberlab_master}",
        penalty: 60,
      },
    ],
  },

  // ==========================================
  // OWASP JUICE SHOP LAB (10 CHALLENGES)
  // ==========================================
  {
    id: "js-001",
    labId: "owasp-juice-shop",
    order: 1,
    title: "Score Board & Hidden Route Discovery",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "OWASP Juice Shop contains a hidden Score Board tracking all challenge completions, but its link is intentionally excluded from the default navigation menu.",
    objective:
      "Inspect client-side Angular/JavaScript source files in browser DevTools or enumerate SPA client routes to discover the hidden Score Board URL route.",
    guidance: [
      "Open your browser and navigate to `http://<TARGET_IP>:3000/`.",
      "Press `F12` to open Developer Tools and navigate to the Sources tab.",
      "Search JavaScript assets for the keyword 'score-board'.",
      "Notice the route `/#/score-board`.",
      "Navigate to `http://<TARGET_IP>:3000/#/score-board` in your browser.",
      "Submit the flag confirming score board discovery.",
    ],
    recommendedCommands: [
      {
        label: "Inspect Frontend Routes",
        command: "curl -s http://192.168.56.102:3000/main.js | grep -o 'score-board'",
        explanation: "Inspect bundled frontend JavaScript for unlisted client routing endpoints.",
      },
    ],
    targetService: "HTTP / SPA Routing (Port 3000)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{score_board_unhidden}",
    hints: [
      {
        id: 1,
        title: "Client-side Route",
        text: "Single Page Applications often declare client routes inside the frontend JS bundle. Look for 'score-board'.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{score_board_unhidden}",
        penalty: 20,
      },
    ],
  },
  {
    id: "js-002",
    labId: "owasp-juice-shop",
    order: 2,
    title: "Confidential Document Leak via Directory Traversal",
    category: "Enumeration",
    difficulty: "Easy",
    points: 100,
    description:
      "Publicly accessible endpoints (such as static asset or document download folders) can inadvertently expose confidential business files.",
    objective:
      "Access the `/ftp` folder on Juice Shop and retrieve the confidential acquisitions document or legal disclosure markdown file.",
    guidance: [
      "Navigate to `http://<TARGET_IP>:3000/ftp` in your browser.",
      "Observe the directory listing displaying files like `acquisitions.md` and `legal.md`.",
      "Click to download `acquisitions.md` or test null byte encoding.",
      "Review the leaked confidential data.",
      "Submit the flag: `LAB{confidential_document_retrieved}`.",
    ],
    recommendedCommands: [
      {
        label: "Download FTP Assets",
        command: "curl -s http://192.168.56.102:3000/ftp/acquisitions.md",
        explanation: "Fetch the confidential markdown file directly over HTTP.",
      },
    ],
    targetService: "Static File Server (/ftp)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{confidential_document_retrieved}",
    hints: [
      {
        id: 1,
        title: "Direct URL",
        text: "The path `/ftp/legal.md` or `/ftp/acquisitions.md` directly serves static files.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{confidential_document_retrieved}",
        penalty: 20,
      },
    ],
  },
  {
    id: "js-003",
    labId: "owasp-juice-shop",
    order: 3,
    title: "SQL Injection Login Authentication Bypass",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "The user login endpoint constructs SQL queries by concatenating raw user input into an SQLite query without parameterized statements.",
    objective:
      "Use SQL Injection in the Email field on the Login page to authenticate as the Administrator without knowing their password.",
    guidance: [
      "Open Juice Shop and go to the Login page (`/#/login`).",
      "In the Email field, enter the classic SQL injection string: `' OR 1=1--`.",
      "Enter any password into the Password field.",
      "Click Log in.",
      "Notice that you are authenticated as `admin@juice-sh.op` with administrator privileges.",
      "Submit the flag: `LAB{admin_sqli_auth_bypass}`.",
    ],
    recommendedCommands: [
      {
        label: "Test Login Query",
        command: "curl -X POST http://192.168.56.102:3000/rest/user/login -H 'Content-Type: application/json' -d '{\"email\":\"admin@juice-sh.op\",\"password\":\"test\"}'",
        explanation: "Test login authentication endpoint.",
      },
    ],
    targetService: "SQLite / REST API (/rest/user/login)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{admin_sqli_auth_bypass}",
    hints: [
      {
        id: 1,
        title: "Quote and Comment",
        text: "In SQLite, `--` comments out the remainder of the query: `' OR 1=1--`.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{admin_sqli_auth_bypass}",
        penalty: 30,
      },
    ],
  },
  {
    id: "js-004",
    labId: "owasp-juice-shop",
    order: 4,
    title: "Reflected Cross-Site Scripting (XSS)",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "When untrusted search parameters are reflected directly in the DOM without sanitization, script tags can execute in the victim's session.",
    objective:
      "Execute an XSS payload inside the Juice Shop search bar or order tracking query.",
    guidance: [
      "Click the search icon in the navigation bar.",
      "Enter an iframe XSS payload into the search field and press Enter.",
      "Observe the script reflection in the search result header.",
      "Submit the flag: `LAB{reflected_xss_in_search}`.",
    ],
    recommendedCommands: [
      {
        label: "Test Search Query Reflection",
        command: "curl -s 'http://192.168.56.102:3000/rest/products/search?q=test'",
        explanation: "Observe product query results.",
      },
    ],
    targetService: "Search Component / Product REST API",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{reflected_xss_in_search}",
    hints: [
      {
        id: 1,
        title: "Bypassing Filter",
        text: "If script tags are filtered, iframe or image onerror handlers can trigger reflection.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{reflected_xss_in_search}",
        penalty: 30,
      },
    ],
  },
  {
    id: "js-005",
    labId: "owasp-juice-shop",
    order: 5,
    title: "DOM-Based XSS in Search Header",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "DOM XSS arises when client-side script writes data from a source directly to an insecure sink in the browser document.",
    objective:
      "Identify the DOM sink in the client application and trigger DOM XSS using an unencoded query string.",
    guidance: [
      "Navigate to the search page or language selector.",
      "Inspect client JavaScript handling of location parameters.",
      "Verify DOM script execution.",
      "Submit the flag: `LAB{dom_xss_sanitization_bypass}`.",
    ],
    recommendedCommands: [
      {
        label: "DOM Source Inspection",
        command: "curl -s http://192.168.56.102:3000/",
        explanation: "Check client sink points writing user parameters.",
      },
    ],
    targetService: "DOM Client Rendering / Angular",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{dom_xss_sanitization_bypass}",
    hints: [
      {
        id: 1,
        title: "SVG Payload",
        text: "SVG event handlers execute when parsed into the client DOM tree.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{dom_xss_sanitization_bypass}",
        penalty: 30,
      },
    ],
  },
  {
    id: "js-006",
    labId: "owasp-juice-shop",
    order: 6,
    title: "Broken Access Control & Admin View Access",
    category: "Initial Access",
    difficulty: "Medium",
    points: 200,
    description:
      "Client-side role checks without proper backend route authorization allow unauthorized users to view administrative interfaces.",
    objective:
      "Navigate directly to the hidden Administration panel (`/#/administration`) and inspect user accounts and customer feedback.",
    guidance: [
      "Log in or navigate directly in your browser.",
      "Navigate to `http://<TARGET_IP>:3000/#/administration`.",
      "View the registered user accounts and customer feedback tables.",
      "Submit the flag: `LAB{admin_portal_accessed}`.",
    ],
    recommendedCommands: [
      {
        label: "Check Admin Route",
        command: "curl -s http://192.168.56.102:3000/api/Users/",
        explanation: "Check users endpoint status.",
      },
    ],
    targetService: "Admin Panel (/#/administration)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{admin_portal_accessed}",
    hints: [
      {
        id: 1,
        title: "Admin URI",
        text: "The administration UI route is simply `/#/administration`.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{admin_portal_accessed}",
        penalty: 40,
      },
    ],
  },
  {
    id: "js-007",
    labId: "owasp-juice-shop",
    order: 7,
    title: "Basket Tampering & Insecure Direct Object Reference (IDOR)",
    category: "Initial Access",
    difficulty: "Medium",
    points: 200,
    description:
      "Insecure Direct Object References (IDOR) occur when an application provides direct access to objects based on user-supplied input without verifying permissions.",
    objective:
      "Intercept the shopping basket request in Burp Suite / DevTools. Change the Basket ID to view another customer's shopping cart.",
    guidance: [
      "Add an item to your basket in Juice Shop.",
      "Open Burp Suite HTTP Proxy or browser Network tab.",
      "Observe the request: `GET /rest/basket/<ID>`.",
      "Change the ID parameter from your own ID to `1` (the Admin's basket).",
      "Notice that the server returns the contents of another user's cart without authorization checks.",
      "Submit the flag: `LAB{idor_basket_tampered}`.",
    ],
    recommendedCommands: [
      {
        label: "Query Basket ID",
        command: "curl -s http://192.168.56.102:3000/rest/basket/1",
        explanation: "Directly inspect Basket #1 endpoint.",
      },
    ],
    targetService: "REST Basket API (/rest/basket/:id)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{idor_basket_tampered}",
    hints: [
      {
        id: 1,
        title: "Numeric Parameter",
        text: "The basket ID is an integer in the REST endpoint path (`/rest/basket/<ID>`).",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{idor_basket_tampered}",
        penalty: 40,
      },
    ],
  },
  {
    id: "js-008",
    labId: "owasp-juice-shop",
    order: 8,
    title: "Password Reset via Security Question Enumeration",
    category: "Privilege Escalation",
    difficulty: "Hard",
    points: 250,
    description:
      "Predictable security questions allow attackers to reset user passwords without email confirmation tokens.",
    objective:
      "Reset the password of user account `bender@juice-sh.op` by solving his security question.",
    guidance: [
      "Go to the Forgot Password page (`/#/forgot-password`).",
      "Enter email `bender@juice-sh.op`.",
      "Observe the security question: 'Name of your favorite pet?'.",
      "Enter the security answer and set a new password.",
      "Submit the flag: `LAB{security_question_cracked}`.",
    ],
    recommendedCommands: [
      {
        label: "Query Security Questions",
        command: "curl -s 'http://192.168.56.102:3000/api/SecurityQuestions/'",
        explanation: "List predefined security questions from the backend.",
      },
    ],
    targetService: "Password Reset API (/rest/user/reset-password)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{security_question_cracked}",
    hints: [
      {
        id: 1,
        title: "Security Answer",
        text: "The security answer for Bender's pet is a simple name (e.g. Stop).",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{security_question_cracked}",
        penalty: 50,
      },
    ],
  },
  {
    id: "js-009",
    labId: "owasp-juice-shop",
    order: 9,
    title: "Mass Assignment & Registration Role Escalation",
    category: "Privilege Escalation",
    difficulty: "Hard",
    points: 250,
    description:
      "When an API automatically binds HTTP JSON properties directly to internal models, attackers can inject unauthorized fields like `role: 'admin'`.",
    objective:
      "Intercept the user registration POST request in Burp Suite and inject `role: 'admin'` to create an administrative account.",
    guidance: [
      "Open User Registration in Juice Shop.",
      "Intercept the POST request to `/api/Users/` using Burp Suite.",
      "In the JSON body, add: `\"role\": \"admin\"` alongside email and password.",
      "Forward the request and log into the newly created account.",
      "Submit the flag: `LAB{registration_role_escalated}`.",
    ],
    recommendedCommands: [
      {
        label: "Test User Registration",
        command: "curl -X POST http://192.168.56.102:3000/api/Users/ -H 'Content-Type: application/json' -d '{\"email\":\"test@test.local\",\"password\":\"pass\"}'",
        explanation: "Test user registration JSON structure.",
      },
    ],
    targetService: "User Model / REST API (/api/Users/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{registration_role_escalated}",
    hints: [
      {
        id: 1,
        title: "JSON Parameter",
        text: "Add role: admin into the registration JSON payload.",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{registration_role_escalated}",
        penalty: 50,
      },
    ],
  },
  {
    id: "js-010",
    labId: "owasp-juice-shop",
    order: 10,
    title: "Server-Side Request Forgery (SSRF) & Master Flag",
    category: "Flags",
    difficulty: "Hard",
    points: 300,
    description:
      "Server-Side Request Forgery allows an attacker to coerce the backend server to make unauthorized requests to internal network services.",
    objective:
      "Exploit an external URL fetcher to probe internal services and capture the master Juice Shop flag.",
    guidance: [
      "Inspect profile image upload or tracking URL endpoints.",
      "Supply an internal loopback URL or metadata endpoint.",
      "Review the comprehensive OWASP Top 10 vulnerabilities conquered throughout this lab.",
      "Submit the master Juice Shop flag to complete the module!",
    ],
    recommendedCommands: [
      {
        label: "Test Profile Image Fetcher",
        command: "curl -X POST http://192.168.56.102:3000/profile/image/url -H 'Content-Type: application/json' -d '{\"imageUrl\":\"http://localhost:3000/\"}'",
        explanation: "Probe loopback address via server-side image crawler.",
      },
    ],
    targetService: "Profile URL / Internal Services",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{ssrf_internal_probe_success}",
    hints: [
      {
        id: 1,
        title: "SSRF Master Flag",
        text: "Final master flag for OWASP Juice Shop: LAB{ssrf_internal_probe_success}.",
        penalty: 30,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{ssrf_internal_probe_success}",
        penalty: 60,
      },
    ],
  },

  // ==========================================
  // DVWA LAB (10 CHALLENGES)
  // ==========================================
  {
    id: "dvwa-001",
    labId: "dvwa",
    order: 1,
    title: "Default Credentials & Initial Setup",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Damn Vulnerable Web App (DVWA) is a classic PHP/MySQL security testbed initialized with well-known default credentials.",
    objective:
      "Access the DVWA login portal, authenticate using default credentials (`admin:password`), and set security level to Low.",
    guidance: [
      "Open your browser and navigate to `http://<TARGET_IP>/dvwa/login.php`.",
      "Log in with default username `admin` and password `password`.",
      "If database setup is required, navigate to `setup.php` and click Create / Reset Database.",
      "Go to DVWA Security in the left menu and set Security Level to Low.",
      "Submit the confirmation flag: `LAB{dvwa_admin_logged_in}`.",
    ],
    recommendedCommands: [
      {
        label: "Check DVWA HTTP Status",
        command: "curl -I http://192.168.56.103/dvwa/login.php",
        explanation: "Verify DVWA web server response headers and cookies.",
      },
    ],
    targetService: "DVWA Auth Portal (/dvwa/login.php)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{dvwa_admin_logged_in}",
    hints: [
      {
        id: 1,
        title: "Default Passwords",
        text: "The default DVWA password for user 'admin' is 'password'.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{dvwa_admin_logged_in}",
        penalty: 20,
      },
    ],
  },
  {
    id: "dvwa-002",
    labId: "dvwa",
    order: 2,
    title: "OS Command Injection & /etc/passwd",
    category: "Vulnerability Analysis",
    difficulty: "Easy",
    points: 100,
    description:
      "When scripts execute system commands without sanitizing input, command chaining separators allow arbitrary shell execution.",
    objective:
      "Navigate to the Command Injection page in DVWA. Use command separators to read system user accounts.",
    guidance: [
      "Click Command Injection in the DVWA menu.",
      "Enter the payload: `127.0.0.1; id` or `127.0.0.1; whoami` into the IP address field.",
      "Click Submit.",
      "Observe the command execution output printed directly in the browser.",
      "Submit the flag: `LAB{cmd_injection_passwd_read}`.",
    ],
    recommendedCommands: [
      {
        label: "Test Command Injection",
        command: "curl -s 'http://192.168.56.103/dvwa/vulnerabilities/exec/?ip=127.0.0.1&Submit=Submit'",
        explanation: "Send ping test parameter.",
      },
    ],
    targetService: "PHP Command Exec (/vulnerabilities/exec/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{cmd_injection_passwd_read}",
    hints: [
      {
        id: 1,
        title: "Command Separators",
        text: "In Unix shells, semicolon or double ampersand executes a secondary command.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{cmd_injection_passwd_read}",
        penalty: 20,
      },
    ],
  },
  {
    id: "dvwa-003",
    labId: "dvwa",
    order: 3,
    title: "Local File Inclusion (LFI)",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "Local File Inclusion (LFI) allows an attacker to read arbitrary server files by manipulating file path parameters passed into file include functions.",
    objective:
      "Navigate to the File Inclusion page. Traverse directories using relative path notation to inspect system files.",
    guidance: [
      "Click File Inclusion in the DVWA menu.",
      "Inspect the URL parameter `page=include.php`.",
      "Modify the parameter to traverse upwards.",
      "Verify file inclusion behavior.",
      "Submit the flag: `LAB{lfi_etc_passwd_extracted}`.",
    ],
    recommendedCommands: [
      {
        label: "LFI Request via Curl",
        command: "curl -s 'http://192.168.56.103/dvwa/vulnerabilities/fi/?page=include.php'",
        explanation: "Query file inclusion endpoint.",
      },
    ],
    targetService: "File Inclusion Handler (/vulnerabilities/fi/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{lfi_etc_passwd_extracted}",
    hints: [
      {
        id: 1,
        title: "Dot-Dot-Slash",
        text: "Use directory traversal sequences to reference parent folders.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{lfi_etc_passwd_extracted}",
        penalty: 30,
      },
    ],
  },
  {
    id: "dvwa-004",
    labId: "dvwa",
    order: 4,
    title: "SQL Injection & Password Hash Extraction",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "A classic SQL Injection vulnerability in the User ID search form allows attackers to execute UNION queries and extract sensitive database tables.",
    objective:
      "Use a UNION SELECT injection (`1' UNION SELECT user, password FROM users #`) to dump usernames and password hashes from MySQL.",
    guidance: [
      "Click SQL Injection in the DVWA menu.",
      "In the User ID field, enter: `1' UNION SELECT user, password FROM users #`.",
      "Click Submit.",
      "Observe all user accounts (admin, gordonb, 1337) and password hashes.",
      "Submit the flag: `LAB{sqli_users_hashes_dumped}`.",
    ],
    recommendedCommands: [
      {
        label: "SQL Injection Query",
        command: "curl -s 'http://192.168.56.103/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit'",
        explanation: "Test SQL query endpoint.",
      },
    ],
    targetService: "MySQL / Database (/vulnerabilities/sqli/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{sqli_users_hashes_dumped}",
    hints: [
      {
        id: 1,
        title: "Column Count",
        text: "The query returns 2 columns: First Name and Surname.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{sqli_users_hashes_dumped}",
        penalty: 30,
      },
    ],
  },
  {
    id: "dvwa-005",
    labId: "dvwa",
    order: 5,
    title: "Blind SQL Injection (Boolean-Based)",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 150,
    description:
      "Blind SQL Injection occurs when database output is not printed directly, but application responses differ between TRUE and FALSE conditions.",
    objective:
      "Navigate to SQL Injection (Blind). Use boolean conditions (`1' AND 1=1 #` vs `1' AND 1=2 #`) to infer database state.",
    guidance: [
      "Click SQL Injection (Blind) in DVWA.",
      "Submit `1' AND 1=1 #` -> response confirms user exists.",
      "Submit `1' AND 1=2 #` -> response indicates missing user.",
      "Confirm boolean and time-based inference.",
      "Submit the flag: `LAB{blind_sqli_boolean_confirmed}`.",
    ],
    recommendedCommands: [
      {
        label: "Blind Test Query",
        command: "curl -s 'http://192.168.56.103/dvwa/vulnerabilities/sqli_blind/?id=1&Submit=Submit'",
        explanation: "Test blind SQL injection endpoint.",
      },
    ],
    targetService: "MySQL Blind Engine (/vulnerabilities/sqli_blind/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{blind_sqli_boolean_confirmed}",
    hints: [
      {
        id: 1,
        title: "Boolean Logic",
        text: "Boolean blind checks whether the server response contains 'User ID exists'.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{blind_sqli_boolean_confirmed}",
        penalty: 30,
      },
    ],
  },
  {
    id: "dvwa-006",
    labId: "dvwa",
    order: 6,
    title: "Stored Cross-Site Scripting (XSS)",
    category: "Initial Access",
    difficulty: "Medium",
    points: 200,
    description:
      "Stored XSS occurs when malicious input is saved persistently in the database and executed whenever any user views the infected page.",
    objective:
      "Navigate to XSS (Stored) (Guestbook). Inject a persistent JavaScript payload into the Message field.",
    guidance: [
      "Click XSS (Stored) in the DVWA menu.",
      "In the Message field, enter a script payload.",
      "Click Sign Guestbook.",
      "Observe that the script triggers persistently upon page reload.",
      "Submit the flag: `LAB{stored_xss_guestbook_pwned}`.",
    ],
    recommendedCommands: [
      {
        label: "Inspect Guestbook",
        command: "curl -s http://192.168.56.103/dvwa/vulnerabilities/xss_s/",
        explanation: "Query stored XSS guestbook page.",
      },
    ],
    targetService: "Guestbook Database (/vulnerabilities/xss_s/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{stored_xss_guestbook_pwned}",
    hints: [
      {
        id: 1,
        title: "Guestbook Input",
        text: "Inject script into the Message textarea without client length restrictions.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{stored_xss_guestbook_pwned}",
        penalty: 40,
      },
    ],
  },
  {
    id: "dvwa-007",
    labId: "dvwa",
    order: 7,
    title: "Reflected Cross-Site Scripting (XSS)",
    category: "Initial Access",
    difficulty: "Medium",
    points: 200,
    description:
      "Reflected XSS occurs when user input sent via GET parameters is immediately echoed in the HTTP response body without encoding.",
    objective:
      "Navigate to XSS (Reflected) in DVWA. Inject a script payload into the name parameter.",
    guidance: [
      "Click XSS (Reflected) in DVWA.",
      "Enter a script payload in the 'What is your name?' field.",
      "Click Submit.",
      "Review the page source to see the unescaped script tag in the HTML stream.",
      "Submit the flag: `LAB{reflected_xss_dvwa_verified}`.",
    ],
    recommendedCommands: [
      {
        label: "Reflected Query Check",
        command: "curl -s 'http://192.168.56.103/dvwa/vulnerabilities/xss_r/?name=User'",
        explanation: "Verify reflected parameter reflection.",
      },
    ],
    targetService: "Reflected Query Handler (/vulnerabilities/xss_r/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{reflected_xss_dvwa_verified}",
    hints: [
      {
        id: 1,
        title: "Payload Syntax",
        text: "In Low security mode, script tags execute without server-side filtering.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{reflected_xss_dvwa_verified}",
        penalty: 40,
      },
    ],
  },
  {
    id: "dvwa-008",
    labId: "dvwa",
    order: 8,
    title: "Arbitrary File Upload & Web Execution",
    category: "Privilege Escalation",
    difficulty: "Hard",
    points: 250,
    description:
      "Insecure file upload forms that fail to validate file extensions or MIME types allow attackers to upload executable scripts.",
    objective:
      "Navigate to File Upload. Upload a test script file and verify execution via the uploads directory path.",
    guidance: [
      "Click File Upload in DVWA.",
      "Upload a test file through the form.",
      "Note the upload confirmation path in `hackable/uploads/`.",
      "Access the uploaded file via your browser.",
      "Submit the flag: `LAB{webshell_upload_executed}`.",
    ],
    recommendedCommands: [
      {
        label: "Check Uploads Directory",
        command: "curl -I http://192.168.56.103/dvwa/hackable/uploads/",
        explanation: "Verify accessibility of uploads folder.",
      },
    ],
    targetService: "File Upload (/vulnerabilities/upload/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{webshell_upload_executed}",
    hints: [
      {
        id: 1,
        title: "Upload Location",
        text: "Uploaded files are placed under `/dvwa/hackable/uploads/`.",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{webshell_upload_executed}",
        penalty: 50,
      },
    ],
  },
  {
    id: "dvwa-009",
    labId: "dvwa",
    order: 9,
    title: "Insecure CAPTCHA Bypass",
    category: "Privilege Escalation",
    difficulty: "Hard",
    points: 250,
    description:
      "Multi-step verification workflows that rely on client-side parameters without enforcing validation on the server can be bypassed.",
    objective:
      "Navigate to Insecure CAPTCHA. Intercept the password change request and manipulate parameters to bypass verification.",
    guidance: [
      "Click Insecure CAPTCHA in DVWA.",
      "Attempt to change the password.",
      "Intercept the HTTP POST in Burp Suite.",
      "Send parameter step=2 and passed_captcha=true directly.",
      "Confirm password change succeeds without solving the CAPTCHA.",
      "Submit the flag: `LAB{captcha_step2_bypassed}`.",
    ],
    recommendedCommands: [
      {
        label: "Check CAPTCHA Endpoint",
        command: "curl -s http://192.168.56.103/dvwa/vulnerabilities/captcha/",
        explanation: "Query CAPTCHA form page.",
      },
    ],
    targetService: "CAPTCHA Workflow (/vulnerabilities/captcha/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{captcha_step2_bypassed}",
    hints: [
      {
        id: 1,
        title: "Step 2 Parameter",
        text: "The server processes password changes directly if step=2 is sent.",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{captcha_step2_bypassed}",
        penalty: 50,
      },
    ],
  },
  {
    id: "dvwa-010",
    labId: "dvwa",
    order: 10,
    title: "Weak Session IDs & DVWA Master Flag",
    category: "Flags",
    difficulty: "Hard",
    points: 300,
    description:
      "Predictable session token generation allows attackers to easily hijack sessions belonging to other authenticated users.",
    objective:
      "Navigate to Weak Session IDs. Analyze how session cookies are generated and capture the DVWA Master completion flag.",
    guidance: [
      "Click Weak Session IDs in DVWA.",
      "Click Generate multiple times while inspecting cookie headers.",
      "Notice the predictable integer progression.",
      "Review the 10 web exploitation lessons completed across DVWA.",
      "Submit the master DVWA flag to complete the lab!",
    ],
    recommendedCommands: [
      {
        label: "Inspect Session Cookie Header",
        command: "curl -I http://192.168.56.103/dvwa/vulnerabilities/weak_id/",
        explanation: "Check Set-Cookie header for predictable session token.",
      },
    ],
    targetService: "Session Manager (/vulnerabilities/weak_id/)",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{weak_session_id_hijacked}",
    hints: [
      {
        id: 1,
        title: "Master Flag",
        text: "The final master flag for DVWA is: LAB{weak_session_id_hijacked}.",
        penalty: 30,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{weak_session_id_hijacked}",
        penalty: 60,
      },
    ],
  },

  // ==========================================
  // OSINT & THREAT INTELLIGENCE LAB (10 CHALLENGES)
  // ==========================================
  {
    id: "osint-001",
    labId: "osint-recon",
    order: 1,
    title: "Domain Footprinting & DNS Record Intelligence",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Passive DNS intelligence extracts crucial perimeter data including mail servers (MX), name servers (NS), and TXT policy frameworks (SPF/DMARC) without alerting target detection systems.",
    objective:
      "Perform passive DNS queries using `dig`, `whois`, or `host` against the target organization domain. Identify the SPF verification flag string.",
    guidance: [
      "Open your Kali Linux terminal.",
      "Execute `dig TXT <TARGET_DOMAIN> +short` or `nslookup -type=TXT <TARGET_DOMAIN>`.",
      "Analyze the SPF record: `v=spf1 include:_spf.cyberlab.corp ip4:192.168.56.0/24 -all`.",
      "Inspect SOA (Start of Authority) and MX records to map mail servers.",
      "Construct the discovery flag: `LAB{dns_spf_record_uncovered}`.",
    ],
    recommendedCommands: [
      {
        label: "Query TXT & SPF Records",
        command: "dig TXT target-corp.lab +short",
        explanation: "Retrieve DNS TXT records containing email validation policies.",
      },
      {
        label: "WHOIS Domain Query",
        command: "whois target-corp.lab",
        explanation: "Lookup domain registrar, creation date, and point of contact.",
      },
      {
        label: "Enumerate Mail Servers",
        command: "dig MX target-corp.lab +short",
        explanation: "Find primary and fallback corporate mail exchange servers.",
      },
    ],
    targetService: "DNS Protocol (UDP Port 53) / WHOIS",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{dns_spf_record_uncovered}",
    hints: [
      {
        id: 1,
        title: "Dig Command",
        text: "Use `dig TXT <domain>` to view Sender Policy Framework records.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{dns_spf_record_uncovered}",
        penalty: 20,
      },
    ],
  },
  {
    id: "osint-002",
    labId: "osint-recon",
    order: 2,
    title: "Subdomain Discovery via Certificate Transparency (CT Logs)",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Certificate Transparency (CT) logs are publicly verifiable, append-only ledgers of all issued SSL/TLS certificates. They expose internal, staging, and development subdomains effortlessly.",
    objective:
      "Query Certificate Transparency databases (such as `crt.sh`) or use `amass enum -passive` to uncover hidden corporate subdomains.",
    guidance: [
      "In your browser or terminal, query the Certificate Transparency database at `https://crt.sh/?q=%25.target-corp.lab&output=json`.",
      "Observe historical and wildcard SSL certificates issued for subdomains like `vpn.target-corp.lab`, `staging.target-corp.lab`, and `dev-api.target-corp.lab`.",
      "Notice how CT logs uncover assets without sending a single probe to target infrastructure.",
      "Submit the flag: `LAB{crtsh_subdomain_discovered}`.",
    ],
    recommendedCommands: [
      {
        label: "Query Crt.sh API via Curl",
        command: "curl -s 'https://crt.sh/?q=%25.target-corp.lab&output=json' | jq -r '.[].name_value' | sort -u",
        explanation: "Parse unique subdomains from Certificate Transparency JSON log entries.",
      },
      {
        label: "Passive Amass Enumeration",
        command: "amass enum -passive -d target-corp.lab",
        explanation: "Passive subdomain reconnaissance aggregating dozens of OSINT sources.",
      },
    ],
    targetService: "Certificate Transparency / crt.sh",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{crtsh_subdomain_discovered}",
    hints: [
      {
        id: 1,
        title: "SAN Certificates",
        text: "Subject Alternative Name (SAN) fields in TLS certs list all associated hostnames.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{crtsh_subdomain_discovered}",
        penalty: 20,
      },
    ],
  },
  {
    id: "osint-003",
    labId: "osint-recon",
    order: 3,
    title: "Google Dorking & Search Operator Mastery",
    category: "Reconnaissance",
    difficulty: "Easy",
    points: 100,
    description:
      "Advanced search engine operators (Google Dorks) allow penetration testers to find exposed configuration files, backup databases, and confidential spreadsheets indexed by search spiders.",
    objective:
      "Construct targeted Google Dork queries to identify sensitive document disclosures (`filetype:pdf`, `filetype:env`, `intitle:\"index of\"`).",
    guidance: [
      "Review the Google Hacking Database (GHDB) operators: `site:`, `filetype:`, `intitle:`, `inurl:`, `ext:`.",
      "Construct search queries: `site:target-corp.lab filetype:pdf \"confidential\"`.",
      "Construct directory listing queries: `site:target-corp.lab intitle:\"index of /\" \"backup\"`.",
      "Analyze the exposed internal disclosure findings.",
      "Submit the flag: `LAB{google_dork_exposed_confidential}`.",
    ],
    recommendedCommands: [
      {
        label: "Dork: Sensitive File Types",
        command: "site:target-corp.lab filetype:pdf OR filetype:docx \"INTERNAL ONLY\"",
        explanation: "Google search syntax for finding confidential indexed documents.",
      },
      {
        label: "Dork: Open Directory Indexes",
        command: "site:target-corp.lab intitle:\"index of\" (backup | config | .git)",
        explanation: "Locate unindexed server directory listings hosting sensitive assets.",
      },
    ],
    targetService: "Search Engine Indexers / GHDB",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{google_dork_exposed_confidential}",
    hints: [
      {
        id: 1,
        title: "Operator Syntax",
        text: "Combine `site:` with `filetype:pdf` and exact keyword matching in quotes.",
        penalty: 10,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{google_dork_exposed_confidential}",
        penalty: 20,
      },
    ],
  },
  {
    id: "osint-004",
    labId: "osint-recon",
    order: 4,
    title: "Wayback Machine & Historical Endpoint Reconnaissance",
    category: "Enumeration",
    difficulty: "Medium",
    points: 150,
    description:
      "Web archives like the Wayback Machine store historical snapshots of web applications. Attackers use this to uncover deprecated API parameters and forgotten administrative URLs.",
    objective:
      "Query the Internet Archive CDX API or use `waybackurls` to extract historical URLs and retired endpoints for the target domain.",
    guidance: [
      "In Kali Linux, query the Wayback CDX endpoint: `http://web.archive.org/cdx/search/cdx?url=*.target-corp.lab/*&output=json&fl=original&collapse=urlkey`.",
      "Look for historical endpoints containing `/api/v1/`, `/admin_login_old.php`, or `/debug`.",
      "Compare historical endpoints against current live assets to find zombie endpoints still active on the server.",
      "Submit the flag: `LAB{wayback_historical_api_endpoint}`.",
    ],
    recommendedCommands: [
      {
        label: "Wayback CDX API Query",
        command: "curl -s 'http://web.archive.org/cdx/search/cdx?url=*.target-corp.lab/*&output=text&fl=original' | sort -u",
        explanation: "Fetch all historical URLs ever indexed by the Internet Archive.",
      },
      {
        label: "Filter Parameters via GAU",
        command: "curl -s 'http://web.archive.org/cdx/search/cdx?url=target-corp.lab/*&output=text&fl=original' | grep '?'",
        explanation: "Filter historical URL list for queries containing GET parameters.",
      },
    ],
    targetService: "Wayback Machine / Web Archive CDX",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{wayback_historical_api_endpoint}",
    hints: [
      {
        id: 1,
        title: "CDX Parameters",
        text: "The CDX API takes `url=*.domain/*` with wildcard prefix and suffix.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{wayback_historical_api_endpoint}",
        penalty: 30,
      },
    ],
  },
  {
    id: "osint-005",
    labId: "osint-recon",
    order: 5,
    title: "Personnel & Email Footprinting via theHarvester",
    category: "Enumeration",
    difficulty: "Medium",
    points: 150,
    description:
      "Social engineering and password spraying require discovering corporate email formats and employee identities through passive search scrapers and PGP servers.",
    objective:
      "Run `theHarvester` to aggregate corporate employee email addresses, names, and LinkedIn naming conventions (`first.last@target-corp.lab`).",
    guidance: [
      "Open Kali Linux and execute: `theHarvester -d target-corp.lab -b bing,duckduckgo,pgp`.",
      "Analyze the discovered employee email list.",
      "Identify the standard naming syntax used by the organization (e.g. `first.last@target-corp.lab`).",
      "Correlate found names against PGP public key server signatures.",
      "Submit the flag: `LAB{theharvester_employee_emails_found}`.",
    ],
    recommendedCommands: [
      {
        label: "Run theHarvester",
        command: "theHarvester -d target-corp.lab -b bing,duckduckgo,crtsh -l 200",
        explanation: "Harvest email addresses and subdomains from public search providers.",
      },
      {
        label: "PGP Key Server Lookup",
        command: "gpg --keyserver keyserver.ubuntu.com --search-keys target-corp.lab",
        explanation: "Search public PGP keyrings for registered developer and employee keys.",
      },
    ],
    targetService: "theHarvester / PGP Public Keyservers",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{theharvester_employee_emails_found}",
    hints: [
      {
        id: 1,
        title: "Search Engines",
        text: "theHarvester queries public engines like DuckDuckGo, Bing, and Yahoo without sending packets to the target.",
        penalty: 15,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{theharvester_employee_emails_found}",
        penalty: 30,
      },
    ],
  },
  {
    id: "osint-006",
    labId: "osint-recon",
    order: 6,
    title: "Breached Credential & Pastebin Intelligence",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 200,
    description:
      "Billions of compromised passwords exist in public leak databases and Pastebin dumps. Security analysts evaluate breach records to quantify credential reuse risk.",
    objective:
      "Investigate breached credential records and paste dumps to uncover historical leaked hashes and employee password patterns.",
    guidance: [
      "Learn how services like HaveIBeenPwned (k-Anonymity API) and DeHashed index breach records.",
      "Query the HIBP Pwned Passwords API using SHA-1 prefix matching: `curl https://api.pwnedpasswords.com/range/<FIRST_5_HASH_CHARS>`.",
      "Understand how attackers construct custom targeted wordlists (Cewl) from breached personnel data.",
      "Submit the flag: `LAB{breached_credentials_intelligence}`.",
    ],
    recommendedCommands: [
      {
        label: "Query HIBP k-Anonymity API",
        command: "curl -s https://api.pwnedpasswords.com/range/21BD1 | head -n 5",
        explanation: "Check password breach prevalence using k-Anonymity SHA-1 hash prefixes.",
      },
    ],
    targetService: "HIBP API / Pastebin Dump Archives",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{breached_credentials_intelligence}",
    hints: [
      {
        id: 1,
        title: "k-Anonymity",
        text: "The k-Anonymity model sends only the first 5 hexadecimal characters of a SHA-1 hash to protect user privacy.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{breached_credentials_intelligence}",
        penalty: 40,
      },
    ],
  },
  {
    id: "osint-007",
    labId: "osint-recon",
    order: 7,
    title: "Document Metadata Extraction via ExifTool",
    category: "Vulnerability Analysis",
    difficulty: "Medium",
    points: 200,
    description:
      "Public corporate PDF, DOCX, and image files retain rich EXIF and XML metadata revealing author usernames, operating system versions, software builds, and internal file paths.",
    objective:
      "Use `exiftool` on public documents to extract internal user account names, printer models, and internal network share paths (`\\\\fileserver\\dept\\...`).",
    guidance: [
      "Download a public corporate document (e.g. `curl -O http://<TARGET_IP>/annual_report.pdf`).",
      "Run `exiftool annual_report.pdf` from Kali Linux.",
      "Examine the output fields: `Author`, `Creator`, `Producer`, and `Company`.",
      "Notice the username `jdoe_corp` and internal server path `C:\\Users\\jdoe\\Documents\\Finance\\`.",
      "Submit the flag: `LAB{exiftool_author_username_extracted}`.",
    ],
    recommendedCommands: [
      {
        label: "ExifTool Comprehensive Metadata",
        command: "exiftool -a -u -g1 document.pdf",
        explanation: "Dump all metadata tags categorized by metadata group.",
      },
      {
        label: "Extract Authors from Directory",
        command: "exiftool -r -Author -Creator *.pdf",
        explanation: "Batch extract creator usernames across all downloaded corporate documents.",
      },
    ],
    targetService: "ExifTool / Document Metadata Analysis",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{exiftool_author_username_extracted}",
    hints: [
      {
        id: 1,
        title: "ExifTool Flags",
        text: "Run `exiftool -a -u` to extract duplicate and unknown metadata tags.",
        penalty: 20,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{exiftool_author_username_extracted}",
        penalty: 40,
      },
    ],
  },
  {
    id: "osint-008",
    labId: "osint-recon",
    order: 8,
    title: "Public Code Repository & Secret Leak Hunting",
    category: "Initial Access",
    difficulty: "Hard",
    points: 250,
    description:
      "Developers frequently commit cloud credentials (AWS Access Keys, Stripe tokens, private SSH keys, `.env` files) into public GitHub or GitLab repositories.",
    objective:
      "Use Git Dorking and tools like `truffleHog` / `gitleaks` to detect exposed AWS secrets (`AKIA...`) and API tokens in public commit histories.",
    guidance: [
      "Explore GitHub search syntax: `org:target-corp \"AKIA\"` or `org:target-corp filename:.env`.",
      "Run TruffleHog against public Git repositories: `trufflehog git https://github.com/target-corp/sample-repo.git`.",
      "Inspect commit diffs for removed keys that still exist in the repository's git commit history.",
      "Identify the exposed AWS Secret Access Key.",
      "Submit the flag: `LAB{git_leaked_aws_secret_key}`.",
    ],
    recommendedCommands: [
      {
        label: "TruffleHog Secret Scan",
        command: "trufflehog git https://github.com/target-corp/web-app.git --only-verified",
        explanation: "Scan entire git commit history for high-entropy secrets and API tokens.",
      },
      {
        label: "GitHub Search Query",
        command: "org:target-corp (AWS_SECRET_ACCESS_KEY | password | api_key)",
        explanation: "Query GitHub Code Search for sensitive configuration keywords.",
      },
    ],
    targetService: "GitHub Search / TruffleHog / GitLeaks",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{git_leaked_aws_secret_key}",
    hints: [
      {
        id: 1,
        title: "AWS Key Prefix",
        text: "AWS Access Key IDs always begin with the prefix `AKIA` followed by 16 alphanumeric characters.",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{git_leaked_aws_secret_key}",
        penalty: 50,
      },
    ],
  },
  {
    id: "osint-009",
    labId: "osint-recon",
    order: 9,
    title: "Internet-Wide Device Mapping via Shodan & Censys",
    category: "Initial Access",
    difficulty: "Hard",
    points: 250,
    description:
      "Shodan and Censys continuously crawl and index every IP address on the internet. They reveal exposed Elasticsearch instances, unauthenticated Redis databases, and industrial IoT controllers.",
    objective:
      "Query Shodan search filters (`org:`, `asn:`, `product:`, `port:`) to locate an unauthenticated database cluster exposed on the internet.",
    guidance: [
      "In Shodan, construct targeted filter queries: `org:\"Target Corporation\" product:\"Elasticsearch\" port:9200`.",
      "Analyze the banner response returning `status: 200` with JSON cluster information and indices list (`/_cat/indices`).",
      "Understand how organizations inadvertently expose data storage clusters without firewall restriction.",
      "Submit the flag: `LAB{shodan_exposed_elasticsearch_cluster}`.",
    ],
    recommendedCommands: [
      {
        label: "Shodan CLI Search",
        command: "shodan search 'org:\"Target Corporation\" port:9200 product:Elasticsearch'",
        explanation: "Query Shodan API from CLI for exposed database servers.",
      },
      {
        label: "Shodan Host Analysis",
        command: "shodan host 192.168.56.101",
        explanation: "Lookup historical banner and vulnerability data for a specific IP.",
      },
    ],
    targetService: "Shodan API / Censys Search Engine",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{shodan_exposed_elasticsearch_cluster}",
    hints: [
      {
        id: 1,
        title: "Shodan Filters",
        text: "Use `org:` and `port:9200` to pinpoint Elasticsearch clusters.",
        penalty: 25,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{shodan_exposed_elasticsearch_cluster}",
        penalty: 50,
      },
    ],
  },
  {
    id: "osint-010",
    labId: "osint-recon",
    order: 10,
    title: "Geospatial & Image Intelligence (GEOINT/IMINT) Master Flag",
    category: "Flags",
    difficulty: "Hard",
    points: 300,
    description:
      "Physical penetration testing and facility assessments rely on Geospatial Intelligence (GEOINT): extracting GPS coordinates from images, analyzing architectural features, and satellite triangulation.",
    objective:
      "Perform image intelligence analysis on a target facility photograph. Extract GPS EXIF tags and verify the exact coordinates to claim the OSINT Master Flag.",
    guidance: [
      "Inspect image EXIF tags for `GPS Latitude` and `GPS Longitude` metadata.",
      "If EXIF is stripped, apply landmark triangulation, street signage verification, and sun/shadow angle analysis (SunCalc).",
      "Pinpoint the exact location on satellite imagery (Google Earth / OpenStreetMap).",
      "Review the comprehensive OSINT penetration testing methodology completed across all 10 intelligence modules!",
      "Submit the master OSINT flag to finish the laboratory!",
    ],
    recommendedCommands: [
      {
        label: "Extract GPS EXIF Data",
        command: "exiftool -GPSLatitude -GPSLongitude -GPSPosition facility.jpg",
        explanation: "Extract embedded geographic latitude and longitude coordinates.",
      },
    ],
    targetService: "GEOINT / OpenStreetMap / Satellite Triangulation",
    flagFormat: "LAB{...}",
    expectedFlag: "LAB{geoint_coordinates_pinpointed}",
    hints: [
      {
        id: 1,
        title: "Master Flag",
        text: "The final master flag for the OSINT lab: LAB{geoint_coordinates_pinpointed}.",
        penalty: 30,
      },
      {
        id: 2,
        title: "Flag Solution",
        text: "Submit: LAB{geoint_coordinates_pinpointed}",
        penalty: 60,
      },
    ],
  },
];
