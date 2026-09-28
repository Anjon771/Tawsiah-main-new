# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy requirements file and install dependencies
# Doing this before copying code allows Docker to cache dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application code
COPY . .

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI application with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]