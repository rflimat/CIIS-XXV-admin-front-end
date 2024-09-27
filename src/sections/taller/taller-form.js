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
import { useRouter } from "next/router";

export const TallerForm = ({ taller, handleSubmit = () => {} }) => {
  const [isActive, setIsActive] = useState(1);
  const [event, setEvent] = useState(0);
  const [speaker, setSpeaker] = useState(0);
  const [isMorning, setIsMorning] = useState(0);
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (taller && taller.active) {
      setIsActive(Number(taller.active));
    }
    if (taller && taller.idEvent) {
      setEvent(Number(taller.idEvent));
    }
    if (taller && taller.idSpeaker) {
      setSpeaker(Number(taller.idSpeaker));
    }
    if (taller && taller.isMorning) {
      setIsMorning(Number(taller.isMorning));
    }
  }, [taller]);

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
          <form
            onSubmit={(e) => {
              handleSubmit(e, speaker);
            }}
          >
            <Card>
              <CardHeader
                subheader="Rellenar los campos con la información necesaria"
                title="Formulario"
              />
              <CardContent sx={{ pt: 0 }}>
                <Box sx={{ m: -1.5 }}>
                  <Grid container spacing={3}>
                    <Grid xs={12} md={9}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="name"
                        defaultValue={taller && taller.name}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Fecha"
                        name="date"
                        type="date"
                        defaultValue={taller && taller.date}
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Fecha y Hora Inicio"
                        name="startDateTime"
                        type="datetime-local"
                        defaultValue={
                          taller && format(new Date(taller.starDateTime), "yyyy-MM-dd HH:mm:ss")
                        }
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Fecha y Hora Fin"
                        name="expDateTime"
                        type="datetime-local"
                        defaultValue={
                          taller && format(new Date(taller.expDateTime), "yyyy-MM-dd HH:mm:ss")
                        }
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Precio"
                        name="price"
                        type="text"
                        defaultValue={taller && taller.price}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Lugar"
                        name="place"
                        defaultValue={taller && taller.place}
                        required
                      />
                    </Grid>
                    <Grid xs={12} md={2}>
                      <TextField
                        fullWidth
                        label="Tickets"
                        name="price"
                        type="text"
                        defaultValue={taller && taller.tickets}
                        required
                      />
                    </Grid>
                    {taller ? (
                      <>
                        <Grid xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Tickets Disponibles"
                            name="avaible"
                            type="text"
                            defaultValue={taller && taller.avaible}
                            disabled
                          />
                        </Grid>
                        <Grid xs={12} md={2}>
                          <TextField
                            fullWidth
                            label="Inscritos"
                            name="avaible"
                            type="text"
                            defaultValue={taller && taller.tickets - taller.avaible}
                            disabled
                          />
                        </Grid>
                      </>
                    ) : <Grid xs={12} md={4}></Grid>}
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
                  </Grid>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    router.push("/taller");
                  }}
                >
                  Cancelar
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </>
  );
};
