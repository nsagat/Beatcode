export async function addRoom(supabase, userId, newRoom) {
  const { data: userData, error: fetchError } = await supabase
    .from('userdata')
    .select('rooms')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching userdata:', fetchError);
    return null;
  }

  let updatedRooms;
  if (!userData) {
    // Row doesn't exist — create one
    updatedRooms = [newRoom];
    const { error: insertError } = await supabase
      .from('userdata')
      .insert([{ id: userId, rooms: updatedRooms }]);
    if (insertError) {
      console.error('Error inserting userdata:', insertError);
      return null;
    }
    return updatedRooms;
  }

  // Row exists — append or create rooms array
  const currentRooms = Array.isArray(userData.rooms) ? userData.rooms : [];
  updatedRooms = [...new Set([...currentRooms, newRoom])];

  const { data, error: updateError } = await supabase
    .from('userdata')
    .update({ rooms: updatedRooms })
    .eq('id', userId)
    .select();

  if (updateError) {
    console.error('Error updating rooms:', updateError);
    return null;
  }

  return data[0]?.rooms;
}
