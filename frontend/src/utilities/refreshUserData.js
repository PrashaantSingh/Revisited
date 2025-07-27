
export async function refreshUserData(setUser) {

  try {
    const res = await fetch("/api/users/me"); 
    const data = await res.json();
    if (data.success) {
      const updatedUser = data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser); // or dispatch to context if using reducer
    }
  } catch (err) {
    console.error("Error refreshing user info:", err);
  }
}
