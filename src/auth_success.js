const params = new URLSearchParams(window.location.search);
const token = params.get('access_token');
window.opener.authorize(token);
window.close();
