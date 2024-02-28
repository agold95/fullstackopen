export interface DiaryEntry {
    id: number,
    date: string,
    weather: string,
    visibility: string
}

export type newDiaryEntry = Omit<DiaryEntry, 'id'>