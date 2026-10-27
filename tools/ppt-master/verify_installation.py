#!/usr/bin/env python3
"""Verify installation and CLI loading without reading or generating any PPTX."""
from pathlib import Path
import ast,hashlib,importlib,importlib.metadata,json,os,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[2]
SKILL=ROOT/'.agents/skills/ppt-master'
VENV=Path(os.environ.get('PPT_MASTER_VENV','/workspace/venvs/ppt-master-20261027'))
assert Path(sys.prefix).resolve()==VENV.resolve(),'Run with the isolated PPT Master interpreter'
text=(SKILL/'SKILL.md').read_text()
assert re.search(r'^name: ppt-master$',text,re.M)
assert 'MIT' in (SKILL/'LICENSE').read_text()
missing=[]
for link in re.findall(r'\]\(([^)]+)\)',text):
 if '://' not in link and not link.startswith('#') and not (SKILL/link.split('#')[0]).exists():missing.append(link)
assert not missing,missing
scripts=list((SKILL/'scripts').rglob('*.py'))
for p in scripts:ast.parse(p.read_text(encoding='utf-8-sig'),filename=str(p))
modules=['yaml','pptx','xlsxwriter','pathops','uharfbuzz','edge_tts','fitz','mammoth','markdownify','ebooklib','nbconvert','openpyxl','PIL','numpy','requests','bs4','curl_cffi','google.genai','flask']
for mod in modules:importlib.import_module(mod)
env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1','PATH':str(VENV/'bin')+os.pathsep+os.environ['PATH'],'PIP_CACHE_DIR':'/tmp/ppt-master-pip-cache'}
commands=[['attribution_guard.py'],['svg_to_pptx.py','--help'],['pptx_to_svg.py','--help'],['source_to_md.py','--help'],['svg_quality_checker.py','--help'],['project_manager.py','--help'],['register_template.py','--help']]
checks=[]
for args in commands:
 r=subprocess.run([sys.executable,str(SKILL/'scripts'/args[0]),*args[1:]],capture_output=True,text=True,env=env,timeout=45)
 checks.append({'script':args[0],'arguments':args[1:],'returncode':r.returncode,'output_characters':len(r.stdout)})
 assert r.returncode==0,(args,r.stderr[-1000:])
r=subprocess.run([sys.executable,'-m','pip','check'],capture_output=True,text=True,env=env);assert r.returncode==0,r.stdout+r.stderr
result={'skill_name':'ppt-master','skill_version':'6.7.3','python':sys.version.split()[0],'isolated_venv':str(VENV),'pip_check':r.stdout.strip(),'python_files_syntax_checked':len(scripts),'dependency_modules_imported':modules,'skill_entry_relative_links_valid':True,'cli_checks':checks,'generated_pptx':False,'existing_pptx_opened_or_modified':False,'host_automatic_skill_loading':'Not confirmed; skills CLI discovery is checked separately.'}
report=ROOT/'docs/ppt-master-installation/validation.json';report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
