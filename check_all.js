const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
    if (!filePath.endsWith('.js')) return;
    const content = fs.readFileSync(filePath, 'utf8');
    
    // find all import statements
    const importRegex = /import\s+(?:{([^}]+)})?\s*(?:([a-zA-Z0-9_]+))?\s*from\s+['"]([^'"]+)['"]/g;
    let match;
    let errors = [];
    
    while ((match = importRegex.exec(content)) !== null) {
        let namedImports = match[1] ? match[1].split(',').map(s => s.trim()).filter(Boolean) : [];
        let defaultImport = match[2];
        let importPath = match[3];
        
        let allImports = [...namedImports];
        if (defaultImport) allImports.push(defaultImport);
        
        // Remove the import line from the content being checked for usages
        const contentWithoutImportLine = content.replace(match[0], '');
        
        for (const imp of allImports) {
            // Ignore React and default imports that are common and might not be used directly in some basic files
            if (imp === 'React') continue;
            
            // Check if 'imp' is used in the file
            // A simple regex word boundary check
            const usageRegex = new RegExp(`\\b${imp}\\b`, 'g');
            const usages = [...contentWithoutImportLine.matchAll(usageRegex)];
            
            if (usages.length === 0) {
                errors.push(`Unused import: ${imp} from '${importPath}'`);
            }
        }
    }
    
    // Hardcoded theme tokens to check for missing imports
    const themeTokens = ['COLORS', 'SPACING', 'FONT_SIZE', 'RADIUS', 'SHADOW'];
    for (const token of themeTokens) {
        if (new RegExp(`\\b${token}\\b`).test(content)) {
            // Check if it's imported
            if (!content.includes(token) || !content.match(new RegExp(`import\\s+{[^}]*\\b${token}\\b[^}]*}\\s+from\\s+['"][^'"]*theme['"]`))) {
                errors.push(`Missing import: ${token} from theme`);
            }
        }
    }

    if (errors.length > 0) {
        console.log(`\nFile: ${filePath}`);
        errors.forEach(e => console.log(`  - ${e}`));
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.expo' && file !== 'assets') {
                walkDir(fullPath);
            }
        } else {
            checkFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname));
console.log('Check complete.');
