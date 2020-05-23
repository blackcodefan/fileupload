/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createNotebook
// ====================================================

export interface createNotebook_createNotebook {
  __typename: "Notebook";
  id: string;
  name: string;
}

export interface createNotebook {
  createNotebook: createNotebook_createNotebook;
}

export interface createNotebookVariables {
  projectId: string;
  input: NotebookInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateNotebook
// ====================================================

export interface updateNotebook_updateNotebook {
  __typename: "Notebook";
  id: string;
  name: string;
}

export interface updateNotebook {
  updateNotebook: updateNotebook_updateNotebook;
}

export interface updateNotebookVariables {
  id: string;
  input: NotebookInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getProjects
// ====================================================

export interface getProjects_items {
  __typename: "Project";
  id: string;
  name: string;
}

export interface getProjects {
  items: getProjects_items[];
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: createProjec
// ====================================================

export interface createProjec_createProject {
  __typename: "Project";
  id: string;
  name: string;
}

export interface createProjec {
  createProject: createProjec_createProject;
}

export interface createProjecVariables {
  input: ProjectInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateProject
// ====================================================

export interface updateProject_updateProject {
  __typename: "Project";
  id: string;
  name: string;
}

export interface updateProject {
  updateProject: updateProject_updateProject;
}

export interface updateProjectVariables {
  id: string;
  input: ProjectInput;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotebooks
// ====================================================

export interface getNotebooks_items {
  __typename: "Notebook";
  id: string;
  name: string;
}

export interface getNotebooks {
  items: getNotebooks_items[];
}

export interface getNotebooksVariables {
  projectId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getFiles
// ====================================================

export interface getFiles_files {
  __typename: "File";
  id: string;
  createTime: any;
  updateTime: any | null;
  name: string;
  mimeType: string;
  type: FileProvider;
  size: number;
}

export interface getFiles {
  files: getFiles_files[];
}

export interface getFilesVariables {
  noteId: string;
  sync?: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getNotes
// ====================================================

export interface getNotes_items_result_Project {
  __typename: "Project" | "Notebook" | "File" | "Tag";
  id: string;
  createTime: any;
}

export interface getNotes_items_result_Note_tags {
  __typename: "Tag";
  id: string;
  name: string;
}

export interface getNotes_items_result_Note {
  __typename: "Note";
  id: string;
  createTime: any;
  name: string;
  text: string;
  number: number;
  fileCount: number;
  tags: getNotes_items_result_Note_tags[];
}

export type getNotes_items_result = getNotes_items_result_Project | getNotes_items_result_Note;

export interface getNotes_items {
  __typename: "QursorResult";
  qursor: string;
  result: getNotes_items_result[];
}

export interface getNotes {
  items: getNotes_items;
}

export interface getNotesVariables {
  notebookId: string;
  filter?: string | null;
  cursor?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FileProvider {
  DROPBOX = "DROPBOX",
  GOOGLE_DRIVE = "GOOGLE_DRIVE",
}

export interface NotebookInput {
  name: string;
  description: string;
}

export interface ProjectInput {
  name: string;
  description: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
