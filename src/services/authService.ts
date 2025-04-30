
import { supabase } from "@/integrations/supabase/client";

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  // Create the employee profile after successful signup
  if (authData.user) {
    const { error: profileError } = await supabase.from('employees').insert({
      id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      position: 'Employee', // Default position
    });

    if (profileError) throw profileError;
  }

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
