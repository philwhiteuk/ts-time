import {Duration} from "./Duration";

export function sleep(duration: Duration): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration.milliseconds))
}