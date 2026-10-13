const fs=require('node:fs');const assert=require('node:assert/strict');
for(const [path,before,after] of [
 ['/opt/office/apps/shell/out/main/index.js','active: t.id === this.activeId','active: t.id === this.activeId,\n      filePath: t.filePath ?? null'],
 ['/opt/office/apps/shell/src/main/tab-manager.ts','active: t.id === this.activeId,','active: t.id === this.activeId,\n      filePath: t.filePath ?? null,'],
 ['/opt/office/apps/shell/src/shared/tabs-api.ts','  active: boolean','  active: boolean\n  filePath: string | null'],
]) {let source=fs.readFileSync(path,'utf8');if(source.includes(after))continue;assert.equal(source.split(before).length,2,'Unexpected source: '+path);fs.writeFileSync(path,source.replace(before,after))}
