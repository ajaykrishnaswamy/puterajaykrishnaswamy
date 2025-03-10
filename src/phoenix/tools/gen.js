/*
 * Copyright (C) 2024-present Puter Technologies Inc.
 *
 * This file is part of Puter.
 *
 * Puter is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// Script that generates some of the javascript files
import fs from 'fs';
import path from 'path';

const [directory] = process.argv.slice(2);
const target = path.resolve(process.cwd(), directory);
const outputFile = path.resolve(target, '__exports__.js');

const files = fs.readdirSync(target);

let output = '';
const line = str => {
    output += str + '\n';
}

const toVar = name => {
    name = name.replace(/-/g, '_');
    return 'module_' + name;
}

const licenseLines = fs.readFileSync('../doc/license_header.txt', {encoding: 'utf8'}).split('\n');
licenseLines.pop(); // Remove trailing empty line
line('/*');
for (const licenseLine of licenseLines) {
    if (licenseLine.length === 0) {
        line(' *');
    } else {
        line(` * ${licenseLine}`);
    }
}
line(' */');
line('// Generated by /tools/gen.js');

for ( const file of files ) {
    if ( ! file.endsWith('.js') ) continue;
    const name = path.parse(file).name;
    if ( name === '__exports__' ) continue;
    line(`import ${toVar(name)} from './${file}'`);
}

line('');
line('export default {');

for ( const file of files ) {
    if ( ! file.endsWith('.js') ) continue;
    const name = path.parse(file).name;
    if ( name === '__exports__' ) continue;
    line(`    ${JSON.stringify(name)}: ${toVar(name)},`);
}

line('};');

fs.writeFileSync(outputFile, output);
