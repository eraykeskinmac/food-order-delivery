import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post('/login') // login route and last here  (8.17)

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Hello vendor" });
});

export { router as vendorRoute };
