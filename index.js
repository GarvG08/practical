const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const visitorlog = path.join(__dirname, "visitor.log");
const backuplog = path.join(__dirname, "backup.log");

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. Update Log
    if (pathname === "/updateuser") {
        const logentry = `${new Date().toString()}\n`;

        fs.appendFile(visitorlog, logentry, (err) => {
            if (err) {
                return res.end("Error found");
            }
            return res.end("Logged successfully");
        });
    }

    // 2. Read Log
    else if (pathname === "/savelog") {
        fs.readFile(visitorlog, "utf-8", (err, data) => {
            if (err) {
                return res.end("Error found");
            }
            return res.end(data);
        });
    }

    // 3. Backup Log
    else if (pathname === "/backuplog") {
        fs.readFile(visitorlog, (err, data) => {
            if (err) {
                return res.end("Error reading log");
            }

            fs.writeFile(backuplog, data, (err) => {
                if (err) {
                    return res.end("Error writing backup");
                }
                return res.end("Backup successful");
            });
        });
    }

    // 4. Clear Log
    else if (pathname === "/clearlog") {
        fs.writeFile(visitorlog, "", (err) => {
            if (err) {
                return res.end("Error found");
            }
            return res.end("Log cleared successfully");
        });
    }

    // Default route
    else {
        res.end("Route not found");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
});
