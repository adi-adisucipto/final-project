import axios from "axios"

export async function getAdminUsers(accessToken: string) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return data
}

export async function updateAdminUserRole(
  userId: string,
  role: "user" | "admin",
  accessToken: string
) {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return data
}

export async function deleteAdminUser(userId: string, accessToken: string) {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return data
}
