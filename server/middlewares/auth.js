import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({
      success: false,
      msg: "Not authorized",
    });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {   //MongoDB kee _id...
      req.userId = tokenDecode.id;
    } else {
      res.json({
        success: false,
        msg: "Not authorized",
      });
    }

    next();
  } catch (error) {
    res.json({
      success: false,
      msg: error.msg,
    });
  }
};
