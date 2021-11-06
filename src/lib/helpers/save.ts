export async function saveText(api: string, text: string, token: string): Promise<any> {
  const url = `${api}/files/${token}/content`;

  const data = await fetch(url, {
    method: 'put',
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  return data.json();
}