import multer from "multer";

const storage = multer.memoryStorage(); // file ko memory mein rakhta hai, disk pe nahi
export const upload = multer({ storage });
