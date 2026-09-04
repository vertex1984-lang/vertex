"""本地预览 out/ 静态站，禁用一切缓存（避免浏览器拿到旧版页面）。"""
import http.server
import os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'out'))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == '__main__':
    print('Serving out/ at http://localhost:8080 (cache disabled)')
    http.server.ThreadingHTTPServer(('0.0.0.0', 8080), NoCacheHandler).serve_forever()
