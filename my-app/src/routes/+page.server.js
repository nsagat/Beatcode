import { supabase } from '$lib/supabaseClient';

// Sign up a new user
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return console.error('Signup error:', error.message)
  console.log('User signed up:', data.user)
}

// Sign in an existing user
async function signIn(email, password,LeetcodeID) {
  const { data: session_data, error: error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return console.error('Login error:', error.message)
  console.log('User logged in:', session_data.user)
  //leetcodeID
  const {data: userdata, error: insertError} = await supabase
    .from('userdata')
    .insert([{ id: session_data.session.user.id, LeetcodeID: LeetcodeID }])
    .select()
    if (insertError) return console.error('Error inserting user data:', insertError.message)
        console.log('User data inserted:', userdata)


}