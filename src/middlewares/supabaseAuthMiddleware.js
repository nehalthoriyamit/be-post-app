const supabase = require("../supabaseClient");

// Supabase authentication middleware
const authenticateSupabase = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Authorization token is required');
  }
  
  const { data, error } = await supabase.auth.api.getUser(token);
  
  if (error || !data) {
    return res.status(401).send('Invalid or expired token');
  }
  
  req.user = data;
  next();
};

module.exports = { authenticateSupabase }