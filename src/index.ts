import { Command } from "commander";
import { Options } from "./types";

import formatFile from "./format-file";

const program = new Command();

program
  .option(
    "-f --file <file-path>",
    "Path of the file that you want to format the imports for."
  )
  .option(
    "-r --recursive",
    "Recursively format every .tsx? file in the directory."
  )
  .parse(process.argv);

const options = program.opts<Options>();

async function main() {
  if (options.recursive) {
    console.log("Listing to **/*.ts files for chanes");
    process.exit(0);
  }
  
  if (options.file) {
    formatFile(options.file);
  }
}

main();
