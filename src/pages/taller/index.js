import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
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
import { TallerTable } from "src/sections/taller/taller-table";
import URI from "src/contexts/url-context";
import { saveOnChest } from "src/utils/chest";
import { useRouter } from "next/router";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import NextLink from "next/link";
import { applyPagination } from "src/utils/apply-pagination";
import { useDialog } from "src/hooks/use-dialog";
import CustomDialog from "src/components/dialog";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [talleres, setTalleres] = useState([]);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();

  const router = useRouter();

  useEffect(() => {
    fetchTaller();
  }, []);

  useEffect(() => {
    setSelected(applyPagination(talleres, page, rowsPerPage));
    setTotal(talleres.length);
  }, [talleres, page, rowsPerPage]);

  const fetchTaller = async () => {
    setLoading(true);

    try {
      let data = await fetch(`${URI.taller.src}`, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setTalleres(data);
      setSelected(applyPagination(data, page, rowsPerPage));
      setTotal(data.length);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setPage(0);
    setRowsPerPage(event.target.value);
  }, []);

  const tallerId = async (taller) => {
    router.push(`/taller/inscritos/${taller.id}`);
    /*try {
      let unTaller = await fetch(`${URI.taller.src}/${taller.id}`, {
        method: "GET",
        credentials: "include",
      });

      unTaller = await unTaller.json();
      saveOnChest("taller", unTaller);
      router.push("/taller/inscritos");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }*/
  };

  const tallerIdEdit = (taller) => {
    router.push(`/taller/edit/${taller.id}`);
  };

  const deleteTaller = (taller) => {
    deleteDialog.handleToggle();
    setToDelete(taller);
  };

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.taller.one(toDelete.id)}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw serverResponse;
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchTaller();
    });
  };

  return (
    <>
      <Head>
        <title>Taller específico</title>
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
              <Typography variant="h4">Lista de talleres</Typography>
            </div>
            <div>
              <Button
                component={NextLink}
                href="/taller/add"
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
              <Grid xs={12} md={6} lg={8}>
                {!loading && (
                  <TallerTable
                    count={total}
                    items={selected}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    tallerId={tallerId}
                    tallerIdEdit={tallerIdEdit}
                    deleteTaller={deleteTaller}
                  />
                )}
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar taller?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Taller eliminado con éxito"
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
