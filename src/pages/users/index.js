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
import { UsersTable } from "src/sections/users/users-table";
import URI from "src/contexts/url-context";
import { useRouter } from "next/router";
import NextLink from "next/link";
import CustomDialog from "src/components/dialog";
import { useDialog } from "src/hooks/use-dialog";
import { applyPagination } from "src/utils/apply-pagination";
import { UsersSearch } from "src/sections/users/users-search";
import { searchInArray } from "src/utils/search-in-array";

const Page = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [toDelete, setToDelete] = useState();
  const deleteDialog = useDialog();
  const successDialog = useDialog();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let selected = searchInArray(users, search);
    setSelected(applyPagination(selected, page, rowsPerPage));
    setTotal(selected.length);
  }, [users, search, page, rowsPerPage]);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      let data = await fetch(`${URI.users.src}`, {
        method: "GET",
        credentials: "include",
      });

      data = await data.json();
      setUsers(applyPagination(data, page, rowsPerPage));
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

  const userId = (user) => {
    router.push(`/users/edit/${user.id}`);
  };

  const deleteUser = (user) => {
    deleteDialog.handleToggle();
    setToDelete(user);
  };

  const yesHandle = () => {
    deleteDialog.handleToggle();

    fetch(`${URI.users.one(toDelete.id)}`, {
      method: "DELETE",
      credentials: "include",
    }).then(async (res) => {
      if (!res.ok) {
        let serverResponse = await res.json();
        throw serverResponse;
      }
      successDialog.handleToggle();
      setToDelete(undefined);
      fetchUsers();
    });
  };

  return (
    <>
      <Head>
        <title>Creación de Cuenta</title>
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
              <Typography variant="h4">Usuarios</Typography>
            </div>
            <div>
              <Button
                component={NextLink}
                href="/users/add"
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
              <UsersSearch search={search} setSearch={handleFilterSearch} />
            </div>
            <div>
              <Grid xs={12} md={6} lg={8}>
                {!loading && (
                  <UsersTable
                    count={total}
                    items={selected}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 100]}
                    userId={userId}
                    deleteUser={deleteUser}
                  />
                )}
              </Grid>
              <CustomDialog
                open={deleteDialog.open}
                onClose={deleteDialog.handleToggle}
                type="none"
                message="¿Esta seguro de eliminar usuario?"
                yesorno={true}
                yesHandle={yesHandle}
                noHandle={deleteDialog.handleToggle}
              />
              <CustomDialog
                open={successDialog.open}
                onClose={successDialog.handleToggle}
                type="success"
                message="Cuenta eliminada con éxito"
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
