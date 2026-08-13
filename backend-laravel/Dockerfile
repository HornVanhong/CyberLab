FROM php:8.2-cli

# Install system dependencies & PostgreSQL PHP drivers
RUN apt-get update && apt-get install -y \
    libpq-dev \
    git \
    unzip \
    curl \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose Render default web port
EXPOSE 10000

# Entrypoint script: run database migrations and start server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000
