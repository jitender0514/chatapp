
const handleFailedResponse = (error) => {
  alert(error.message);
};

const setHeaders = () => {
    return {Authorization: `Token ${TOKEN}`};
}


const fetchUsersApi = async (
  params = null,
) => {
  const url = params
    ? "/api/users/?" + new URLSearchParams(params)
    : "/api/users/";

  const response = await fetch(url, {headers: setHeaders()});
  if (!response.ok) {
    console.error("Error:", response.message);
    handleFailedResponse(response);
  }
  return await response.json();
};

const fetchRoomsApi = async (
  params = null,
) => {
  const url = params
    ? "/api/rooms/?" + new URLSearchParams(params)
    : "/api/rooms/";

  const response = await fetch(url, {headers: setHeaders()});
  if (!response.ok) {
    console.error("Error:", response.message);
    handleFailedResponse(response);
    return;
  }
  return await response.json();
};

const fetchMessagesApi = async (
  roomId,
  params = null,
) => {
  const url = params
    ? `/api/${roomId}/messages/?` + new URLSearchParams(params)
    : `/api/${roomId}/messages/`;

  const response = await fetch(url, {headers: setHeaders()});
  if (!response.ok) {
    console.error("Error:", response.message);
    handleFailedResponse(response);
    return;
  }
  return await response.json();
  
};

const createRoomApi = async (
  formData,
) => {
  const response = await fetch("/api/rooms/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...setHeaders()
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    console.error("Error:", response.message);
    handleFailedResponse(response);
    return;
  }
  return await response.json();
};
