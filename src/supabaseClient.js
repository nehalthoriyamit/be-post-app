const { createClient } = require("@supabase/supabase-js");
const { ENV_VAR } = require("./utils/envConstants");

const supabase = createClient(ENV_VAR.SUPABASE_URL, ENV_VAR.SUPABASE_KEY);

module.exports = supabase;
