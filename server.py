#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 3001
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class NoCacheRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        print(f"[{self.log_date_time_string()}] {format % args}")

os.chdir(DIRECTORY)
Handler = NoCacheRequestHandler

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


with ReusableTCPServer(("", PORT), Handler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print(f"Serving files from: {DIRECTORY}")
    httpd.serve_forever()
