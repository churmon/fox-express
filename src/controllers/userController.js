export async function getProfile(req, res) {
  try {
    // Better Auth attaches session info via its own middleware
    res.json({ success: true, message: "Profile route works" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
}