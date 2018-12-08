import * as fs from "fs";
import * as path from "path";

const FILE_HEADER = `\
//////////////////////////////////////////////////////////////
// This file is generated from the Minecraft documentation. //
// DO NOT EDIT THIS FILE! YOUR CHANGES WILL BE OVERWRITTEN! //
//////////////////////////////////////////////////////////////
`;

async function processFile(templateFile: string, outputFile: string, values: { [name: string]: string }) {
    const data = await fs.promises.readFile(templateFile, "utf8");
    const result = data.replace(/^([ \t]*)\$\$(.*)\$\$/gm,
        (x, indent, name) => values[name].replace(/^/gm, indent));
    await fs.promises.writeFile(outputFile, FILE_HEADER + result, "utf8");
}

export default async function processDir(templateDir: string, outputDir: string, values: { [name: string]: string }) {
    try { await fs.promises.mkdir(outputDir); } catch (err) {
        if (err.code !== "EEXIST") throw err;
    }
    const templateFiles = await fs.promises.readdir(templateDir);
    await Promise.all(templateFiles.map(
        name => processFile(path.join(templateDir, name), path.join(outputDir, name), values)));
}