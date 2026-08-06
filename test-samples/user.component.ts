// Sample component template used in tests — keep as plain export to avoid Angular dependency in build
export const UserComponentTemplate = `
  <div>
    <h1>User Profile</h1>
    <h3>Details</h3> <!-- Skipping h2 -->
    
    <img src="avatar.png"> <!-- Missing alt -->
    
    <button>Save</button>
    <button></button> <!-- Missing name -->
  </div>
`;
