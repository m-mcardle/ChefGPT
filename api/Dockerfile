# Start from a Python image
FROM python:3.9.16

# Set the working directory to this directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install -r requirements.txt

# Expose the port the application will listen on
EXPOSE 8080

# Run the application
CMD flask run --host=0.0.0.0 --port=$PORT
