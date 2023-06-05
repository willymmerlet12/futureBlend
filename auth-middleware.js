import admin from "./firebase-config";

class Middleware {
  async decodeToken(req, res, next) {
    // Check if the authorization header exists
    if (!req.headers.authorization) {
      return res.json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodeValue = await admin.auth().verifyIdToken(token);
      if (decodeValue) {
        console.log(decodeValue);
        return next();
      }
      return res.json({ message: "Unauthorized" });
    } catch (e) {
      return res.json({ message: "Internal Error" });
    }
  }
}

export default new Middleware();
