package com.ijse.researchtrack.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public String welcome() {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Research Track API</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            max-width: 900px;
                            margin: 50px auto;
                            padding: 20px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .container {
                            background: rgba(255, 255, 255, 0.1);
                            padding: 30px;
                            border-radius: 10px;
                            backdrop-filter: blur(10px);
                        }
                        h1 { color: #fff; margin-bottom: 10px; }
                        h2 { color: #f0f0f0; margin-top: 30px; }
                        .status { color: #4ade80; font-weight: bold; }
                        .endpoint {
                            background: rgba(0, 0, 0, 0.2);
                            padding: 10px;
                            margin: 10px 0;
                            border-radius: 5px;
                            border-left: 4px solid #4ade80;
                        }
                        .method {
                            display: inline-block;
                            padding: 3px 8px;
                            border-radius: 3px;
                            font-weight: bold;
                            margin-right: 10px;
                        }
                        .get { background: #4ade80; color: #000; }
                        .post { background: #60a5fa; color: #000; }
                        .put { background: #fbbf24; color: #000; }
                        .delete { background: #f87171; color: #000; }
                        code { background: rgba(0, 0, 0, 0.3); padding: 2px 6px; border-radius: 3px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎓 Research Track API</h1>
                        <p>Status: <span class="status">✓ Running Successfully</span></p>
                        <p>Version: 1.0.0</p>

                        <h2>📚 Available API Endpoints</h2>

                        <h3>Authentication (Public)</h3>
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <code>/api/auth/signup</code> - Register new user
                        </div>
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <code>/api/auth/login</code> - Login and get JWT token
                        </div>

                        <h3>Users (Authenticated)</h3>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/users/me</code> - Get current user info
                        </div>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/users</code> - Get all users (ADMIN only)
                        </div>

                        <h3>Projects (Authenticated)</h3>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/projects</code> - Get all projects
                        </div>
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <code>/api/projects</code> - Create new project (PI/ADMIN)
                        </div>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/projects/{id}</code> - Get project by ID
                        </div>
                        <div class="endpoint">
                            <span class="method put">PUT</span>
                            <code>/api/projects/{id}</code> - Update project (PI/ADMIN)
                        </div>
                        <div class="endpoint">
                            <span class="method delete">DELETE</span>
                            <code>/api/projects/{id}</code> - Delete project (ADMIN only)
                        </div>

                        <h3>Milestones (Authenticated)</h3>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/milestones/project/{projectId}</code> - Get project milestones
                        </div>
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <code>/api/milestones</code> - Create milestone
                        </div>

                        <h3>Documents (Authenticated)</h3>
                        <div class="endpoint">
                            <span class="method get">GET</span>
                            <code>/api/documents/project/{projectId}</code> - Get project documents
                        </div>
                        <div class="endpoint">
                            <span class="method post">POST</span>
                            <code>/api/documents</code> - Upload document
                        </div>

                        <h2>🔑 Quick Start</h2>
                        <ol>
                            <li>Use <code>POST /api/auth/signup</code> to create an account</li>
                            <li>Use <code>POST /api/auth/login</code> to get your JWT token</li>
                            <li>Add the token to your requests: <code>Authorization: Bearer {token}</code></li>
                            <li>Access protected endpoints with your token</li>
                        </ol>

                        <h2>📖 Documentation</h2>
                        <p>For detailed API documentation, see the <code>API_DOCUMENTATION.md</code> file in the project root.</p>

                        <p style="margin-top: 40px; text-align: center; opacity: 0.8;">
                            Built with Spring Boot 3.5.7 • MySQL • JWT Authentication
                        </p>
                    </div>
                </body>
                </html>
                """;
    }
}
