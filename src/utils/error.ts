export function catchActionErrors(action: (...args: any[]) => any) {
    return (...args: any[]) => {
        try {
            const returned = action(...args);
            if (typeof returned.catch !== "undefined") {
                returned.catch((e: any) => {
                    console.error("Error:", typeof e.message === "undefined" || process.env.VERBOSE ? e : e.message);
                });
            }
        } catch (e) {
            console.error("Error:", typeof e.message === "undefined" || process.env.VERBOSE ? e : e.message);
        }
    };
}
