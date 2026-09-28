import json,sys,re,difflib
def load(p):
    raw=open(p).read()
    try: t=json.loads(raw)['text']
    except Exception: t=raw
    return re.sub(r'\?X-Amz[^)"\s]*','',t)
a=load(sys.argv[1]); b=load(sys.argv[2])
if len(sys.argv)>3: open(sys.argv[3],'w').write(b)
for l in difflib.unified_diff(a.splitlines(),b.splitlines(),lineterm='',n=0):
    if l.startswith(('---','+++')): continue
    print(l[:400])
