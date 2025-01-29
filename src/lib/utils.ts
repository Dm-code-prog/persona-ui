import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function atUTC(date: string) {
    if (date.endsWith("Z")) {
        return date;
    } else {
        return date + "Z";
    }
}
