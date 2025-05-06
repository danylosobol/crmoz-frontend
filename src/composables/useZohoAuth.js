export function useZohoAuth() {
  const openZohoOAuth = (clientId, endpoint) => {
    const baseUrl = 'https://accounts.zoho.com/oauth/v2/auth'
    const params = new URLSearchParams({
      scope: 'ZohoCRM.modules.ALL',
      client_id: clientId,
      response_type: 'code',
      access_type: 'offline',
      redirect_uri: endpoint,
      prompt: 'consent',
    })

    const fullUrl = `${baseUrl}?${params.toString()}`
    window.open(fullUrl, '_self')
  }

  return {
    openZohoOAuth,
  }
}
