"""Compara o texto e o HTML de todas as páginas contra um commit (ignora ?v=)."""
import glob, re, subprocess, sys

base = sys.argv[1]
norm = lambda h: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', re.sub(r'\?v=[0-9a-f]+', '', h))).strip()
sem_v = lambda h: re.sub(r'\?v=[0-9a-f]+', '', h).replace('\r\n', '\n')
muda_txt, muda_html = [], []
for p in sorted(glob.glob('pages/**/*.html', recursive=True)) + ['index.html']:
    p = p.replace('\\', '/')
    a = subprocess.run(['git', 'show', f'{base}:{p}'], capture_output=True).stdout.decode('utf-8')
    b = open(p, encoding='utf-8').read()
    if norm(a) != norm(b):
        muda_txt.append(p)
    if sem_v(a) != sem_v(b):
        muda_html.append(p)
print('texto mudou:', muda_txt)
print('html mudou (fora ?v=):', muda_html)
