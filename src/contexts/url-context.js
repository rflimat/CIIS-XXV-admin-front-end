export const domain = "https://ciistacna.com";
//export const domain = "https://test.ciistacna.com";
//export const domain = "http://127.0.0.1:4000";

const URI = {
  sessions: domain + "/api/v2/session",
  registrations: domain + "/api/v1/registrations",
  taller: domain + "/api/v2/taller",
  reservation: {
    src: domain + "/api/v2/reservation",
    qr: domain + "/api/v2/reservation/qr",
    one: (id) => ({ src: `${domain}/api/v2/reservation/${id}` }),
  },
  attendance: (idEvent, idUser) => domain + `/api/v2/conference/event/${idEvent}/attendance?user=${idUser}`,
  conferences: {
    src: domain + "/api/v2/conference",
    one: (id) => `${domain}/api/v2/conference/${id}`,
  },
  users: {
    src: domain + "/api/v2/users",
    one: (id) => `${domain}/api/v2/users/${id}`,
  },
  speakers: {
    src: domain + "/api/v2/speakers",
    one: (id) => `${domain}/api/v2/speakers/${id}`,
  },
  sponsors: {
    src: domain + "/api/v2/sponsors",
    one: (id) => `${domain}/api/v2/sponsors/${id}`,
  },
  topics: {
    src: domain + "/api/v2/topics",
    one: (id) => `${domain}/api/v2/topics/${id}`,
  },
  events: {
    src: domain + "/api/v2/events",
    one: (id) => ({
      src: `${domain}/api/v2/events/${id}`,
      reservation: {
        ciis: `${domain}/api/v2/events/${id}/reservation/ciis`,
      },
      sponsors: {
        src: `${domain}/api/v2/events/${id}/sponsors`,
      },
      reports: {
        speakers: `${domain}/api/v2/events/${id}/speakers/json`,
        conferences: `${domain}/api/v2/events/${id}/conferences/json`,
        sponsors: `${domain}/api/v2/events/${id}/sponsors/json`,
      }
    }),
  },
};

export default URI;
