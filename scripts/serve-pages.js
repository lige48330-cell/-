const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function send(res, statusCode, body, contentType = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function redirect(res, location) {
  res.writeHead(302, {
    Location: location,
    'Cache-Control': 'no-store',
  });
  res.end(`Redirecting to ${location}`);
}

function resolvePagePath(urlPath) {
  let relativePath = urlPath.slice('/-/'.length);

  try {
    relativePath = decodeURIComponent(relativePath);
  } catch (error) {
    return null;
  }

  if (!relativePath || relativePath.endsWith('/')) {
    relativePath = path.join(relativePath, 'index.html');
  }

  const filePath = path.resolve(rootDir, relativePath);
  const rootWithSeparator = rootDir.endsWith(path.sep) ? rootDir : `${rootDir}${path.sep}`;

  if (filePath !== rootDir && !filePath.startsWith(rootWithSeparator)) {
    return null;
  }

  return filePath;
}

function serveFile(filePath, res) {
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      serveNotFound(res);
      return;
    }

    const finalPath = stats.isDirectory() ? path.join(filePath, 'index.html') : filePath;

    fs.readFile(finalPath, (readError, data) => {
      if (readError) {
        serveNotFound(res);
        return;
      }

      const contentType = mimeTypes[path.extname(finalPath).toLowerCase()] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  });
}

function serveNotFound(res) {
  const notFoundPath = path.join(rootDir, '404.html');

  fs.readFile(notFoundPath, (error, data) => {
    if (error) {
      send(res, 404, 'Not found');
      return;
    }

    res.writeHead(404, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || `${host}:${port}`}`);

  if (requestUrl.pathname === '/') {
    redirect(res, '/-/');
    return;
  }

  if (!requestUrl.pathname.startsWith('/-/')) {
    serveNotFound(res);
    return;
  }

  const filePath = resolvePagePath(requestUrl.pathname);

  if (!filePath) {
    send(res, 400, 'Bad request');
    return;
  }

  serveFile(filePath, res);
});

server.listen(port, host, () => {
  console.log(`Preview server running at http://${host}:${port}/-/`);
});
