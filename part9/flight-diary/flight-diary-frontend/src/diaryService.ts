import axios from "axios";
import { DiaryEntry, newDiaryEntry } from "./types";

const baseUrl = 'http://localhost:3001/api/diaries';

export const getAllEntries = () => {
    return axios
      .get<DiaryEntry[]>(baseUrl)
      .then(response => response.data)
}

export const createEntry = (object: newDiaryEntry) => {
  return axios
    .post<DiaryEntry>(baseUrl, object)
    .then(response => response.data)
}