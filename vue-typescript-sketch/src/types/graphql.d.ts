export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Time: any;
};

export enum Access {
  Owner = "OWNER",
  Viewer = "VIEWER"
}

export type File = Moao & {
  __typename?: "File";
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
  name: Scalars["String"];
  mimeType: Scalars["String"];
  size: Scalars["Int"];
  type: FileProvider;
};

export enum FileProvider {
  Dropbox = "DROPBOX",
  GoogleDrive = "GOOGLE_DRIVE"
}

export type Moao = {
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  createProject: Project;
  updateProject: Project;
  createNotebook: Notebook;
  updateNotebook: Notebook;
  createTag: Tag;
  updateTag: Tag;
  createNote: Note;
  updateNote: Note;
};

export type MutationCreateProjectArgs = {
  input: ProjectInput;
};

export type MutationUpdateProjectArgs = {
  id: Scalars["ID"];
  input: ProjectInput;
};

export type MutationCreateNotebookArgs = {
  projectId: Scalars["ID"];
  input: NotebookInput;
};

export type MutationUpdateNotebookArgs = {
  id: Scalars["ID"];
  input: NotebookInput;
};

export type MutationCreateTagArgs = {
  input: TagInput;
};

export type MutationUpdateTagArgs = {
  id: Scalars["ID"];
  input: TagInput;
};

export type MutationCreateNoteArgs = {
  notebookId: Scalars["ID"];
  input: NoteInput;
};

export type MutationUpdateNoteArgs = {
  id: Scalars["ID"];
  input: NoteInput;
};

export type Note = Moao & {
  __typename?: "Note";
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
  name: Scalars["String"];
  text: Scalars["String"];
  number: Scalars["Int"];
  fileCount: Scalars["Int"];
  access: Access;
  globallyShared: Scalars["Boolean"];
  tags: Array<Tag>;
};

export type Notebook = Moao & {
  __typename?: "Notebook";
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
  name: Scalars["String"];
  description: Scalars["String"];
};

export type NotebookInput = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type NoteInput = {
  name: Scalars["String"];
  text: Scalars["String"];
  tagsIds: Array<Scalars["String"]>;
};

export type Project = Moao & {
  __typename?: "Project";
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
  name: Scalars["String"];
  description: Scalars["String"];
  notebooks: Array<Notebook>;
};

export type ProjectInput = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  projects: Array<Project>;
  notebooks: Array<Notebook>;
    note: Note;
  notes: QursorResult;
  files: Array<File>;
  tagQuery: Array<Tag>;
  tagRelations: Array<Tag>;
    tags: Array<Tag>;
};

export type QueryNotebooksArgs = {
  projectId: Scalars["ID"];
};

export type QueryNoteArgs = {
    noteId: Scalars["ID"];
};

export type QueryNotesArgs = {
  notebookId: Scalars["ID"];
  filter: Scalars["String"];
  cursor: Scalars["String"];
};

export type QueryFilesArgs = {
  noteId: Scalars["ID"];
  sync: Scalars["Boolean"];
};

export type QueryTagQueryArgs = {
  queryString: Scalars["String"];
};

export type QueryTagRelationsArgs = {
  notebookId: Scalars["ID"];
};

export type QueryTagsArgs = {
    tagIds: Array<Scalars["ID"]>;
};

export type QursorResult = {
  __typename?: "QursorResult";
  qursor: Scalars["String"];
  result: Array<Moao>;
};

export type Tag = Moao & {
  __typename?: "Tag";
  id: Scalars["ID"];
  createTime: Scalars["Time"];
  updateTime?: Maybe<Scalars["Time"]>;
  deleteTime?: Maybe<Scalars["Time"]>;
  name: Scalars["String"];
  description: Scalars["String"];
  count: Scalars["Int"];
  isPrivate: Scalars["Boolean"];
  synonyms: Array<Scalars["String"]>;
  relations: Array<Scalars["String"]>;
};

export type TagInput = {
  name: Scalars["String"];
  description: Scalars["String"];
  synonyms?: Maybe<Array<Scalars["String"]>>;
};
