import { appDirectorName, fileEncoding, welcomeFileName } from "@shared/constants";
import { NoteInfo } from "@shared/models";
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from "@shared/types";
import { dialog } from "electron";
import { ensureDir, readFile, readdir, remove, stat, writeFile } from "fs-extra";
import { homedir } from "os";
import { isEmpty } from "lodash";
import path from "path";
import welcomeNoteFile from "../../../resources/welcomeNote.md?asset";

export const getRootDir = () => {
  return path.join(homedir(), appDirectorName);
};

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  });

  const notes = notesFileNames.filter((fileName) => fileName.endsWith(".md"));

  if (isEmpty(notes)) {
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding });

    // Create the welcome note
    await writeFile(path.join(rootDir, welcomeFileName), content, { encoding: fileEncoding });

    notes.push(welcomeFileName);
  }

  return Promise.all(notes.map(getNoteInfoFromFilename));
};

export const getNoteInfoFromFilename = async (fileName: string): Promise<NoteInfo> => {
  const fileStats = await stat(path.join(getRootDir(), fileName));

  return {
    title: fileName.replace(/\.md$/, ""),
    lastEditTime: fileStats.mtimeMs
  };
};

export const readNote: ReadNote = async (fileName) => {
  const rootDir = getRootDir();

  return readFile(path.join(rootDir, `${fileName}.md`), { encoding: fileEncoding });
};

export const writeNote: WriteNote = async (fileName, content) => {
  const rootDir = getRootDir();

  return writeFile(path.join(rootDir, `${fileName}.md`), content, { encoding: fileEncoding });
};

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir();

  await ensureDir(rootDir);

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: "New note",
    defaultPath: path.join(rootDir, "Untitled.md"),
    buttonLabel: "Create",
    properties: ["showOverwriteConfirmation"],
    showsTagField: false,
    filters: [{ name: "Markdown", extensions: ["md"] }]
  });

  if (canceled || !filePath) {
    console.log("Note creation canceled.");
    return false;
  }

  const { name: fileName, dir: parentDir } = path.parse(filePath);
  if (parentDir != rootDir) {
    await dialog.showMessageBox({
      type: "error",
      title: "Creation failed",
      message: "All notes must be saved under root directory, avoid using other directories."
    });

    return false;
  }

  await writeFile(filePath, "");

  return fileName;
};

export const deleteNote: DeleteNote = async (fileName) => {
  const rootDir = getRootDir();

  const { response } = await dialog.showMessageBox({
    type: "warning",
    title: "Delete note?",
    message: `Are you sure you want to delete "${fileName}"?`,
    buttons: ["Delete", "Cancel"], // 0 is Delete button, 1 is Cancel button
    defaultId: 1,
    cancelId: 1
  });

  if (response === 1) {
    console.log("Note deletion canceled.");
    return false;
  }

  await remove(path.join(rootDir, `${fileName}.md`));
  return true;
};
