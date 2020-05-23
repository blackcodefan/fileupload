import gql from "graphql-tag";

export const GetNotesQuery = gql`
    query getNotes($notebookId: ID!, $filter: String = "", $cursor: String = "") {
        items: notes(notebookId: $notebookId, filter: $filter, cursor: $cursor){
            qursor,result{
                id,createTime, ...on Note{name,text,number,fileCount,tags{
                    id,name
                }
                }
            }
        }
    }
`;

export const GetNoteQuery = gql`
    query getNote($noteId: ID!) {
        note(noteId: $noteId){
            id,createTime, ...on Note{name,text,number,fileCount,tags{
                id,name
            }
            }
        }
    }
`;

export const CreateNoteQuery = gql`
    mutation createNote($notebookId: ID!, $input: NoteInput!){
        createNote(notebookId: $notebookId, input: $input){
            id,createTime,name,text,number,fileCount,tags{
                id,name
            }
        }
    }
`;