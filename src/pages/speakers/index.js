import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { SpeakerCards } from "src/sections/speakers/speaker-cards";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import DescriptionIcon from '@mui/icons-material/Description';
import NextLink from "next/link";
import { useRouter } from "next/router";
import URI from "src/contexts/url-context";
import { useCallback, useEffect, useState } from "react";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";
import { applyPagination } from "src/utils/apply-pagination";
import { searchInArray } from "src/utils/search-in-array";
import { SpeakerSearch } from "src/sections/speakers/speaker-search";
import { GridLoader } from "react-spinners";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [showOption, setShowOption] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [speakers, setSpeakers] = useState([]);
  const [events, setEvents] = useState([]);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let response = await fetch(URI.events.src, {
          method: "GET",
          credentials: "include",
        });
        let data = await response.json();
        setEvents(data);
        setShowOption(data.find((x) => x.active).id_event);
      } catch (error) {
        throw error;
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  useEffect(() => {
    setLoading(true);
    let selected = searchInArray(speakers, search);
    setSelected(applyPagination(selected, page - 1, rowsPerPage));
    setTotal(selected.length);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [speakers, search, page, rowsPerPage]);

  const router = useRouter();

  const fetchSpeakers = async () => {
    try {
      setLoading(true);

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
      setSelected(applyPagination(data, page - 1, rowsPerPage));
      setTotal(data.length);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSpeakersByEvent = async (showOption) => {
    setErrorMsg(null);
    try {
      let response = await fetch(URI.events.src + `/${showOption}/speakers`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setSpeakers([]);
        let { error } = await response.json();
        throw error;
      }
      let data = await response.json();
      setSpeakers(data);
      setSelected(applyPagination(data, page, rowsPerPage));
      setTotal(data.length);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const speakerId = (speaker) => {
    router.push(`/speakers/edit/${speaker.id}`);
  };

  const deleteSpeaker = (speaker) => {
    deleteDialog.handleToggle();
    setToDelete(speaker);
  };

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.speakers.one(toDelete.id)}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw serverResponse;
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchSpeakers();
    });
  };

  useEffect(() => {
    if (showOption > 0) {
      fetchSpeakersByEvent(showOption);
    } else {
      fetchSpeakers();
    }
  }, [showOption]);

  const handleFilterSearch = useCallback((event) => {
    setPage(1);
    setSearch(event.target.value);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleChangeFilter = useCallback((event) => {
    setShowOption(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Ponentes</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <div>
              <Typography variant="h4">Ponentes</Typography>
            </div>
            <div>
              <Button
                component={NextLink}
                href="/speakers/add"
                startIcon={
                  <SvgIcon fontSize="small">
                    <PlusIcon />
                  </SvgIcon>
                }
                sx={{ mt: 3 }}
                variant="contained"
              >
                Nuevo
              </Button>
              <Button
                component={NextLink}
                href={`/events/report/${showOption}`}
                startIcon={
                  <SvgIcon fontSize="small">
                    <DescriptionIcon />
                  </SvgIcon>
                }
                sx={{ mt: 3, ml: 2 }}
                variant="contained"
              >
                Reporte
              </Button>
            </div>
            <div>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-helper-label">Filtro</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={showOption}
                  label="Event"
                  onChange={handleChangeFilter}
                >
                  <MenuItem value={0}>Todos</MenuItem>
                  {events.map((event, index) => (
                    <MenuItem key={index} value={event.id_event}>
                      {event.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Filtro de listado de eventos</FormHelperText>
              </FormControl>
            </div>
            <div>
              <SpeakerSearch search={search} setSearch={handleFilterSearch} />
            </div>
            <div>
              <Grid md={12} lg={12}>
                {!speakers ? (
                  errorMsg
                ) : loading ? (
                  <GridLoader color="#36d7b7" size={50} />
                ) : (
                  <SpeakerCards
                    items={selected}
                    rowsPerPage={rowsPerPage}
                    total={total}
                    page={page}
                    handlePageChange={handlePageChange}
                    speakerId={speakerId}
                    deleteSpeaker={deleteSpeaker}
                  />
                )}
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar ponente?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Ponente eliminado con éxito"
              />
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
