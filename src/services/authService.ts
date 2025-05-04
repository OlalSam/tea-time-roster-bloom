import { supabase } from "@/integrations/supabase/client";

export async function signUp(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string,
  role: string,
) {
  try {
    // First, create the auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role.toLowerCase
        }
      }
    });

    if (signUpError) throw signUpError;

    // Create the employee profile after successful signup
    if (authData.user) {
      // First check if the employee profile already exists
      const { data: existingEmployee, error: checkError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      // Only create the profile if it doesn't exist
      if (!existingEmployee) {
        const { error: profileError } = await supabase
          .from('employees')
          .insert({
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            role: role.toLowerCase(),
            email: email,
            position: role.toLowerCase(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          console.error('Error creating employee profile:', profileError);
          throw new Error('Failed to create employee profile. Please try again.');
        }
      }
    }

    return authData;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
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

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}
