import os
import sys

# Ensure we can import from the backend root
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, root)

os.environ.setdefault('DEBUG', 'false')
os.environ.setdefault('SECRET_KEY', os.environ.get('SECRET_KEY', 'vercel-production-secret-key'))

from app.main import app

handler = app
