import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "db.json");
let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.access(dataFilePath);
}

export async function readDb() {
  await ensureDataFile();
  const content = await fs.readFile(dataFilePath, "utf8");
  const normalized = content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
  return JSON.parse(normalized);
}

export async function writeDb(updater) {
  writeQueue = writeQueue.then(async () => {
    const currentData = await readDb();
    const result =
      typeof updater === "function" ? await updater(structuredClone(currentData)) : updater;
    const isWrapped =
      result &&
      typeof result === "object" &&
      Object.prototype.hasOwnProperty.call(result, "db") &&
      Object.prototype.hasOwnProperty.call(result, "result");
    const nextData = isWrapped ? result.db : result;
    const returnValue = isWrapped ? result.result : result;

    if (!nextData || typeof nextData !== "object" || Array.isArray(nextData)) {
      throw new Error("writeDb expected a database object");
    }

    const tempFile = `${dataFilePath}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(nextData, null, 2), "utf8");
    await fs.rename(tempFile, dataFilePath);
    return returnValue;
  });

  return writeQueue;
}
