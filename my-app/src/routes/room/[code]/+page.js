import { redirect } from '@sveltejs/kit';  

export async function load({ params }) {
  const { code } = params;


  // Optional: Check if room exists in your database
  // const roomExists = await checkRoomExists(code);
  // if (!roomExists) {
  //   return { roomCode: code, error: 'Room not found' };
  // }
  
  // Server-side validation
  function validateRoomCode(code) {
    return code == "2";
  }
  
  // If validation fails, you can redirect or throw an error
  if (!validateRoomCode(code)) {
    throw redirect(302, '/home');
  }
 
}
