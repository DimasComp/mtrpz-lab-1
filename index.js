import { readFileSync, writeFileSync } from 'fs';
import { Command } from 'commander';
import { convertMarkdown } from './functions';

const program = new Command();

program
    .command('convert <file>')
    .description('Convert a markdown file to HTML')
    .argument('<file>', 'The markdown file to convert')
    .option('-o, --out <file>', 'The output file')
    .action((file, options) => {
        const markdown = readFileSync(file, 'utf-8');
        const html = convertMarkdown(markdown);
        
        const writeFunc = options.out ? writeFileSync.bind(null, options.out) : console.log;

        writeFunc(html);
    });