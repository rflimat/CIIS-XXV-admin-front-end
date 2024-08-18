import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import URI from "src/contexts/url-context";
import { format } from "date-fns";

export const ConferenceForm = ({ conference, handleSubmit = () => {} }) => {
  const [isActive, setIsActive] = useState(1);
  const [event, setEvent] = useState(0);
  const [speaker, setSpeaker] = useState(0);
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    if (conference && conference.active) {
      setIsActive(Number(conference.active));
    }
    if (conference && conference.idEvent) {
      setEvent(Number(conference.idEvent));
    }
    if (conference && conference.idSpeaker) {
      setSpeaker(Number(conference.idSpeaker));
    }
  }, [conference]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = await fetch(`${URI.events.src}`, {
          method: "GET",
          credentials: "include",
        });

        data = await data.json();
        setEvents(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSpeakers = async () => {
      try {
        let data = await fetch(`${URI.speakers.src}`, {
          method: "GET",
          credentials: "include",
        });

        data = await data.json();
        data = data.map((speaker) => {
          speaker.completeName = `${speaker.name} ${speaker.lastname}`;
          return speaker;
        });
        setSpeakers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
    fetchSpeakers();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <form onSubmit={(e) => {
            handleSubmit(e, speaker);
          }}>
            <Card>
              <CardHeader
                subheader="Rellenar los campos con la información necesaria"
                title="Formulario"
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={12}>
                      <TextField
                        fullWidth
                        label="Tema"
                        name="topic"
                        defaultValue={conference && conference.topic}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Fecha y Hora Inicio"
                        name="startDateTime"
                        type="datetime-local"
                        defaultValue={
                          conference &&
                          format(new Date(conference.starDateTime), "yyyy-MM-dd hh:mm:ss")
                        }
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Fecha y Hora Fin"
                        name="expDateTime"
                        type="datetime-local"
                        defaultValue={
                          conference &&
                          format(new Date(conference.expDateTime), "yyyy-MM-dd hh:mm:ss")
                        }
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Evento</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="idEvent"
                          value={event}
                          label="Evento"
                          onChange={(event) => {
                            setEvent(Number(event.target.value));
                          }}
                          required
                        >
                          {events.map((event, key) => (
                            <MenuItem key={key} value={event.id_event}>
                              {event.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={5}>
                      <Autocomplete
                        fullWidth
                        value={speaker && speakers.find((v) => Number(v.id) === Number(speaker))}
                        onChange={(event, value) => {
                          if (value) {
                            setSpeaker(Number(value.id));
                          } else {
                            setSpeaker(0);
                          }
                        }}
                        options={speakers}
                        label="Ponente"
                        getOptionLabel={(option) => option.completeName || ""}
                        renderInput={(params) => <TextField {...params} label="Ponente" />}
                        required
                      ></Autocomplete>
                    </Grid>

                    <Grid xs={12} md={3}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-chip-label">Activo</InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          name="isActive"
                          value={isActive}
                          label="Event"
                          onChange={(event) => {
                            setIsActive(Number(event.target.value));
                          }}
                          required
                        >
                          <MenuItem value={1}>Si</MenuItem>
                          <MenuItem value={0}>No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
