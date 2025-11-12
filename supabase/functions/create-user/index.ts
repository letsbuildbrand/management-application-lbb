import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, firstName, lastName, role, companyName } = await req.json();

    // Create a Supabase client with the service_role_key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create the user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: role,
        username: firstName, // Default username
        company_name: companyName, // For client role
      },
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return new Response(JSON.stringify({ error: authError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const newUserId = authData.user?.id;

    if (!newUserId) {
      throw new Error("User ID not returned after creation.");
    }

    // Manually insert into public.profiles table
    const { error: profileInsertError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUserId,
        username: firstName, // Using firstName as username
        first_name: firstName,
        last_name: lastName,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}`, // Default avatar
        role: role,
        monthly_credits: role === 'client' ? 5 : 0, // Default credits for client
        credits_remaining: role === 'client' ? 5 : 0,
        status: 'Active',
      });

    if (profileInsertError) {
      console.error("Supabase Profile Insert Error:", profileInsertError);
      // Consider rolling back auth user creation if profile insert fails, or handle gracefully
      return new Response(JSON.stringify({ error: `Failed to create user profile: ${profileInsertError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // If the new user is a client, create a corresponding entry in the clients table and user_client_mapping
    if (role === 'client' && companyName) {
      const { data: clientCompanyData, error: clientCompanyError } = await supabaseAdmin
        .from('clients')
        .insert({
          name: companyName,
          status: 'Active',
        })
        .select('id')
        .single();

      if (clientCompanyError) {
        console.error("Supabase Client Company Insert Error:", clientCompanyError);
        return new Response(JSON.stringify({ error: `Failed to create client company: ${clientCompanyError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }

      if (clientCompanyData?.id) {
        const { error: mappingError } = await supabaseAdmin
          .from('user_client_mapping')
          .insert({
            user_id: newUserId,
            client_id: clientCompanyData.id,
          });

        if (mappingError) {
          console.error("Supabase User Client Mapping Insert Error:", mappingError);
          return new Response(JSON.stringify({ error: `Failed to create user-client mapping: ${mappingError.message}` }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          });
        }
      }
    }

    return new Response(JSON.stringify({ message: 'User created successfully', user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});