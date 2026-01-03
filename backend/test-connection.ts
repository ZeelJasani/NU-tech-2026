import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("URL:", supabaseUrl);
console.log("Key Length:", supabaseKey ? supabaseKey.length : "MISSING");

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function testConnection() {
    try {
        console.log("Testing connection...");
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Connection Successful!");
        }
    } catch (err) {
        console.error("Exception:", err);
    }
}

testConnection();
