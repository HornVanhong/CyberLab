export interface OsintResourceLink {
  id: string;
  name: string;
  url: string;
  category:
    | "IoT & Search Engines"
    | "Domain & DNS Recon"
    | "Identity & Email OSINT"
    | "Network & Geolocation"
    | "Exploits & Cyber Utilities";
  accessType: "Free" | "Freemium" | "Registration Required";
  description: string;
  sampleQuery?: string;
  popularFor: string[];
}

export const OSINT_RESOURCES_DIRECTORY: OsintResourceLink[] = [
  // ==========================================
  // IOT & CYBERSEARCH ENGINES
  // ==========================================
  {
    id: "shodan",
    name: "Shodan.io",
    url: "https://www.shodan.io",
    category: "IoT & Search Engines",
    accessType: "Freemium",
    description: "The world's first search engine for Internet-connected devices, open ports, webcams, and industrial control systems.",
    sampleQuery: 'port:21 anonymous OR product:"Apache HTTPD"',
    popularFor: ["Exposed IoT Devices", "Open Ports", "HTTP Banner Grabbing", "Unpatched Vulnerabilities"],
  },
  {
    id: "censys",
    name: "Censys Search",
    url: "https://search.censys.com",
    category: "IoT & Search Engines",
    accessType: "Freemium",
    description: "Attack surface management platform and search engine for discovering hosts, open services, and SSL/TLS certificates.",
    sampleQuery: 'services.service_name: HTTP AND location.country: "United States"',
    popularFor: ["Origin IP Discovery", "SSL Certificate Mapping", "Cloud Asset Scans"],
  },
  {
    id: "binaryedge",
    name: "BinaryEdge",
    url: "https://www.binaryedge.io",
    category: "IoT & Search Engines",
    accessType: "Freemium",
    description: "Cyber threat intelligence engine scanning global IP space for exposed ports, vulnerabilities, and leaked data.",
    sampleQuery: "query.type: 'port' target: 80,443",
    popularFor: ["Global IP Scans", "Threat Intelligence", "Exposed Storage Buckets"],
  },
  {
    id: "zoomeye",
    name: "ZoomEye",
    url: "https://www.zoomeye.org",
    category: "IoT & Search Engines",
    accessType: "Freemium",
    description: "Cyberspace search engine that records host, web application, and device network signatures worldwide.",
    sampleQuery: 'app:"WordPress" + country:"US"',
    popularFor: ["Cyberspace Mapping", "Web Stack Signatures", "Global Devices"],
  },
  {
    id: "fofa",
    name: "FOFA Cyberspace Search",
    url: "https://fofa.info",
    category: "IoT & Search Engines",
    accessType: "Freemium",
    description: "Cyberspace asset search engine designed to help security researchers map internet-facing servers and web services.",
    sampleQuery: 'header="Server: Apache" || title="Admin"',
    popularFor: ["Asset Discovery", "Web Banner Matching", "Threat Hunting"],
  },

  // ==========================================
  // DOMAIN & DNS RECON
  // ==========================================
  {
    id: "domaintools",
    name: "DomainTools WHOIS",
    url: "https://whois.domaintools.com",
    category: "Domain & DNS Recon",
    accessType: "Freemium",
    description: "Industry-standard WHOIS domain lookup engine providing historical domain ownership, registrant contact data, name servers, and hosting profiles.",
    sampleQuery: "https://whois.domaintools.com/target.com",
    popularFor: ["Domain WHOIS Lookup", "Registrant History", "Name Server Records", "Reverse IP Lookups"],
  },
  {
    id: "crtsh",
    name: "Crt.sh Certificate Search",
    url: "https://crt.sh",
    category: "Domain & DNS Recon",
    accessType: "Free",
    description: "Certificate Transparency (CT) log search engine for discovering SSL/TLS certificates and passive subdomains.",
    sampleQuery: "%.target.com",
    popularFor: ["Passive Subdomain Extraction", "SSL Certificate Logs", "Subdomain Discovery"],
  },
  {
    id: "dnsdumpster",
    name: "DNSDumpster",
    url: "https://dnsdumpster.com",
    category: "Domain & DNS Recon",
    accessType: "Free",
    description: "Passive DNS reconnaissance tool for mapping an organization's public-facing DNS infrastructure and visual network topology.",
    sampleQuery: "target.com",
    popularFor: ["DNS Topology Maps", "MX/NS Record Analysis", "Subdomain Graphs"],
  },
  {
    id: "securitytrails",
    name: "SecurityTrails",
    url: "https://securitytrails.com",
    category: "Domain & DNS Recon",
    accessType: "Freemium",
    description: "Comprehensive historical DNS records search engine, WHOIS change tracking, and subdomains database.",
    sampleQuery: "domain: target.com",
    popularFor: ["Historical DNS Lookups", "WHOIS History", "Subdomain Inventories"],
  },
  {
    id: "virustotal",
    name: "VirusTotal",
    url: "https://www.virustotal.com",
    category: "Domain & DNS Recon",
    accessType: "Freemium",
    description: "Analyzes suspicious files, URLs, domains, and IP addresses to detect malware using 70+ antivirus engines.",
    sampleQuery: "target.com OR 8.8.8.8",
    popularFor: ["Domain Reputation", "Malware Detection", "IP Communicating Files"],
  },
  {
    id: "builtwith",
    name: "BuiltWith Technology Lookup",
    url: "https://builtwith.com",
    category: "Domain & DNS Recon",
    accessType: "Freemium",
    description: "Web technology profiler that reveals server software, analytics scripts, CMS engines, and frameworks behind any site.",
    sampleQuery: "target.com",
    popularFor: ["Web Tech Stack Profiling", "CMS Identification", "Tracking Analytics Keys"],
  },
  {
    id: "wayback",
    name: "Wayback Machine (Archive.org)",
    url: "https://web.archive.org",
    category: "Domain & DNS Recon",
    accessType: "Free",
    description: "Digital archive of the World Wide Web showing historical website snapshots and old deleted web pages.",
    sampleQuery: "https://target.com/*",
    popularFor: ["Historical Site Snapshots", "Recovering Deleted Pages", "Old Contact Info"],
  },

  // ==========================================
  // IDENTITY & EMAIL OSINT
  // ==========================================
  {
    id: "haveibeenpwned",
    name: "Have I Been Pwned",
    url: "https://haveibeenpwned.com",
    category: "Identity & Email OSINT",
    accessType: "Free",
    description: "Allows users and researchers to check if an email address or username was compromised in known data breaches.",
    sampleQuery: "user@example.com",
    popularFor: ["Data Breach Lookups", "Pwned Email Audits", "Exposed Passwords Check"],
  },
  {
    id: "hunterio",
    name: "Hunter.io Email Finder",
    url: "https://hunter.io",
    category: "Identity & Email OSINT",
    accessType: "Freemium",
    description: "Finds and verifies professional corporate email address structures associated with any target company domain.",
    sampleQuery: "company.com",
    popularFor: ["Corporate Email Discovery", "Email Format Verification", "Employee Contact Logs"],
  },
  {
    id: "osintframework",
    name: "OSINT Framework",
    url: "https://osintframework.com",
    category: "Identity & Email OSINT",
    accessType: "Free",
    description: "Interactive visual map of open-source intelligence tools categorized by information type (username, email, domain, IP).",
    sampleQuery: "Navigate visual tree nodes",
    popularFor: ["OSINT Workflow Mapping", "Tool Directory Tree", "Investigative Checklists"],
  },
  {
    id: "whatsmyname",
    name: "WhatsMyName App",
    url: "https://whatsmyname.app",
    category: "Identity & Email OSINT",
    accessType: "Free",
    description: "Web application for hunting usernames across hundreds of online social media networks and technical forums.",
    sampleQuery: "target_user",
    popularFor: ["Social Media Username Hunter", "Online Alias Footprinting", "Profile Discovery"],
  },
  {
    id: "inteltechniques",
    name: "IntelTechniques (Michael Bazzell)",
    url: "https://inteltechniques.com",
    category: "Identity & Email OSINT",
    accessType: "Free",
    description: "Premier OSINT resource hub featuring online investigation tools, search forms, and privacy guides.",
    sampleQuery: "Custom search forms",
    popularFor: ["Advanced OSINT Search Forms", "Privacy & Security Guides", "Investigative Tools"],
  },
  {
    id: "dehashed",
    name: "DeHashed Breach Database",
    url: "https://dehashed.com",
    category: "Identity & Email OSINT",
    accessType: "Freemium",
    description: "Deep web credential and data breach search engine for security audits and password exposure detection.",
    sampleQuery: "domain:company.com OR email:user@target.com",
    popularFor: ["Breach Data Auditing", "Exposed Hashes Search", "Credential Intelligence"],
  },

  // ==========================================
  // NETWORK & GEOLOCATION
  // ==========================================
  {
    id: "bgpview",
    name: "BGPView Network Lookup",
    url: "https://bgpview.io",
    category: "Network & Geolocation",
    accessType: "Free",
    description: "Graphical tool for looking up Autonomous System Numbers (ASN), IP prefixes, BGP routes, and network peers.",
    sampleQuery: "AS15169 OR 8.8.8.8",
    popularFor: ["ASN Infrastructure Mapping", "BGP Route Lookups", "IP Subnet Ranges"],
  },
  {
    id: "ipinfo",
    name: "IPinfo.io",
    url: "https://ipinfo.io",
    category: "Network & Geolocation",
    accessType: "Freemium",
    description: "Comprehensive IP address geolocation data provider, hosting provider detection, and VPN/Proxy detection.",
    sampleQuery: "8.8.8.8",
    popularFor: ["IP Geolocation", "ISP & Hosting Carrier Info", "VPN/Proxy Detection"],
  },
  {
    id: "wireshark_samples",
    name: "Wireshark Sample Captures",
    url: "https://wiki.wireshark.org/SampleCaptures",
    category: "Network & Forensics" as any,
    accessType: "Free",
    description: "Public library of PCAP packet trace files for practicing network protocol analysis and packet forensics.",
    sampleQuery: "Browse protocol PCAPs",
    popularFor: ["PCAP Forensics Practice", "Protocol Traces Library", "Traffic Analysis"],
  },

  // ==========================================
  // EXPLOITS & CYBER UTILITIES
  // ==========================================
  {
    id: "ghdb",
    name: "Google Hacking Database (GHDB)",
    url: "https://www.exploit-db.com/google-hacking-database",
    category: "Exploits & Cyber Utilities",
    accessType: "Free",
    description: "Offensive Security's database of verified Google Dork search queries for discovering security flaws.",
    sampleQuery: 'intitle:"index of" "parent directory"',
    popularFor: ["Google Dorks Library", "Vulnerability Search Queries", "Exposed Admin Pages"],
  },
  {
    id: "cyberchef_link",
    name: "CyberChef (GCHQ Web Tool)",
    url: "https://gchq.github.io/CyberChef",
    category: "Exploits & Cyber Utilities",
    accessType: "Free",
    description: "GCHQ's web-based Cyber Swiss Army Knife for encoding, decoding, encryption, and data transformations.",
    sampleQuery: "From Base64 -> Gunzip",
    popularFor: ["Base64 / Hex Decoding", "XOR Decryption", "String Extraction"],
  },
  {
    id: "gtfobins",
    name: "GTFOBins (Linux PrivEsc)",
    url: "https://gtfobins.github.io",
    category: "Exploits & Cyber Utilities",
    accessType: "Free",
    description: "Curated list of Unix binaries that can be used to bypass local security restrictions and escalate privileges.",
    sampleQuery: "find / vim / python / bash",
    popularFor: ["SUID Privilege Escalation", "Sudo NOPASSWD Exploits", "Linux Shell Escape"],
  },
];
