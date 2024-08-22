import Head from "next/head";
import { useCallback, useMemo, useState, useEffect } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Button,
  SvgIcon,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import { EventsTable } from "src/sections/events/events-table";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import NextLink from "next/link";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";
import { applyPagination } from "src/utils/apply-pagination";
import { EventsSearch } from "src/sections/events/events-search";
import { searchInArray } from "src/utils/search-in-array";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let selected = searchInArray(events, search);
    setSelected(applyPagination(selected, page, rowsPerPage));
    setTotal(selected.length);
  }, [events, search, page, rowsPerPage]);

  const router = useRouter();

  const fetchEvents = async () => {
    try {
      setLoading(true);

      let data = await fetch(`${URI.events.src}`, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setEvents(data);
      setSelected(applyPagination(data, page, rowsPerPage));
      setTotal(data.length);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleFilterSearch = useCallback((event) => {
    setPage(0);
    setSearch(event.target.value);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const report = (event) => {
    router.push(`/events/report/${event.id_event}`);
  }

  const eventId = (event) => {
    router.push(`/events/edit/${event.id_event}`);
  };

  const deleteEvent = (event) => {
    deleteDialog.handleToggle();
    setToDelete(event);
  };

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.events.one(toDelete.id_event).src}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw new Error(serverResponse);
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchEvents();
    });
  };

  return (
    <>
      <Head>
        <title>Eventos</title>
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
              <Typography variant="h4">Eventos</Typography>
            </div>
            <div>
              <Button
                component={NextLink}
                href="/events/add"
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
            </div>
            <div>
              <EventsSearch search={search} setSearch={handleFilterSearch} />
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && (
                  <EventsTable
                    count={total}
                    items={selected}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    eventId={eventId}
                    deleteEvent={deleteEvent}
                    report={report}
                  />
                )}
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar evento?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Evento eliminado con éxito"
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
