import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import { Box, Button, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { CustomersTable } from "src/sections/customer/customers-table";
import { CustomersSearch } from "src/sections/customer/customers-search";
import { applyPagination } from "src/utils/apply-pagination";
import { GridLoader } from "react-spinners";

import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

const now = new Date();

import URI from "src/contexts/url-context";

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showOption, setShowOption] = useState(0);
  const [loading, setLoading] = useState(true); // Agregamos el estado loading
  const [customers, setCustomers] = useState([]); // Estado para almacenar los datos de los clientes
  const [total, setTotal] = useState(0);
  const [counter, setCounter] = useState(0);

  const fetchCustomers = async () => {
    try {
      let data = await fetch(URI.events.one(24).reservation.ciis + `?limit=${1000}`, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      data = data.registrations;

      // Aquí aplicamos la lógica para filtrar los clientes según el showOption y paginarlos
      let data2render = [];
      let noConfirmados = data.filter((a) => a.enrollmentstatus != 2);
      noConfirmados.sort((a, b) => a.enrollmentstatus - b.enrollmentstatus);

      if (showOption == 0) {
        let confirmados = data.filter((a) => a.enrollmentstatus == 2);
        data2render = [...noConfirmados, ...confirmados];
      } else if (showOption == 1)
        data2render = noConfirmados.filter((a) => a.enrollmentstatus == 1);
      else if (showOption == 2) data2render = data.filter((a) => a.enrollmentstatus == 2);
      else if (showOption == 3) data2render = noConfirmados.filter((a) => a.enrollmentstatus == 3);

      // Actualizamos el estado customers con los datos obtenidos y marcamos loading como falso
      setCustomers(applyPagination(data2render, page, rowsPerPage));
      setLoading(false);
      setTotal(data2render.length);
    } catch (error) {
      // Si hay un error, mostramos un mensaje o manejo de errores según tus necesidades
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Indicamos que se están cargando los datos
    fetchCustomers();
  }, [rowsPerPage, showOption, page, counter]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const handleChangeFilter = useCallback((event) => {
    setPage(0);
    setShowOption(event.target.value);
  }, []);

  const handleSetCounter = useCallback(() => {
    setCounter((val) => val + 1);
  }, []);

  return (
    <>
      <Head>
        <title>Clientes | CIIS</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl" id={counter}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4" mb={2}>
                  Clientes
                </Typography>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-helper-label">Filtro</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={showOption}
                    label="Age"
                    onChange={handleChangeFilter}
                  >
                    {/* <MenuItem value={0}>Listar todos</MenuItem> */}
                    <MenuItem value={0}>Listar Todos</MenuItem>
                    <MenuItem value={2}>Listar Observados</MenuItem>
                    <MenuItem value={1}>Listar Confirmados</MenuItem>
                  </Select>
                  <FormHelperText>Filtro de listado de presinscripciones</FormHelperText>
                </FormControl>
              </Stack>
            </Stack>
            <CustomersSearch handleSetCounter={handleSetCounter} status={showOption} />

            {loading && <GridLoader color="#36d7b7" size={50} />}
            {!loading && (
              <CustomersTable
                handleSetCounter={handleSetCounter}
                counter={counter}
                count={total}
                items={customers}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 100]}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
