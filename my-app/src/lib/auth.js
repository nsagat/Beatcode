import { supabase } from '$lib/supabaseClient';

// Sign up a new user
export async function signUp(email, password, leetcodeID) {
  const { data: signupData , error: signupErr } = await supabase.auth.signUp({ email, password })
  if (signupErr) return console.error('Signup error:', signupErr.message)
  console.log('User signed up:', signupData.user)

  //Sign in The User
  const { data: session_data, error: signinErr } = await supabase.auth.signInWithPassword({ email, password })
  if (signinErr) return console.error('Signup error:', signinErr.message)
  console.log('User logged in:', session_data.user)

  //leetcodeID
  const {data: userdata, error: insertError} = await supabase
    .from('userdata')
    .insert([{ id: session_data.user.id, LeetcodeID: leetcodeID }])
    .select()
    if (insertError) return console.error('Error inserting user data:', insertError.message)
        console.log('User data inserted:', userdata)

  //Sign Out a User
  const { error: signoutErr } = await supabase.auth.signOut();
  if (signoutErr)  return console.error('Signout error:', signoutErr.message)   
}



// Sign in an existing user
export async function signIn(email, password) {
  const { data: session_data, error: error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return console.error('Login error:', error.message)
  console.log('User logged in:', session_data.user)
  return session_data;
}


export async function signOut() {
  const { error: signoutErr } = await supabase.auth.signOut();
  if (signoutErr)  return console.error('Signout error:', signoutErr.message)   
}

