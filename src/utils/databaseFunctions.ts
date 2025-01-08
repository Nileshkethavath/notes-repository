import { rtdb } from '../configurations/FirebaseConfig';
import { ref, set, get, update, remove } from "firebase/database";


class Note {
    constructor(
        url: string,
        note: string,
        noteTitle: string,
        createdAt: string,
        password: string
    ) {

        this.url = url;
        this.note = note;
        this.noteTitle = noteTitle;
        this.createdAt = createdAt;
        this.password = password;
    }

    url: string
    note: string
    noteTitle: string
    createdAt: string
    password: string
}


export const getNote = async (url: string) => {

    let obj = {
        isDataExist: false,
        data: new Note(url,'','','',''),
    }

    try {
        const snapshot = await get(ref(rtdb, `/${url}`));
        if (snapshot.exists()) {
            obj.isDataExist = true;
            obj.data = snapshot.val();
        } else {
            obj.isDataExist = false;
        }
    } catch (error) {
        console.error("Failed to get the Data", error);
    }

    return obj;
}

export const createOrUpdateNote = async (data: Note) => {

    try {
        await set(ref(rtdb, `/${data.url}`), data);

    } catch (error) {
        console.error("Error creating data: ", error);
    }

};


export const getOrCreate = async (url: string, data?: Note) => {

    let dataObj = {
        isDataExist: false,
        data: new Note('','','','',''),
    }

    try {
        const value = await getNote(url);
        dataObj = value;

        if (!value.isDataExist) {
            const note = data || new Note(url, "", "", "", "");
            await createOrUpdateNote(note);
        }
    }
    catch (error) {
        console.error("Error creating data: ", error);
    }

    return dataObj;

}

export const updateNote = async (
        url: string,
        data: {
            url?: string,
            note?: string,
            noteTitle?: string,
            createdAt?: string,
            password?: string
        }
    ) => {

        try{
            const obj = await getNote(url);
            if(obj.isDataExist){
                await update(ref(rtdb,`/${url}`), {...data});
            }
        }
        catch(error){
            console.error('Updation failed in DB.', error)
        }
}


export const removeNote = async (url: string) => {

    try{
        const data = await getNote(url);
        if(data.isDataExist){
            remove(ref(rtdb, `/${url}`));
        }
    }catch(error){
        console.error("Error while getting or removing", error);
    }
}

export const updateNoteKey = async (oldUrl: string, newUrl: string) => {

    let dataExist = false;

    try{
        const {isDataExist, data} = await getNote(oldUrl);
        dataExist = isDataExist;
        if(isDataExist){
            data.url = newUrl;
            getOrCreate(newUrl, data);
            removeNote(oldUrl)
        }
    }catch(error){
        console.error("Error while getting or removing", error);
    }

    return { dataExist}
} 


export const checkForPassword = async (url: string) => {

    const {isDataExist, data} = await getNote(url)
    
    if(isDataExist && data.password){
        return true;
    }

    return false;
} 

//used to check whether the given url is present in db or not
const checkInDb = (url: string) => {

}

export const patchData = () => { }