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
    const nextData =
      typeof updater === "function" ? await updater(structuredClone(currentData)) : updater;

    const tempFile = `${dataFilePath}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(nextData, null, 2), "utf8");
    await fs.rename(tempFile, dataFilePath);
    return nextData;
  });

  return writeQueue;
}
