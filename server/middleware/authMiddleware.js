import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }
    
    const token = authHeader.split(" ")[1];
 
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // attach user data
    req.user = decoded;
    req.userId = decoded.userId;

    next();

  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({
      success: false,
      message: "Auth middleware error"
    });
  }
};



export const adminOnly = (req,res,next)=>{
    try{
          if(!req.user){
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        });
    }

        if(req.user.role !== "admin"){
            return res.status(403).json({
                success:false,
                message:"Admin access only"
            });
        }

        next();

    }catch(err){
        console.log("Error in admin Only middleware : ",err);
        return res.status(500).json({success:false,message:"Admin Only middleware error"});
    }
}
