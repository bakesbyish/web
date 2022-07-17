import { storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { IFile } from 'interfaces/utils';

/**
 * @description - Uploads file to firebase and returns the URL
 * @param {IFile} - The file that needs to be uploaded to firebase storage bucket
 * @param {string} - The path that the uploaded file will be stored
 * @param {string} [filename] - The name of the file once ot is uploaded
 * if not specified the name on upload will be used as teh filename
 * @returns {string | null} - The download URL if the upoad was succsessfull else null
 * */
export const uploadToStorage = async (
  file: IFile,
  path: string,
  filename?: string
): Promise<string | null> => {
  // Get the filename
  const name = filename ? filename : file.name;

  const metadata = {
    contentType: file.type,
  };

  const storageRef = ref(storage, `${path}/${name}`);

  const uploadTask = uploadBytes(storageRef, file, metadata);

  try {
    const snapshot = await uploadTask;
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    return null;
  }
};
