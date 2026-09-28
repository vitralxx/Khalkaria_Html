"""Extrai a estrutura das 7 páginas de classe do Notion: coeficientes, CD, características, as 15 técnicas
gerais (nome, texto, custo, ação), ramos, técnicas de ramo por tier e marcas.

Uso: python3 estrutura_classes.py <pasta com os dumps>. A pasta tem um <classe>.txt por classe, com o
resultado bruto de notion-fetch da página. Grava estrutura_classes.json ao lado deste script.
Base do orçamento de técnica (orcamento_tecnicas.py) e do gabarito (references/19-gabarito-de-classe.md).
Extração de 2026-09-28: o Batedor saiu com "caracteristicas" sujas (o cabeçalho do retrato entra na
lista), o resto conferido à mão contra as páginas.
"""
import os, sys
import re, json, collections
AQUI = os.path.dirname(os.path.abspath(__file__))
DUMPS = sys.argv[1] if len(sys.argv) > 1 else 'snap'
CL=['espadachim','brutalista','teurgo','monge','alquimista','artilheiro','batedor']
def limpa(s):
    s=re.sub(r'</?span[^>]*>','',s); s=s.replace('**','').replace('*','')
    return re.sub(r'\s+',' ',s).strip()
out={}
for c in CL:
    t=open(os.path.join(DUMPS, f'{c}.txt'),encoding='utf-8').read()
    t=re.sub(r'!\[\]\([^)]*\)','',t)
    d={}
    # coeficientes
    co=re.findall(r'(\d+) \+ \((\d+) × Nível\)',t)
    d['coef']=[int(x[1]) for x in co[:3]]
    m=re.search(r'CD[^:\n]*:</span>\s*\n\s*- ([^\n]+)',t); d['cd']=limpa(m.group(1)) if m else None
    # características (títulos # que não são padrão)
    heads=[limpa(h) for h in re.findall(r'\n\t*# (.+)',t)]
    padrao={'Progressão:','Status iniciais:','Treinamento:','Técnicas:','Ramos:','Marcas de Ramo','Técnicas de Ramo'}
    d['caracteristicas']=[h.rstrip(':') for h in heads if h not in padrao]
    # técnicas gerais: primeira tabela com cabeçalho Técnica
    i=t.index('Técnicas:'); j=t.index('</table>',i); tab=t[i:j]
    rows=re.findall(r'<tr>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*</tr>',tab,re.S)
    d['tecnicas']=[{'nome':limpa(a),'texto':limpa(b),'custo':limpa(cst),'acao':limpa(ac)} for a,b,cst,ac in rows if limpa(a)!='Técnica']
    # ramos: nomes
    d['ramos']=[limpa(x) for x in re.findall(r'<span color="\w+">\s*(Ramo d[oa] [^<(]+)',t)]
    # técnicas de ramo por tier
    tiers={}
    for tn in ('1','2','3'):
        m=re.search(r'### \*\*Tier '+tn+r'\*\*(.*?)(?=### \*\*Tier|\Z|# <span underline="true">\*\*Marcas)',t,re.S)
        if not m: continue
        blk=m.group(1); cur=None; itens=[]
        for line in blk.split('\n'):
            ls=line.strip()
            mm=re.match(r'<span color="(\w+)">\s*([^<]+?)\s*</span>$',ls)
            if mm: cur=mm.group(2).strip(); continue
            if re.match(r'- ',ls) and line.startswith('\t\t- ') and not line.startswith('\t\t\t'):
                txt=limpa(ls[2:])
                mh=re.match(r'(.+?)\s*\((.*)\)\s*$',txt)
                if mh: itens.append({'ramo':cur,'nome':mh.group(1).strip(),'tag':mh.group(2).strip()})
            elif re.match(r'- ',ls) and line.startswith('\t- ') and not line.startswith('\t\t'):
                txt=limpa(ls[2:]); mh=re.match(r'(.+?)\s*\((.*)\)\s*$',txt)
                if mh: itens.append({'ramo':cur,'nome':mh.group(1).strip(),'tag':mh.group(2).strip()})
        tiers[tn]=itens
    d['tiers']=tiers
    # marcas: blocos "- <span underline>Nome</span>" sob Marcas de Ramo, com "Para cada"
    mi=t.find('Marcas de Ramo'); mk=t[mi:]
    mk=mk[:min([x for x in [mk.find('### **Tier'), mk.find('# <span underline="true">Técnicas de Ramo'), len(mk)] if x>0])]
    marcas=[]; curR=None
    for line in mk.split('\n'):
        ls=line.strip()
        mm=re.match(r'- <span color="\w+">([^<]+)</span>',ls)
        if mm: curR=mm.group(1).strip(); continue
        mm=re.match(r'- (?:<span underline="true">)?([^<>(]+?)(?:</span>)?(?:\s*\(.*\))?$',ls)
        if mm and line.startswith('\t\t\t- ') and not line.startswith('\t\t\t\t') and curR:
            marcas.append({'ramo':curR,'nome':mm.group(1).strip()})
    d['marcas']=marcas
    out[c]=d
json.dump(out,open(os.path.join(AQUI, 'estrutura_classes.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
for c,d in out.items():
    print(f"\n### {c}: coef {d['coef']} | CD {d['cd']} | caract {d['caracteristicas']}")
    print('  técnicas:',len(d['tecnicas']),'| ações:',dict(collections.Counter(re.sub(r'\s+',' ',x['acao']) for x in d['tecnicas'])))
    print('  tiers:',{k:len(v) for k,v in d['tiers'].items()},'| marcas:',len(d['marcas']),[m['nome'] for m in d['marcas']][:8])
