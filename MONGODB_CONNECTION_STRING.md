# MongoDB Connection String Guide

## Your Connection String

### Current (without query parameters):
```
mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans
```

### Recommended (with query parameters):
```
mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans?retryWrites=true&w=majority
```

## Connection String Breakdown

| Part | Your Value | Description |
|------|-----------|-------------|
| **Protocol** | `mongodb+srv://` | MongoDB connection protocol |
| **Username** | `s6384222_db_user` | Your database username |
| **Password** | `Samarth21#` | Your password (URL encoded as `Samarth21%23`) |
| **Cluster** | `cluster0.tn0bgql.mongodb.net` | Your MongoDB Atlas cluster |
| **Database** | `ans` | Your database name |
| **Query Params** | `?retryWrites=true&w=majority` | Connection options (recommended) |

## Query Parameters Explained

- `retryWrites=true` - Automatically retry write operations if they fail
- `w=majority` - Wait for write acknowledgment from majority of replica set members

## Usage

### For Development (backend/.env):
```env
MONGODB_URI=mongodb+srv://s6384222_db_user:Samarth21%23@cluster0.tn0bgql.mongodb.net/ans?retryWrites=true&w=majority
```

### For Production (Render/Railway):
Set the same value in your deployment platform's environment variables.

## Important Notes

1. **Password Encoding**: The `#` in your password is URL-encoded as `%23`
2. **Database Name**: Your database is `ans` (not `gms`)
3. **Query Parameters**: Adding `?retryWrites=true&w=majority` is recommended for better reliability

## Security Warning

⚠️ **Never commit your `.env` file to Git!** It contains sensitive credentials.

---

**Last Updated**: January 6, 2026
