# Stage 1: Build Angular frontend
FROM node:20 AS frontend-build
WORKDIR /app/clinic-frontend
COPY clinic-frontend/package*.json ./
RUN npm install -g @angular/cli@19.2.15
RUN npm ci --ignore-scripts
COPY clinic-frontend/ ./
RUN npm run build -- --configuration production

# Stage 2: Build FastAPI backend
FROM python:3.11-slim AS backend-build
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app ./app
COPY backend/static ./static

# Copy built frontend static files into backend static folder
COPY --from=frontend-build /app/clinic-frontend/dist/clinic-frontend ./static/

# Copy environment variables if exist
COPY backend/.env* ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
