#!/usr/bin/env python
"""
Simple Flask app runner for testing
"""
import os
import sys

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Import and create the Flask app
from backend import create_app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Starting Flask server...")
    print("📍 Server will be available at: http://127.0.0.1:5000")
    print("🛑 Press CTRL+C to stop the server")
    app.run(host='127.0.0.1', port=5000, debug=True)