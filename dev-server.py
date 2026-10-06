#!/usr/bin/env python3
"""
Локален development сервер.

`python3 -m http.server` не праќа Cache-Control, па прелистувачот
хеуристички кешира CSS/JS и продолжува да ја врти старата верзија
по измена. Тука додаваме `no-store` за секој одговор.
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, fmt, *args):
        # 404 за фотографии што сè уште не се додадени не се грешка вредна за лог
        if len(args) > 1 and str(args[1]) == '404':
            return
        super().log_message(fmt, *args)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    print(f'Get café → http://localhost:{port}  (без кеширање)')
    ThreadingHTTPServer(('127.0.0.1', port), NoCacheHandler).serve_forever()
