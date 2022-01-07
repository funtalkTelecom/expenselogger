import {Injectable} from '@angular/core';
import { Storage } from '@capacitor/storage';

export const INTRO_KEY = 'intro-slides';

@Injectable({
    providedIn: 'root'
})
export class LocalStoreService {

    constructor() {}

    async saveToLocalStorage(key: string, value: any): Promise<void> {
        return await Storage.set({
            key,
            value: JSON.stringify(value)
        });
    }

    async getFromLocalStorage(key: string): Promise<any> {
        const ret = await Storage.get({key});
        return JSON.parse(ret.value);
    }


    async removeFromLocalStorage(key: string): Promise<void> {
        return await Storage.remove({key});
    }

    async clearLocalStorage(isReset?: boolean): Promise<void> {
        if (isReset) {
            // this.dataService.setExpenses([]);
        }
        return await Storage.clear();
    }
}
