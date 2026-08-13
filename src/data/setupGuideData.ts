export interface SetupStep {
  stepNumber: number;
  title: string;
  description: string;
  command?: string;
  note?: string;
  imageHint?: string;
}

export interface SetupGuideSection {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  requirements: string[];
  steps: SetupStep[];
  troubleshootingTips: { issue: string; solution: string; command?: string }[];
}

export const LAB_SETUP_SECTIONS: SetupGuideSection[] = [
  {
    id: "kali-vm",
    title: "Kali Linux VM Setup Guide",
    subtitle: "Complete installation and post-configuration guide for Kali Linux in VirtualBox/VMware",
    iconName: "Dragon",
    summary: "Kali Linux is the industry-standard penetration testing operating system pre-loaded with over 600 security tools (Nmap, Metasploit, Wireshark, Burp Suite, Hydra, Hashcat).",
    requirements: [
      "VirtualBox 7.0+ or VMware Workstation Player",
      "Kali Linux 64-bit Installer ISO or Pre-built VirtualBox Image (.ova)",
      "At least 4 GB RAM (8 GB recommended)",
      "25 GB available disk space",
      "CPU Virtualization enabled in BIOS/UEFI (VT-x / AMD-V)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Download Hypervisor & Kali Linux Image",
        description: "Download VirtualBox (https://www.virtualbox.org) and the official pre-built Kali Linux VirtualBox image from https://www.kali.org/get-kali/#kali-virtual-machines.",
        note: "Downloading the pre-built VirtualBox image (.ova) skips manual OS installation and gets you running in under 5 minutes.",
      },
      {
        stepNumber: 2,
        title: "Import Kali OVA into VirtualBox",
        description: "Open VirtualBox -> Click File -> Import Appliance -> Select the downloaded Kali `.ova` file -> Click Next and Finish.",
        note: "Default settings assign 2 CPU cores and 2048 MB RAM. Increase RAM to 4096 MB for optimal performance.",
      },
      {
        stepNumber: 3,
        title: "Initial Login & Default Credentials",
        description: "Start the Kali VM in VirtualBox. Log in using default credentials:",
        command: "Username: kali\nPassword: kali",
        note: "If using older root images, credentials may be root/toor.",
      },
      {
        stepNumber: 4,
        title: "Update System Packages & Tools Repository",
        description: "Open a terminal prompt inside Kali Linux and run system package updates to ensure all security tools are updated.",
        command: "sudo apt update && sudo apt upgrade -y",
      },
      {
        stepNumber: 5,
        title: "Install Additional Cybersecurity Toolkits & SecLists",
        description: "Install additional wordlists (SecLists), Python tools, and network tools.",
        command: "sudo apt install -y seclists curl wget git net-tools python3-pip wireshark metasploit-framework",
      },
    ],
    troubleshootingTips: [
      {
        issue: "VirtualBox error: VT-x/AMD-V hardware acceleration is not available",
        solution: "Reboot your computer, enter BIOS/UEFI settings, and enable Virtualization Technology (Intel VT-x or AMD-V). On Windows, disable Hyper-V (`bcdedit /set hypervisorlaunchtype off`).",
      },
      {
        issue: "Screen resolution is small or distorted in Kali VM",
        solution: "Install VirtualBox Guest Additions inside Kali terminal:",
        command: "sudo apt update && sudo apt install -y install-exec guest-additions-iso && sudo reboot",
      },
    ],
  },
  {
    id: "metasploitable",
    title: "Metasploitable 2 & 3 VM Setup",
    subtitle: "Setting up intentionally vulnerable target virtual machines for safe pentesting practice",
    iconName: "Target",
    summary: "Metasploitable is an intentionally vulnerable Ubuntu-based virtual machine designed by Rapid7. It contains dozens of vulnerable network services (vsftpd 2.3.4, Samba, Apache, MySQL, Tomcat) for practicing exploits safely.",
    requirements: [
      "Metasploitable 2 Zip Image (Metasploitable-Linux-2.0.0.zip)",
      "VirtualBox or VMware Player",
      "512 MB to 1 GB assigned RAM",
      "10 GB disk space",
      "MUST BE ISOLATED on Host-Only network (Never bridge directly to public internet!)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Download Metasploitable 2 Virtual Machine",
        description: "Download Metasploitable 2 zip archive from SourceForge / Rapid7 (https://sourceforge.net/projects/metasploitable/). Extract the `.zip` archive to retrieve the `Metasploitable.vmdk` virtual disk file.",
      },
      {
        stepNumber: 2,
        title: "Create New VirtualBox VM for Metasploitable",
        description: "Open VirtualBox -> Click 'New' -> Name: Metasploitable2 -> Type: Linux -> Version: Ubuntu (64-bit) -> RAM: 1024 MB.",
      },
      {
        stepNumber: 3,
        title: "Attach Existing VMDK Hard Disk",
        description: "In Hard Disk section, select 'Use an existing virtual hard disk file' -> Click Add -> Browse and select the extracted `Metasploitable.vmdk` file -> Click Create.",
      },
      {
        stepNumber: 4,
        title: "Initial Boot & Login Credentials",
        description: "Power on the Metasploitable VM. Log in with the default credentials:",
        command: "Username: msfadmin\nPassword: msfadmin",
      },
      {
        stepNumber: 5,
        title: "Verify Vulnerable Target Services",
        description: "Check assigned IP address on Metasploitable VM using `ifconfig`.",
        command: "ifconfig eth0",
        note: "Vulnerable services running by default: Port 21 (FTP), 22 (SSH), 23 (Telnet), 80 (HTTP Web), 139/445 (Samba), 3306 (MySQL), 5432 (PostgreSQL).",
      },
    ],
    troubleshootingTips: [
      {
        issue: "Metasploitable VM fails to get an IP address",
        solution: "Log into Metasploitable as `msfadmin` and restart network interface:",
        command: "sudo /etc/init.d/networking restart  OR  sudo dhclient eth0",
      },
    ],
  },
  {
    id: "network-config",
    title: "Virtual Network & Host-Only Adapter Guide",
    subtitle: "Configuring isolated virtual lab networks between Kali Linux and Metasploitable VMs",
    iconName: "Network",
    summary: "Isolating your virtual lab environment using VirtualBox Host-Only or NAT Network adapters ensures your vulnerable target VM cannot be reached by external internet attackers.",
    requirements: [
      "VirtualBox Host-Only Manager configured (`vboxnet0` or `VirtualBox Host-Only Ethernet Adapter`)",
      "Kali VM Network Adapter set to Host-Only",
      "Metasploitable VM Network Adapter set to Host-Only",
      "Both VMs assigned IPs on the same subnet (e.g. 192.168.56.0/24)",
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Configure VirtualBox Host-Only Network Manager",
        description: "In VirtualBox, go to File -> Tools -> Network Manager -> Host-Only Networks tab. Verify `vboxnet0` is created with IP `192.168.56.1` and DHCP Server enabled (IP Range: 192.168.56.100 - 192.168.56.254).",
      },
      {
        stepNumber: 2,
        title: "Configure Kali Linux Network Adapter",
        description: "Right-click Kali VM in VirtualBox -> Settings -> Network -> Adapter 1 -> Attached to: 'Host-only Adapter' -> Name: 'vboxnet0' -> Promiscuous Mode: Allow All.",
      },
      {
        stepNumber: 3,
        title: "Configure Metasploitable Network Adapter",
        description: "Right-click Metasploitable VM -> Settings -> Network -> Adapter 1 -> Attached to: 'Host-only Adapter' -> Name: 'vboxnet0'.",
      },
      {
        stepNumber: 4,
        title: "Verify Network Connectivity between VMs",
        description: "Boot both VMs. Check IP of Metasploitable (`ifconfig`), then from Kali terminal ping the Metasploitable target IP address.",
        command: "ping -c 4 192.168.56.102",
        note: "If ping returns 0% packet loss, your virtual cyber lab network is connected and fully operational!",
      },
      {
        stepNumber: 5,
        title: "Scan Metasploitable Target Ports from Kali",
        description: "Run an Nmap scan from Kali Linux against Metasploitable target IP to discover all running vulnerable ports.",
        command: "nmap -sC -sV 192.168.56.102",
      },
    ],
    troubleshootingTips: [
      {
        issue: "Kali VM cannot access Internet for updates when set to Host-Only",
        solution: "Add a second network adapter to Kali VM in VirtualBox Settings -> Network -> Adapter 2 -> Attached to: 'NAT'. Adapter 1 handles Host-Only lab target traffic, and Adapter 2 handles Internet access.",
      },
    ],
  },
];
