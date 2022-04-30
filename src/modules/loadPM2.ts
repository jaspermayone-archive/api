import io from "@pm2/io";


export const loadPM2 = async (): Promise<void> => {
    try {
        await io.init()
    } catch (e) {
        console.error(e);
    }
}