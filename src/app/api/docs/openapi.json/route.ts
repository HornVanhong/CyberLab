import { NextResponse } from "next/server";

export async function GET() {
  const openApiSpec = {
    openapi: "3.0.0",
    info: {
      title: "CyberLab REST API Specification",
      version: "1.0.0",
      description: "Full-Stack API documentation for CyberLab cybersecurity platform.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Development Server",
      },
    ],
    paths: {
      "/auth/me": {
        get: {
          summary: "Get Current Authenticated User Session",
          description: "Returns the profile, role, XP, and title of the currently logged-in user or guest session.",
          responses: {
            "200": {
              description: "Active Session Profile",
            },
          },
        },
      },
      "/auth/login": {
        post: {
          summary: "Authenticate User",
          description: "Authenticates email and password, issuing a signed HTTP-Only session token cookie.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", example: "student@cyberlab.local" },
                    password: { type: "string", example: "student123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Login Successful" },
            "401": { description: "Invalid Credentials" },
          },
        },
      },
      "/auth/register": {
        post: {
          summary: "Register New User Account",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "newhacker" },
                    email: { type: "string", example: "hacker@cyberlab.local" },
                    password: { type: "string", example: "password123" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "User Created Successfully" },
            "409": { description: "User Email Already Exists" },
          },
        },
      },
      "/flags/submit": {
        post: {
          summary: "Submit CTF Challenge Flag",
          description: "Validates submitted flag server-side using SHA-256 hashes and logs XP progress.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    labId: { type: "string", example: "metasploitable-2" },
                    challengeId: { type: "string", example: "msf2-01-vsftpd" },
                    flag: { type: "string", example: "FLAG{VSFTPD_BACKDOOR_SUCCESS}" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Flag Correct (+XP Awarded)" },
            "400": { description: "Incorrect Flag String" },
          },
        },
      },
      "/tools/execute": {
        post: {
          summary: "Execute Security Tool Simulator",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    toolId: { type: "string", example: "nmap" },
                    command: { type: "string", example: "nmap -sC -sV 192.168.56.102" },
                  },
                },
              },
            },
          },
          responses: {
            "200": { description: "Tool Execution Output Stream" },
          },
        },
      },
      "/exam/submit": {
        post: {
          summary: "Submit Exam Tasks & Issue Certificate",
          responses: {
            "200": { description: "Certificate Issued" },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
