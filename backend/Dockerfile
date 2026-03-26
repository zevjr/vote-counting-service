FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl python3-poetry\
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Poetry
# ENV POETRY_VERSION=2.3.2
# ENV POETRY_HOME=/opt/poetry
# RUN curl -sSL https://install.python-poetry.org | python3 -
# ENV PATH="$POETRY_HOME/bin:$PATH"

# Copy dependency files
COPY pyproject.toml poetry.lock ./

# Install dependencies (no dev)
RUN poetry install --only main --no-root --no-interaction --no-ansi

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run migrations then start the server
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
