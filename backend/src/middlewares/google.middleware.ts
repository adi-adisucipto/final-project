import { OAuth2Client, TokenPayload } from "google-auth-library";
import { Request, Response, NextFunction } from "express";
import { GOOGLE_CLIENT_ID } from "../configs/env.config";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

interface CustomRequest extends Request {
  user?: TokenPayload;
}

export async function verifyToken(req:CustomRequest, res:Response, next:NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('No token provided');

  const token = authHeader.split(' ')[1];

  try {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    
    req.user = payload; 
    next();
  } catch (error) {
    res.status(401).send('Invalid Token');
  }
}