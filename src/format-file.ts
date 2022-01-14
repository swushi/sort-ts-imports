import readFile from "./read-file";

const importRegex = /^import(.|\n)*?from '(.+)';?/gm;

export default async function formatFile(path: string) {
  const { lines, rawFile } = await readFile(path);

  const matches = rawFile.toString().match(importRegex);
  console.log(matches);
}
