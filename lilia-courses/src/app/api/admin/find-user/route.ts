import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email obligatoriu" }, { status: 400 });
  }

  // Use service role key to query auth.users
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || serviceKey === "PASTE_FROM_SUPABASE_SERVER_ONLY") {
    return NextResponse.json({ 
      error: "Cheia service role nu este configurată. Adaugă SUPABASE_SERVICE_ROLE_KEY în .env.local" 
    }, { status: 500 });
  }

  if (!supabaseUrl) {
    return NextResponse.json({ error: "URL Supabase nu este configurat" }, { status: 500 });
  }

  try {
    const supabase = createClient(
      supabaseUrl,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error("Supabase admin API error:", error);
      return NextResponse.json({ 
        error: `Eroare la interogarea utilizatorilor: ${error.message}. Verifică cheia service role.` 
      }, { status: 500 });
    }

    if (!data || !data.users) {
      return NextResponse.json({ error: "Nu s-au returnat date despre utilizatori" }, { status: 500 });
    }

    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return NextResponse.json({ error: "Utilizator negăsit. Asigură-te că utilizatorul există în Supabase Auth." }, { status: 404 });
    }

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (err: any) {
    console.error("Find user error:", err);
    return NextResponse.json({ 
      error: `Eroare server: ${err?.message || "Eroare necunoscută"}` 
    }, { status: 500 });
  }
}

