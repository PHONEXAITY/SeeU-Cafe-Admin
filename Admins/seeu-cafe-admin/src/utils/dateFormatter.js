export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '/');
  };
  
  export const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('lo-LA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '/');
  };