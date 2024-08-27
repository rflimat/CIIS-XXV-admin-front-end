import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import URI from "src/contexts/url-context";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import DescriptionIcon from '@mui/icons-material/Description';
import NextLink from "next/link";
import { SponsorCards } from "src/sections/sponsors/sponsor-cards";
import { useDialog } from "src/hooks/use-dialog";
import CustomDialog from "src/components/dialog";
import { useRouter } from "next/router";

const Page = () => {
  const [sponsors, setSponsors] = useState([]);
  const [events, setEvents] = useState([]);
  const [showOption, setShowOption] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();
  const router = useRouter();

  const sponsorId = (sponsor) => {
    router.push(`/sponsors/edit/${sponsor.id}`);
  };

  const deleteSponsor = (sponsor) => {
    deleteDialog.handleToggle();
    setToDelete(sponsor);
  };

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.sponsors.one(toDelete.id)}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw serverResponse;
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchSponsors(showOption);
    });
  };

  const fetchSponsors = async (showOption) => {
    setErrorMsg(null);
    try {
      let response = await fetch(URI.events.src + `/${showOption}/sponsors`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        setSponsors(null);
        let { error } = await response.json();
        throw error;
      }
      let data = await response.json();
      setSponsors(data);
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

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
    if (showOption > 0) {
      fetchSponsors(showOption);
    }
  }, [showOption]);

  const handleChangeFilter = useCallback((event) => {
    setShowOption(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title>Sponsors | CIIS</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" mb={2}>
                  Sponsors
                </Typography>

                <div>
                  <Button
                    component={NextLink}
                    href="/sponsors/add"
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

                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">Filtro</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={showOption}
                    label="Event"
                    onChange={handleChangeFilter}
                  >
                    {events.map((event, index) => (
                      <MenuItem key={index} value={event.id_event}>
                        {event.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Filtro de listado de eventos</FormHelperText>
                </FormControl>
              </Stack>
            </Stack>

            <div>
              <Grid md={12} lg={12}>
                {!sponsors ? (
                  errorMsg
                ) : (
                  <SponsorCards
                    items={sponsors}
                    sponsorId={sponsorId}
                    deleteSponsor={deleteSponsor}
                  />
                )}
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar sponsor?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Sponsor eliminado con éxito"
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
