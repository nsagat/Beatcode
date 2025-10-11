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

//signUp('nilufersagat35@gmail.com','abc123');
signIn('nilufersagat35@gmail.com','abc123','OliveraLotus');

//const { data, error } = await supabase.auth.admin.deleteUser('1c727c38-8db8-49ec-a2b9-75c37ff04e9d');
//console.log('data', data, 'error', error);














/*
// src/routes/+page.server.js
import { supabase } from '$lib/supabaseClient';
//import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session"; // lib/server for google oauth
export const load = async () => {
  const { data, error } = await supabase
    .from('users') // Replace with your actual table name
      .select('*')
      .limit(1)
  console.log('data', data, 'error', error);
  if (error) {
    console.error('Supabase error:', error); // shows exact reason in terminal
    return { users: [], error: error.message };
  }

  return { users: data ?? [] };
};


/*
import { supabase } from '$db/connection';
export async function load() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log('data', data, 'error', error);
}
  */

/*
async function addUser(username, email) {
  const { data, error } = await supabase
    .from('users')
    .insert([{ username: username, email: email}])

  if (error) console.error('Error adding user:', error);
  else console.log('Inserted:', data);
}
async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    console.log('Sign up successful! Please check your email for confirmation.');
    console.log(data);
  }
}
addUser('BOB','bobross@gmail.com');
addUser('Alice','alice@gmail.com');
signUp('nilufersagat35@gmail.com','beatcode123');


*/
