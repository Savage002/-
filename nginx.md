# Nginx (reverse proxy на хосте)

После того как nginx убрали из Docker, фронт крутится на `:5000` (Vite preview),
а бэкенд на `:3001`. На сервере ставим **системный nginx** как reverse proxy,
который терминирует SSL для `zqai.kz` / `www.zqai.kz` и раскидывает запросы:

- `/api` и `/uploads` → бэкенд `127.0.0.1:3001` (напрямую, без лишнего хопа)
- всё остальное → фронт `127.0.0.1:5000`

## Конфиг

Положить в `/etc/nginx/sites-available/zqai.kz` и слинковать в `sites-enabled`
(или просто в `/etc/nginx/conf.d/zqai.kz.conf`).

```nginx
# HTTP → HTTPS редирект
server {
    listen 80;
    listen [::]:80;
    server_name zqai.kz www.zqai.kz;

    # Оставить для обновления сертификатов certbot'ом
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS
server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name zqai.kz www.zqai.kz;

    ssl_certificate     /etc/letsencrypt/live/zqai.kz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zqai.kz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Лимит на размер загружаемых файлов (multer / загрузка изображений)
    client_max_body_size 50M;

    # API → бэкенд
    location /api {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Загруженные файлы → бэкенд (хранятся в public/uploads)
    location /uploads {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Всё остальное → фронт (Vite preview на :5000)
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Применение

```bash
# проверить синтаксис
sudo nginx -t

# перезагрузить
sudo systemctl reload nginx
```

## Получение сертификата (если ещё нет)

```bash
sudo certbot --nginx -d zqai.kz -d www.zqai.kz
```

certbot сам подставит блоки `ssl_certificate*` и пути к `options-ssl-nginx.conf`
и `ssl-dhparams.pem`. Если конфиг прописан вручную (как выше), используйте
`certbot certonly` и оставьте SSL-строки на месте.

## Примечания

- Бэкенд (`:3001`) и фронт (`:5000`) должны быть доступны только локально
  (`127.0.0.1`). В `docker-compose.yml` при желании можно сменить публикацию
  портов на `127.0.0.1:3001:3001` и `127.0.0.1:5000:5000`, чтобы наружу торчал
  только nginx.
- Поскольку nginx уже проксирует `/api` и `/uploads` напрямую на бэкенд,
  встроенный прокси Vite preview в проде не задействуется — он нужен только
  для локальной разработки.
- `client_max_body_size 50M` подгоните под реальный максимум загрузки.
