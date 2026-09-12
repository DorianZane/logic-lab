"""Build a portable static website using only the Python standard library."""
import json
import shutil
from pathlib import Path
from puzzles import PUZZLES

ROOT = Path(__file__).resolve().parent

def validate():
    assert len(PUZZLES) == 30, 'Exactly 30 puzzles are required'
    assert [p['id'] for p in PUZZLES] == list(range(1, 31))
    assert len({p['title'] for p in PUZZLES}) == 30
    for p in PUZZLES:
        assert len(p['options']) == 4 and len(set(p['options'])) == 4
        assert type(p['answer']) is int and 0 <= p['answer'] < 4
        assert len(p['hints']) == 2
        assert all(p[key] for key in ('title','category','level','prompt','explanation'))

def build(destination=None):
    validate()
    target = Path(destination) if destination else ROOT / 'dist'
    target.mkdir(parents=True, exist_ok=True)
    data = json.dumps(PUZZLES, ensure_ascii=False).replace('<', '\\u003c').replace('>', '\\u003e').replace('&', '\\u0026')
    template = (ROOT / 'assets/template.html').read_text(encoding='utf-8')
    (target / 'index.html').write_text(template.replace('__PUZZLES__', data), encoding='utf-8')
    for name in ('style.css', 'app.js'):
        shutil.copyfile(ROOT / 'assets' / name, target / name)
    (target / '.nojekyll').touch()
    return target

if __name__ == '__main__':
    print(f'Built {len(PUZZLES)} puzzles in {build()}')
