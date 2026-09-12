"""Build and serve Logic Lab locally: python app.py [--port 8000]."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from build import build

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    directory = build()
    handler = partial(SimpleHTTPRequestHandler, directory=str(directory))
    with ThreadingHTTPServer(('127.0.0.1', args.port), handler) as server:
        print(f'Logic Lab is ready: http://localhost:{args.port}', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print('\nStopped.')

if __name__ == '__main__':
    main()
